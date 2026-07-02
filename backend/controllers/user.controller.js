import { User } from '../models/user.model.js';
import { hashingPassword } from '../utils/bcrypt.js';
import { deleteFromcloudinary, uploadFileOnCloudinary } from '../utils/cloudinary.js';
import { deleteFile } from '../utils/filehandler.js';
import { verifyPassword } from '../utils/bcrypt.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const genratingTheAccessTokenAndRefreshToken = async (id) => {
    try {
        const user = await User.findById(id);

        if (!user) {
            throw new Error('User not found for token generation');
        }

        const refreshToken = await user.getRefreshToken();
        const accessToken = await user.getAccessToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: true });

        return {
            refreshToken,
            accessToken
        };
    } catch (error) {
        console.log('the error at the time of genratingTheAccessTokenAndRefreshToken : ', error);
    }
};

// this is the registeration route
// http://localhost:8000/api/user/register
const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if ([userName, email, password].some((e) => !e?.trim())) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const avatarPath = req.files?.avatar?.[0]?.path;
        const resumePath = req.files?.resume?.[0]?.path;

        if (!avatarPath || !resumePath) {
            return res.status(400).json({
                message: 'Avatar and Resume are required'
            });
        }

        const existingUser = await User.findOne({
            $or: [{ userName }, { email }]
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists'
            });
        }

        // Upload Avatar
        const uploadAvatar = await uploadFileOnCloudinary(
            avatarPath,
            `${userName}-avatar`,
            'image'
        );

        if (!uploadAvatar) {
            return res.status(500).json({
                message: 'Avatar upload failed'
            });
        }

        // Upload Resume (PDF)
        const uploadResume = await uploadFileOnCloudinary(
            resumePath,
            `${userName}-resume`,
            'image'
        );

        if (!uploadResume) {
            return res.status(500).json({
                message: 'Resume upload failed'
            });
        }

        const hashedPassword = await hashingPassword(password);

        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
            avatar: uploadAvatar.secure_url,
            resume: uploadResume.secure_url
        });

        const createdUser = await User.findById(user._id).select('-password');

        await deleteFile(avatarPath);
        await deleteFile(resumePath);

        return res.status(201).json({
            message: 'Registered successfully',
            user: createdUser
        });
    } catch (error) {
        console.log('Register Error:', error);

        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};
// this is the login route
const login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        if ([userName, password].some((e) => e?.trim === '')) {
            return res.status(401).json({
                message: 'all the fields are required'
            });
        }

        const user = await User.findOne({ userName: userName });

        if (!user) {
            return res.status(401).json({
                message: 'user not found , try to register again'
            });
        }

        const isPasswordVerifyed = await verifyPassword(password, user.password);

        if (!isPasswordVerifyed) {
            return res.status(401).json({
                message: 'password is wrong'
            });
        }

        const { accessToken, refreshToken } = await genratingTheAccessTokenAndRefreshToken(
            user._id
        );

        const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

        const option = {
            httpOnly: true,
            secure: false,
            sameSite: 'none'
        };

        return res
            .status(201)
            .cookie('refreshToken', refreshToken)
            .cookie('accessToken', accessToken)
            .json({
                message: 'login done',
                user: loggedInUser
            });
    } catch (error) {
        console.log('the error at the time of login ', error);
        return res.status(500);
    }
};

// generateAccessToken
const generateAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: 'Refresh token not found. Please login again.'
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.refresh_token_secret);

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        if (user.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: 'Invalid refresh token.'
            });
        }

        const accessToken = await user.getAccessToken();

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: 'none'
        };

        return res.cookie('accessToken', accessToken, options).status(200).json({
            message: 'New access token generated successfully.',
            accessToken
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: error.name,
                message: 'Refresh token expired. Please login again.'
            });
        }

        return res.status(401).json({
            message: 'Invalid refresh token.'
        });
    }
};

// update the resume
const updateResume = async (req, res) => {
    try {
        const resume = req.file.path;

        if (!resume) {
            return res.status(401).json({
                message: 'resume is required'
            });
        }

        await deleteFromcloudinary(`${req.user.userName}resume`, 'raw');
        const uploadResume = await uploadFileOnCloudinary(
            resume,
            `${req.user.userName}-resume`,
            'image'
        );

        if (!uploadResume) {
            return res.status(500).json({
                message: 'resume upload failed'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: 'user not found '
            });
        }

        user.resume = uploadResume.secure_url;
        await user.save({ validateBeforeSave: true });

        const userAfterSavingResume = await User.findById(req.user._id).select(
            '-password -refreshToken'
        );

        const resumeDeletedFromPublic = await deleteFile(resume);

        return res.status(200).json({
            user: userAfterSavingResume,
            message: 'resume uploaded successfully'
        });
    } catch (error) {
        console.log('resume upload failed', error);

        return res.status(500).json({
            message: 'resume upload failed'
        });
    }
};

// update summary
const updateSummary = async (req, res) => {
    try {
        const summary = req.body.summary;

        if (!summary) {
            return res.status(404).json({
                message: 'summary can not be empty'
            });
        }

        const user = await User.findById(req?.user?._id);

        if (!user) {
            return res.status(404).json({
                message: 'user not found '
            });
        }
        user.summary = summary;
        await user.save({ validateBeforeSave: true });

        const userAfterUpdate = await User.findById(req.user._id).select(
            ' -password -refreshToken'
        );

        return res.status(200).json({
            user: userAfterUpdate,
            message: 'summary updated successfully'
        });
    } catch (error) {
        console.log('the error at the time of updating summary', error);

        return res.status(500).json({
            message: 'the summary update failed'
        });
    }
};

export { register, login, generateAccessToken, updateResume, updateSummary };
