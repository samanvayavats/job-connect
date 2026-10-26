import { Router } from 'express';
import {
    addExperience,
    getMyExperiences,
    deleteExperience
} from '../controllers/experience.controller.js';
import { verifyUser } from '../middleware/authentication.js';

const router = Router();

router.route('/all').get(verifyUser, getMyExperiences);
router.route('/add-experience').post(verifyUser, addExperience);
router.route('/delete-experience').delete(verifyUser, deleteExperience);
router.route('/:id').delete(verifyUser, deleteExperience);

export default router;
