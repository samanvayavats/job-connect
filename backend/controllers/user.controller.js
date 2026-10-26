import { User } from '../models/user.model.js';
import { Qualification } from '../models/qualification.model.js';
import { Experience } from '../models/experience.model.js';
import { uploadFileOnCloudinary } from '../utils/cloudinary.js';
import { deleteFile } from '../utils/filehandler.js';

// Synchronize Clerk user profile with MongoDB
const syncClerkUser = async (req, res) => {
    try {
        const {
            clerkId,
            email,
            fullName = '',
            avatarUrl = '',
            role = 'job_seeker',
            phoneNumber = '',
            summary = ''
        } = req.body;

        const effectiveClerkId = clerkId || req.clerkUserId;

        if (!effectiveClerkId) {
            return res.status(400).json({ message: 'Clerk User ID is required for synchronization' });
        }

        const normalizedEmail = (email || `${effectiveClerkId}@jobconnect.local`).trim().toLowerCase();
        const baseUsername = normalizedEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user';

        let user = await User.findOne({
            $or: [{ clerkId: effectiveClerkId }, { email: normalizedEmail }]
        });

        if (!user) {
            user = await User.create({
                clerkId: effectiveClerkId,
                userName: baseUsername,
                email: normalizedEmail,
                fullName: fullName.trim() || baseUsername,
                avatar: avatarUrl,
                role: role === 'recruiter' ? 'recruiter' : 'job_seeker',
                phoneNumber: phoneNumber.trim(),
                summary: summary.trim()
            });
        } else {
            // Update existing user with latest Clerk data if not set
            if (!user.clerkId) user.clerkId = effectiveClerkId;
            if (fullName && (!user.fullName || user.fullName === 'Job Connect User')) {
                user.fullName = fullName.trim();
            }
            if (avatarUrl && !user.avatar) user.avatar = avatarUrl;
            if (phoneNumber && !user.phoneNumber) user.phoneNumber = phoneNumber.trim();
            if (role && ['job_seeker', 'recruiter'].includes(role) && !user.role) {
                user.role = role;
            }
            await user.save();
        }

        const qualifications = await Qualification.find({ userId: user._id }).sort({ endingYear: -1 });
        const experiences = await Experience.find({ userId: user._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Clerk account synchronized successfully',
            user,
            qualifications,
            experiences
        });
    } catch (error) {
        console.error('Clerk Sync Error:', error);
        return res.status(500).json({
            message: 'Clerk account synchronization failed',
            error: error.message
        });
    }
};

// Retrieve currently authenticated user profile
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        const qualifications = await Qualification.find({ userId: req.user._id }).sort({ endingYear: -1 });
        const experiences = await Experience.find({ userId: req.user._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            user: req.user,
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

// Update profile details (role, phone, summary, full name)
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

        await user.save();

        return res.status(200).json({
            user,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

// Update Resume via Multer & Cloudinary
const updateResume = async (req, res) => {
    try {
        const resumePath = req.file?.path;

        if (!resumePath) {
            return res.status(400).json({ message: 'Resume file is required' });
        }

        const uploadedResume = await uploadFileOnCloudinary(
            resumePath,
            `${req.user.userName || req.user.clerkId}-resume`,
            'image'
        );

        await deleteFile(resumePath);

        if (!uploadedResume?.secure_url) {
            return res.status(500).json({ message: 'Resume upload failed' });
        }

        const user = await User.findById(req.user._id);
        user.resume = uploadedResume.secure_url;
        await user.save();

        return res.status(200).json({
            user,
            resumeUrl: uploadedResume.secure_url,
            message: 'Resume updated successfully'
        });
    } catch (error) {
        console.error('Resume upload error:', error);
        return res.status(500).json({ message: 'Resume upload error', error: error.message });
    }
};

// Update Avatar via Multer & Cloudinary
const updateAvatar = async (req, res) => {
    try {
        const avatarPath = req.file?.path;

        if (!avatarPath) {
            return res.status(400).json({ message: 'Avatar file is required' });
        }

        const uploadedAvatar = await uploadFileOnCloudinary(
            avatarPath,
            `${req.user.userName || req.user.clerkId}-avatar`,
            'image'
        );

        await deleteFile(avatarPath);

        if (!uploadedAvatar?.secure_url) {
            return res.status(500).json({ message: 'Avatar upload failed' });
        }

        const user = await User.findById(req.user._id);
        user.avatar = uploadedAvatar.secure_url;
        await user.save();

        return res.status(200).json({
            user,
            avatarUrl: uploadedAvatar.secure_url,
            message: 'Avatar updated successfully'
        });
    } catch (error) {
        console.error('Avatar upload error:', error);
        return res.status(500).json({ message: 'Avatar upload error', error: error.message });
    }
};

export {
    syncClerkUser,
    getCurrentUser,
    updateProfile,
    updateResume,
    updateAvatar
};
