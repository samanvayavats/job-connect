import { verifyUser } from '../middleware/authentication.js';
import { addQualification, deleteQualification } from '../controllers/qualification.controller.js';
import { Router } from 'express';

const router = Router();

router.route('/add-qualification').post(verifyUser, addQualification);
router.route('/delete-qualification').delete(verifyUser, deleteQualification);

export default router;
