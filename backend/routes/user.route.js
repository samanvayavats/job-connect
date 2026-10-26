import { Router } from 'express';
import {
    syncClerkUser,
    getCurrentUser,
    updateProfile,
    updateResume,
    updateAvatar
} from '../controllers/user.controller.js';
import upload from '../middleware/multer.js';
import { verifyUser, optionalVerifyUser } from '../middleware/authentication.js';

const router = Router();

// Clerk Synchronization & Profile Endpoints
router.route('/sync').post(optionalVerifyUser, syncClerkUser);
router.route('/clerk-sync').post(optionalVerifyUser, syncClerkUser);
router.route('/me').get(verifyUser, getCurrentUser);
router.route('/update-profile').put(verifyUser, updateProfile);
router.route('/update-resume').post(verifyUser, upload.single('resume'), updateResume);
router.route('/update-avatar').post(verifyUser, upload.single('avatar'), updateAvatar);

export default router;
