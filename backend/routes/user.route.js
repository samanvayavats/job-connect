import { Router } from 'express';
import { login, register, generateAccessToken ,updateResume,updateSummary } from '../controllers/user.controller.js';
import upload from '../middleware/multer.js';
import { verifyUser } from '../middleware/authentication.js';

const router = Router();

router.route('/register').post( upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]) , register);
router.route('/login').post(login);
router.route('/generate-access-token').post(generateAccessToken);
router.route('/update-resume').post(verifyUser ,upload.single('resume'),updateResume);
router.route('/update-summary').post(verifyUser ,updateSummary);

export default router;
