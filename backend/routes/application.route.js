import { Router } from 'express';
import {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus,
    withdrawApplication
} from '../controllers/application.controller.js';
import { verifyUser } from '../middleware/authentication.js';
import upload from '../middleware/multer.js';

const router = Router();

router.route('/apply').post(verifyUser, upload.single('resume'), applyForJob);
router.route('/my-applications').get(verifyUser, getMyApplications);
router.route('/job/:jobId').get(verifyUser, getJobApplicants);
router.route('/status/:id').patch(verifyUser, updateApplicationStatus);
router.route('/withdraw/:id').delete(verifyUser, withdrawApplication);

export default router;
