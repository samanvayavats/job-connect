import { Application } from '../models/application.model.js';
import { Job } from '../models/job.model.js';
import { User } from '../models/user.model.js';
import { uploadFileOnCloudinary } from '../utils/cloudinary.js';
import { deleteFile } from '../utils/filehandler.js';

const applyForJob = async (req, res) => {
    try {
        const {
            jobId,
            qualification,
            experience,
            coverLetter = '',
            fullName,
            email,
            phone
        } = req.body;

        if (!jobId) {
            return res.status(400).json({ message: 'Job ID is required' });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job posting not found' });
        }

        if (job.status === 'Closed') {
            return res.status(400).json({ message: 'This job posting is closed for applications' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            jobId,
            userId: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        let resumeUrl = req.user.resume || '';

        // If a new resume file is uploaded
        if (req.file) {
            const uploadedResume = await uploadFileOnCloudinary(
                req.file.path,
                `${req.user.userName}-${jobId}-resume`,
                'image'
            );
            if (uploadedResume) {
                resumeUrl = uploadedResume.secure_url;
            }
            await deleteFile(req.file.path);
        }

        if (!resumeUrl) {
            return res.status(400).json({
                message: 'A resume is required. Please upload a resume or add one to your profile'
            });
        }

        const application = await Application.create({
            userId: req.user._id,
            jobId,
            username: req.user.userName,
            fullName: fullName || req.user.fullName || req.user.userName,
            email: email || req.user.email,
            phone: phone || req.user.phoneNumber || '',
            resume: resumeUrl,
            qualification: qualification?.trim() || 'Details provided in resume',
            experience: experience?.trim() || req.user.summary || 'Details provided in resume',
            coverLetter: coverLetter?.trim() || '',
            status: 'Applied'
        });

        return res.status(201).json({
            application,
            message: 'Application submitted successfully'
        });
    } catch (error) {
        return res.status(500).json({ message: 'Application submission failed', error: error.message });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user._id })
            .populate('jobId')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            applications
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching your applications', error: error.message });
    }
};

const getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to view applicants for this job' });
        }

        const applicants = await Application.find({ jobId })
            .populate('userId', 'userName email fullName avatar phoneNumber summary')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            job,
            applicants
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving applicants', error: error.message });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, recruiterNote } = req.body;

        const allowedStatuses = [
            'Applied',
            'Reviewing',
            'Shortlisted',
            'Interview Scheduled',
            'Rejected',
            'Accepted'
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid application status value' });
        }

        const application = await Application.findById(id).populate('jobId');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify that the user owns the job
        if (application.jobId.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to update this application' });
        }

        application.status = status;
        if (recruiterNote !== undefined) {
            application.recruiterNote = recruiterNote;
        }

        await application.save();

        return res.status(200).json({
            application,
            message: `Application status updated to ${status}`
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating application status', error: error.message });
    }
};

const withdrawApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to withdraw this application' });
        }

        await Application.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Application withdrawn successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error withdrawing application', error: error.message });
    }
};

export {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus,
    withdrawApplication
};
