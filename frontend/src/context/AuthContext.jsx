import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';
import api, { setClerkTokenGetter } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useUser();
  const { getToken, signOut } = useClerkAuth();
  const clerk = useClerk();

  const [dbUser, setDbUser] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configure token getter for Axios
  useEffect(() => {
    if (isSignedIn && getToken) {
      setClerkTokenGetter(async () => {
        try {
          const token = await getToken();
          if (token) {
            localStorage.setItem('clerk_token', token);
          }
          return token;
        } catch (e) {
          return null;
        }
      });
      if (clerkUser?.id) {
        localStorage.setItem('clerk_user_id', clerkUser.id);
      }
    } else {
      localStorage.removeItem('clerk_token');
      localStorage.removeItem('clerk_user_id');
      setClerkTokenGetter(null);
    }
  }, [isSignedIn, getToken, clerkUser]);

  // Sync Clerk profile with MongoDB whenever Clerk state changes
  useEffect(() => {
    const syncWithBackend = async () => {
      if (!clerkLoaded) return;

      if (isSignedIn && clerkUser) {
        try {
          const localRole = localStorage.getItem('clerk_selected_role');
          const clerkRole = clerkUser.unsafeMetadata?.role || clerkUser.publicMetadata?.role;

          let selectedRole = clerkRole || localRole || 'job_seeker';

          // If localRole is recruiter and Clerk metadata doesn't reflect it, persist to Clerk
          if (localRole === 'recruiter' && clerkRole !== 'recruiter') {
            selectedRole = 'recruiter';
            try {
              await clerkUser.update({
                unsafeMetadata: {
                  ...clerkUser.unsafeMetadata,
                  role: 'recruiter'
                }
              });
            } catch (metaErr) {
              console.warn('Could not update Clerk metadata:', metaErr);
            }
          }

          const syncPayload = {
            clerkId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            fullName:
              clerkUser.fullName ||
              `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
              clerkUser.username,
            avatarUrl: clerkUser.imageUrl,
            role: selectedRole
          };

          const res = await api.post('/user/sync', syncPayload);
          setDbUser(res.data.user);
          setQualifications(res.data.qualifications || []);
          setExperiences(res.data.experiences || []);

          if (res.data.user?.role) {
            localStorage.setItem('clerk_selected_role', res.data.user.role);
          }
        } catch (err) {
          console.warn('Clerk to MongoDB sync warning:', err.message);
        }
      } else {
        setDbUser(null);
        setQualifications([]);
        setExperiences([]);
      }
      setLoading(false);
    };

    syncWithBackend();
  }, [clerkLoaded, isSignedIn, clerkUser]);

  const refreshUser = async () => {
    if (!isSignedIn) return;
    try {
      const res = await api.get('/user/me');
      setDbUser(res.data.user);
      setQualifications(res.data.qualifications || []);
      setExperiences(res.data.experiences || []);
      return res.data;
    } catch (err) {
      console.error('Error refreshing user from database:', err);
    }
  };

  const switchRole = async (newRole) => {
    if (!['job_seeker', 'recruiter'].includes(newRole)) return;
    localStorage.setItem('clerk_selected_role', newRole);
    try {
      if (clerkUser) {
        await clerkUser.update({
          unsafeMetadata: {
            ...clerkUser.unsafeMetadata,
            role: newRole
          }
        });
      }
      const res = await api.put('/user/update-profile', { role: newRole });
      setDbUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.error('Failed to switch role:', err);
      throw err;
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      // If role changed, also persist to Clerk metadata and localStorage
      if (updatedData.role) {
        localStorage.setItem('clerk_selected_role', updatedData.role);
        if (clerkUser) {
          await clerkUser.update({
            unsafeMetadata: {
              ...clerkUser.unsafeMetadata,
              role: updatedData.role
            }
          });
        }
      }

      const res = await api.put('/user/update-profile', updatedData);
      setDbUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('clerk_token');
      localStorage.removeItem('clerk_user_id');
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  // Merge Clerk and MongoDB fields
  const effectiveRole =
    dbUser?.role ||
    clerkUser?.unsafeMetadata?.role ||
    clerkUser?.publicMetadata?.role ||
    localStorage.getItem('clerk_selected_role') ||
    'job_seeker';

  const mergedUser = isSignedIn && clerkUser ? {
    ...dbUser,
    _id: dbUser?._id,
    clerkId: clerkUser.id,
    userName: dbUser?.userName || clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0],
    email: clerkUser.primaryEmailAddress?.emailAddress || dbUser?.email,
    fullName: dbUser?.fullName || clerkUser.fullName || 'Job Connect User',
    avatar: dbUser?.avatar || clerkUser.imageUrl,
    role: effectiveRole,
    resume: dbUser?.resume || '',
    summary: dbUser?.summary || '',
    phoneNumber: dbUser?.phoneNumber || ''
  } : null;

  return (
    <AuthContext.Provider
      value={{
        user: mergedUser,
        clerkUser,
        dbUser,
        qualifications,
        experiences,
        loading: !clerkLoaded || loading,
        isAuthenticated: !!isSignedIn,
        isRecruiter: mergedUser?.role === 'recruiter',
        isJobSeeker: mergedUser?.role === 'job_seeker',
        logout,
        switchRole,
        updateUserProfile,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
