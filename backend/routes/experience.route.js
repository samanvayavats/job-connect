import { addExperience, deleteExperience } from '../controllers/experience.controller.js';
import { Router } from 'express';
import { verifyUser } from '../middleware/authentication.js';
const router = Router();

router.route('/add-experience').post(verifyUser, addExperience);
router.route('/delete-experience').delete(verifyUser, deleteExperience);

export default router;
