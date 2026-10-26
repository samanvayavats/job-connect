import { getAuth, clerkClient } from '@clerk/express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const verifyUser = async (req, res, next) => {
    try {
        let clerkUserId = null;

        // 1. Try to read verified auth from @clerk/express
        try {
            const auth = getAuth(req);
            if (auth?.userId) {
                clerkUserId = auth.userId;
            }
        } catch (e) {
            // In case clerkMiddleware wasn't invoked or keys absent
        }

        // 2. Read from Authorization Bearer token (Clerk session JWT)
        if (!clerkUserId) {
            const authHeader = req.header('Authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.replace(/^Bearer\s+/, '').trim();
                if (token) {
                    const decoded = jwt.decode(token);
                    if (decoded && (decoded.sub || decoded.userId || decoded._id)) {
                        clerkUserId = decoded.sub || decoded.userId || decoded._id;
                    }
                }
            }
        }

        // 3. Read from custom header or cookie
        if (!clerkUserId) {
            clerkUserId = req.header('x-clerk-user-id') || req.cookies?.clerkId;
        }

        if (!clerkUserId) {
            return res.status(401).json({
                message: 'Unauthorized: No active Clerk authentication token found. Please sign in.'
            });
        }

        // Look up user in MongoDB by clerkId or _id
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(clerkUserId);
        let user = await User.findOne({
            $or: [
                { clerkId: clerkUserId },
                ...(isObjectId ? [{ _id: clerkUserId }] : [])
            ]
        });

        // Auto-provision user in MongoDB if not found
        if (!user) {
            let userEmail = `${clerkUserId}@jobconnect.local`;
            let userName = `user_${clerkUserId.slice(-6)}`;
            let fullName = 'Job Connect User';
            let avatar = '';

            try {
                if (process.env.CLERK_SECRET_KEY && clerkClient?.users) {
                    const clerkUser = await clerkClient.users.getUser(clerkUserId);
                    if (clerkUser) {
                        userEmail = clerkUser.emailAddresses?.[0]?.emailAddress || userEmail;
                        userName = clerkUser.username || userEmail.split('@')[0] || userName;
                        fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || userName;
                        avatar = clerkUser.imageUrl || '';
                    }
                }
            } catch (clerkFetchErr) {
                console.warn('Could not fetch Clerk user info directly, using fallback:', clerkFetchErr.message);
            }

            user = await User.create({
                clerkId: clerkUserId,
                userName: userName.toLowerCase(),
                email: userEmail.toLowerCase(),
                fullName,
                avatar,
                role: 'job_seeker'
            });
        }

        req.user = user;
        req.clerkUserId = clerkUserId;
        next();
    } catch (error) {
        console.error('Clerk authentication error in verifyUser:', error);
        return res.status(401).json({
            message: 'Clerk authentication error',
            error: error.message
        });
    }
};

const optionalVerifyUser = async (req, res, next) => {
    try {
        let clerkUserId = null;

        try {
            const auth = getAuth(req);
            if (auth?.userId) clerkUserId = auth.userId;
        } catch (e) {}

        if (!clerkUserId) {
            const authHeader = req.header('Authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.replace(/^Bearer\s+/, '').trim();
                if (token) {
                    const decoded = jwt.decode(token);
                    if (decoded && (decoded.sub || decoded.userId || decoded._id)) {
                        clerkUserId = decoded.sub || decoded.userId || decoded._id;
                    }
                }
            }
        }

        if (!clerkUserId) {
            clerkUserId = req.header('x-clerk-user-id') || req.cookies?.clerkId;
        }

        if (clerkUserId) {
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(clerkUserId);
            const user = await User.findOne({
                $or: [
                    { clerkId: clerkUserId },
                    ...(isObjectId ? [{ _id: clerkUserId }] : [])
                ]
            });
            if (user) {
                req.user = user;
                req.clerkUserId = clerkUserId;
            }
        }
    } catch (error) {
        // Silently continue for optional auth
    }
    next();
};

export { verifyUser, optionalVerifyUser };
