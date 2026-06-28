import { Router } from 'express';
import { login, register, generateAccessToken ,uploadResume } from '../controllers/user.controller.js';
import upload from '../middleware/multer.js';
import { verifyUser } from '../middleware/authentication.js';
const router = Router();

router.route('/register').post(upload.single('avatar'), register);
router.route('/login').post(login);
router.route('/generate-access-token').post(generateAccessToken);
router.route('/upload-resume').post(verifyUser ,upload.single('resume'),uploadResume);

export default router;
