import { User } from '../models/user.model.js';
import { hashingPassword } from '../utils/bcrypt.js';
import { uploadImageOnCloudinary } from '../utils/cloudinary.js';
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
        const body = req.body;

        const { userName, email, password } = body;
        const avatarPath = req.file.path;

        if ([userName, email, password].some((e) => e?.trim() === '')) {
            return res.status(401).json({
                message: 'all the fields are required'
            });
        }

        if (!avatarPath) {
            return res.status(401).json({
                message: 'avatar is required'
            });
        }

        const isUserExits = await User.findOne({ userName: userName });

        if (isUserExits) {
            return res.status(409).json({
                message: 'user already exits , try to login '
            });
        }

        // uploading the image on cloudinary
        const uploadAvatar = await uploadImageOnCloudinary(avatarPath, `${userName}avatar`);

        if (!uploadAvatar) {
            return res.status(401).json({
                message: 'avatar upload failed '
            });
        }

        // hashing Password
        const hashedPassword = await hashingPassword(password);

        const user = await User.create({
            userName: userName,
            email: email,
            password: hashedPassword,
            avatar: uploadAvatar.secure_url
        });

        const userCreated = await User.findOne(User?._id).select('-password');

        if (!userCreated) {
            return res.status(500).json({
                message: 'something went wrong , try to register again'
            });
        }

        // cleaning the uploaded image from the public folder
        const deletingUplaodedFileFromThePublicFolder = await deleteFile(avatarPath);

        return res.status(201).json({
            message: 'registered successful',
            user: userCreated
        });
    } catch (error) {
        console.log('error at the time of register ', error);
        return res.status(500).json({
            message: 'something went wrong , try to register again'
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

// upload the summarry and resume
const uploadResume = async (req, res) => {
    try {
        const resume = req.file.path;

        if (!resume) {
            return res.status(401).json({
                message: 'resume is required'
            });
        }

        const uploadResume = await uploadImageOnCloudinary(resume, `${req.user.userName}resume`);

        if (!uploadResume) {
            return res.status(500).json({
                message: 'resume upload failed'
            });
        }

        const user = await User.findById(req.user._id);

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

export { register, login, generateAccessToken, uploadResume };
