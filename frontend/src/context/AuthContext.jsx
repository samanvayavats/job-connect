import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Load current user profile if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await api.get('/user/me');
          setUser(res.data.user);
        } catch (err) {
          console.warn('Failed to restore session:', err.message);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (identifier, password) => {
    const res = await api.post('/user/login', {
      userName: identifier,
      password
    });

    const { user: loggedInUser, accessToken } = res.data;
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
    }
    setUser(loggedInUser);
    return res.data;
  };

  const register = async (formData) => {
    // If formData is FormData instance (for file uploads) or normal JSON
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const res = await api.post('/user/register', formData, { headers });

    const { user: registeredUser, accessToken } = res.data;
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
    }
    setUser(registeredUser);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/user/logout');
    } catch (err) {
      // Continue client logout even if server fails
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  const updateUserProfile = async (updatedData) => {
    const res = await api.put('/user/update-profile', updatedData);
    setUser(res.data.user);
    return res.data.user;
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/user/me');
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  const syncClerkUser = async (clerkUserData, selectedRole = 'job_seeker') => {
    try {
      const payload = {
        clerkId: clerkUserData.id,
        email: clerkUserData.primaryEmailAddress?.emailAddress,
        fullName: clerkUserData.fullName || clerkUserData.firstName || 'User',
        avatarUrl: clerkUserData.imageUrl || '',
        role: selectedRole
      };

      const res = await api.post('/user/clerk-sync', payload);
      const { user: syncedUser, accessToken } = res.data;
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
      }
      setUser(syncedUser);
      return syncedUser;
    } catch (err) {
      console.error('Clerk synchronization failed:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isRecruiter: user?.role === 'recruiter',
        isJobSeeker: user?.role === 'job_seeker',
        login,
        register,
        logout,
        updateUserProfile,
        refreshUser,
        syncClerkUser
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
