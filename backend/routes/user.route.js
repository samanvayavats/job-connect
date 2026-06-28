import { Router } from 'express';
import { login, register, generateAccessToken } from '../controllers/user.controller.js';
import upload from '../middleware/multer.js';
const router = Router();

router.route('/register').post(upload.single('avatar'), register);
router.route('/login').post(login);
router.route('/generate-access-token').post(generateAccessToken);

export default router;
