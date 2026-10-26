import { User } from '../models/user.model.js';
import { Qualification } from '../models/qualification.model.js';
import { Experience } from '../models/experience.model.js';
import { hashingPassword, verifyPassword } from '../utils/bcrypt.js';
import { deleteFromcloudinary, uploadFileOnCloudinary } from '../utils/cloudinary.js';
import { deleteFile } from '../utils/filehandler.js';
import jwt from 'jsonwebtoken';

const generatingTokens = async (user) => {
    try {
        const refreshToken = user.getRefreshToken();
        const accessToken = user.getAccessToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { refreshToken, accessToken };
    } catch (error) {
        console.error('Error generating tokens:', error);
        throw error;
    }
};

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
};

// User Registration
const register = async (req, res) => {
    try {
        const {
            userName,
            email,
            password,
            fullName = '',
            phoneNumber = '',
            role = 'job_seeker',
            summary = ''
        } = req.body;

        if (!userName?.trim() || !password?.trim()) {
            return res.status(400).json({
                message: 'Username and password are required'
            });
        }

        const normalizedEmail = email?.trim()?.toLowerCase() || `${userName.trim().toLowerCase()}@jobconnect.local`;

        const existingUser = await User.findOne({
            $or: [{ userName: userName.trim().toLowerCase() }, { email: normalizedEmail }]
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Username or email already in use'
            });
        }

        let avatarUrl = '';
        let resumeUrl = '';

        const avatarPath = req.files?.avatar?.[0]?.path;
        const resumePath = req.files?.resume?.[0]?.path;

        if (avatarPath) {
            try {
                const uploadAvatar = await uploadFileOnCloudinary(
                    avatarPath,
                    `${userName.trim()}-avatar`,
                    'image'
                );
                if (uploadAvatar?.secure_url) {
                    avatarUrl = uploadAvatar.secure_url;
                }
            } catch (err) {
                console.warn('Avatar upload to Cloudinary failed:', err.message);
            } finally {
                await deleteFile(avatarPath);
            }
        }

        if (resumePath) {
            try {
                const uploadResume = await uploadFileOnCloudinary(
                    resumePath,
                    `${userName.trim()}-resume`,
                    'image'
                );
                if (uploadResume?.secure_url) {
                    resumeUrl = uploadResume.secure_url;
                }
            } catch (err) {
                console.warn('Resume upload to Cloudinary failed:', err.message);
            } finally {
                await deleteFile(resumePath);
            }
        }

        const hashedPassword = await hashingPassword(password);

        const newUser = await User.create({
            userName: userName.trim().toLowerCase(),
            email: normalizedEmail,
            fullName: fullName.trim(),
            phoneNumber: phoneNumber.trim(),
            role: role === 'recruiter' ? 'recruiter' : 'job_seeker',
            password: hashedPassword,
            summary: summary.trim(),
            avatar: avatarUrl,
            resume: resumeUrl
        });

        const { accessToken, refreshToken } = await generatingTokens(newUser);

        const createdUser = await User.findById(newUser._id).select('-password -refreshToken');

        return res
            .status(201)
            .cookie('refreshToken', refreshToken, cookieOptions)
            .cookie('accessToken', accessToken, cookieOptions)
            .json({
                message: 'Registration successful',
                accessToken,
                user: createdUser
            });
    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({
            message: 'Registration failed',
            error: error.message
        });
    }
};

// User Login
const login = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const identifier = (userName || email || '').trim().toLowerCase();

        if (!identifier || !password?.trim()) {
            return res.status(400).json({
                message: 'Username/email and password are required'
            });
        }

        const user = await User.findOne({
            $or: [{ userName: identifier }, { email: identifier }]
        });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials. User not found.'
            });
        }

        const isPasswordVerified = await verifyPassword(password, user.password);

        if (!isPasswordVerified) {
            return res.status(401).json({
                message: 'Incorrect password'
            });
        }

        const { accessToken, refreshToken } = await generatingTokens(user);

        const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

        return res
            .status(200)
            .cookie('refreshToken', refreshToken, cookieOptions)
            .cookie('accessToken', accessToken, cookieOptions)
            .json({
                message: 'Login successful',
                accessToken,
                user: loggedInUser
            });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({
            message: 'Internal server error during login',
            error: error.message
        });
    }
};

// Get Current User Profile with Qualifications and Experiences
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const qualifications = await Qualification.find({ userId: req.user._id }).sort({ endingYear: -1 });
        const experiences = await Experience.find({ userId: req.user._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            user,
            qualifications,
            experiences
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching user profile',
            error: error.message
        });
    }
};

// Update General Profile Information
const updateProfile = async (req, res) => {
    try {
        const { fullName, phoneNumber, summary, role } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (fullName !== undefined) user.fullName = fullName.trim();
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber.trim();
        if (summary !== undefined) user.summary = summary.trim();
        if (role && ['job_seeker', 'recruiter'].includes(role)) {
            user.role = role;
        }

        await user.save({ validateBeforeSave: false });

        const updatedUser = await User.findById(req.user._id).select('-password -refreshToken');

        return res.status(200).json({
            user: updatedUser,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

// Clerk Single Sign-On / Synchronization Endpoint
const clerkSync = async (req, res) => {
    try {
        const { clerkId, email, fullName, avatarUrl, role = 'job_seeker' } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required from Clerk' });
        }

        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Create user
            const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user';
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            const userName = `${baseUsername}${randomSuffix}`;

            const dummyPassword = await hashingPassword(clerkId || 'clerk_authenticated_user');

            user = await User.create({
                userName,
                email: email.toLowerCase(),
                fullName: fullName || baseUsername,
                avatar: avatarUrl || '',
                role: role === 'recruiter' ? 'recruiter' : 'job_seeker',
                password: dummyPassword,
                summary: 'Registered via Clerk Authentication'
            });
        } else {
            // Update details if needed
            if (avatarUrl && !user.avatar) user.avatar = avatarUrl;
            if (fullName && !user.fullName) user.fullName = fullName;
            await user.save({ validateBeforeSave: false });
        }

        const { accessToken, refreshToken } = await generatingTokens(user);

        const safeUser = await User.findById(user._id).select('-password -refreshToken');

        return res
            .status(200)
            .cookie('refreshToken', refreshToken, cookieOptions)
            .cookie('accessToken', accessToken, cookieOptions)
            .json({
                message: 'Clerk authentication synced successfully',
                accessToken,
                user: safeUser
            });
    } catch (error) {
        console.error('Clerk Sync Error:', error);
        return res.status(500).json({
            message: 'Failed to sync Clerk account',
            error: error.message
        });
    }
};

// User Logout
const logout = async (req, res) => {
    try {
        if (req.user?._id) {
            await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
        }

        return res
            .status(200)
            .clearCookie('accessToken', cookieOptions)
            .clearCookie('refreshToken', cookieOptions)
            .json({ message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Logout error', error: error.message });
    }
};

// Refresh Access Token
const generateAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: 'Refresh token not found. Please log in again.'
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.refresh_token_secret);
        const user = await User.findById(decoded._id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: 'Invalid or revoked refresh token'
            });
        }

        const accessToken = user.getAccessToken();

        return res
            .cookie('accessToken', accessToken, cookieOptions)
            .status(200)
            .json({
                message: 'Access token refreshed',
                accessToken
            });
    } catch (error) {
        return res.status(401).json({
            message: 'Refresh token invalid or expired'
        });
    }
};

// Update Resume
const updateResume = async (req, res) => {
    try {
        const resumePath = req.file?.path;

        if (!resumePath) {
            return res.status(400).json({ message: 'Resume file is required' });
        }

        const uploadedResume = await uploadFileOnCloudinary(
            resumePath,
            `${req.user.userName}-resume`,
            'image'
        );

        await deleteFile(resumePath);

        if (!uploadedResume?.secure_url) {
            return res.status(500).json({ message: 'Resume upload failed' });
        }

        const user = await User.findById(req.user._id);
        user.resume = uploadedResume.secure_url;
        await user.save({ validateBeforeSave: false });

        const safeUser = await User.findById(req.user._id).select('-password -refreshToken');

        return res.status(200).json({
            user: safeUser,
            resumeUrl: uploadedResume.secure_url,
            message: 'Resume updated successfully'
        });
    } catch (error) {
        console.error('Resume upload error:', error);
        return res.status(500).json({ message: 'Resume upload error', error: error.message });
    }
};

// Update Avatar
const updateAvatar = async (req, res) => {
    try {
        const avatarPath = req.file?.path;

        if (!avatarPath) {
            return res.status(400).json({ message: 'Avatar file is required' });
        }

        const uploadedAvatar = await uploadFileOnCloudinary(
            avatarPath,
            `${req.user.userName}-avatar`,
            'image'
        );

        await deleteFile(avatarPath);

        if (!uploadedAvatar?.secure_url) {
            return res.status(500).json({ message: 'Avatar upload failed' });
        }

        const user = await User.findById(req.user._id);
        user.avatar = uploadedAvatar.secure_url;
        await user.save({ validateBeforeSave: false });

        const safeUser = await User.findById(req.user._id).select('-password -refreshToken');

        return res.status(200).json({
            user: safeUser,
            avatarUrl: uploadedAvatar.secure_url,
            message: 'Avatar updated successfully'
        });
    } catch (error) {
        console.error('Avatar upload error:', error);
        return res.status(500).json({ message: 'Avatar upload error', error: error.message });
    }
};

// Update Summary
const updateSummary = async (req, res) => {
    try {
        const { summary } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.summary = summary || '';
        await user.save({ validateBeforeSave: false });

        const safeUser = await User.findById(req.user._id).select('-password -refreshToken');

        return res.status(200).json({
            user: safeUser,
            message: 'Summary updated successfully'
        });
    } catch (error) {
        return res.status(500).json({ message: 'Summary update failed', error: error.message });
    }
};

export {
    register,
    login,
    getCurrentUser,
    updateProfile,
    clerkSync,
    logout,
    generateAccessToken,
    updateResume,
    updateSummary,
    updateAvatar
};
