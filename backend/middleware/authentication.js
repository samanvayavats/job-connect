import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const verifyUser = async (req, res, next) => {
    try {
        const token =
            req?.cookies?.accessToken ||
            req?.header('Authorization')?.replace(/^Bearer\s+/, '') ||
            req?.query?.token;

        if (!token) {
            return res.status(401).json({
                message: 'Token not found, unauthorized user'
            });
        }

        const verifiedToken = jwt.verify(token, process.env.access_token_secret);

        if (!verifiedToken) {
            return res.status(401).json({
                message: 'Token invalid, unauthorized user'
            });
        }

        const user = await User.findById(verifiedToken?._id).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found, unauthorized user'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: error.name,
                message: 'Access token expired'
            });
        }

        return res.status(401).json({
            message: 'JWT verification failed'
        });
    }
};

const optionalVerifyUser = async (req, res, next) => {
    try {
        const token =
            req?.cookies?.accessToken ||
            req?.header('Authorization')?.replace(/^Bearer\s+/, '') ||
            req?.query?.token;

        if (token) {
            const verifiedToken = jwt.verify(token, process.env.access_token_secret);
            if (verifiedToken?._id) {
                const user = await User.findById(verifiedToken._id).select('-password');
                if (user) {
                    req.user = user;
                }
            }
        }
    } catch (error) {
        // Silently continue without user
    }
    next();
};

export { verifyUser, optionalVerifyUser };
