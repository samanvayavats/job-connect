import { Router } from 'express';
import {
    createJob,
    getAllJobs,
    getJobById,
    getMyJobs,
    updateJob,
    deleteJob
} from '../controllers/job.controller.js';
import { verifyUser, optionalVerifyUser } from '../middleware/authentication.js';

const router = Router();

router.route('/all').get(optionalVerifyUser, getAllJobs);
router.route('/get/:id').get(optionalVerifyUser, getJobById);
router.route('/my-jobs').get(verifyUser, getMyJobs);
router.route('/create-job-opening').post(verifyUser, createJob);
router.route('/update-job/:id').put(verifyUser, updateJob);
router.route('/delete-job-opening').delete(verifyUser, deleteJob);
router.route('/:id').delete(verifyUser, deleteJob);

export default router;
