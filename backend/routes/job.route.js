import { createJob , deleteJob } from "../controllers/job.controller.js";
import { verifyUser } from "../middleware/authentication.js";
import { Router } from "express";

const router = Router()
router.route('/create-job-opening').post(verifyUser , createJob)
router.route('/delete-job-opening').delete(verifyUser , deleteJob)

export default router