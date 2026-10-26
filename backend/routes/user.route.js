import { Router } from 'express';
import {
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
} from '../controllers/user.controller.js';
import upload from '../middleware/multer.js';
import { verifyUser } from '../middleware/authentication.js';

const router = Router();

router.route('/register').post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'resume', maxCount: 1 }
    ]),
    register
);
router.route('/login').post(login);
router.route('/me').get(verifyUser, getCurrentUser);
router.route('/update-profile').put(verifyUser, updateProfile);
router.route('/clerk-sync').post(clerkSync);
router.route('/logout').post(verifyUser, logout);
router.route('/generate-access-token').post(generateAccessToken);
router.route('/update-resume').post(verifyUser, upload.single('resume'), updateResume);
router.route('/update-summary').post(verifyUser, updateSummary);
router.route('/update-avatar').post(verifyUser, upload.single('avatar'), updateAvatar);

export default router;
