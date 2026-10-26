import { Job } from '../models/job.model.js';
import { Application } from '../models/application.model.js';

const createJob = async (req, res) => {
    try {
        const {
            title,
            experienceRequired,
            companyName,
            description,
            location = 'Remote',
            jobType = 'Full-Time',
            salary = 'Competitive',
            skillsRequired = []
        } = req.body;

        if (!title?.trim() || !experienceRequired?.trim() || !companyName?.trim() || !description?.trim()) {
            return res.status(400).json({
                message: 'Title, company name, experience required, and description are required'
            });
        }

        const parsedSkills = Array.isArray(skillsRequired)
            ? skillsRequired
            : typeof skillsRequired === 'string'
              ? skillsRequired.split(',').map((s) => s.trim()).filter(Boolean)
              : [];

        const job = await Job.create({
            userId: req.user._id,
            title: title.trim(),
            experienceRequired: experienceRequired.trim(),
            companyName: companyName.trim(),
            description: description.trim(),
            location: location.trim(),
            jobType,
            salary: salary.trim(),
            skillsRequired: parsedSkills,
            status: 'Active'
        });

        return res.status(201).json({
            savedJob: job,
            job,
            message: 'Job created successfully'
        });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to create job', error: error.message });
    }
};

const getAllJobs = async (req, res) => {
    try {
        const {
            search = '',
            jobType = '',
            experience = '',
            location = '',
            status = 'Active',
            page = 1,
            limit = 20
        } = req.query;

        const query = {};

        if (status && status !== 'All') {
            query.status = status;
        }

        if (search.trim()) {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [
                { title: regex },
                { companyName: regex },
                { description: regex },
                { skillsRequired: regex }
            ];
        }

        if (jobType && jobType !== 'All') {
            query.jobType = jobType;
        }

        if (experience && experience !== 'All') {
            query.experienceRequired = new RegExp(experience, 'i');
        }

        if (location && location !== 'All') {
            query.location = new RegExp(location.trim(), 'i');
        }

        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.max(1, parseInt(limit, 10));
        const skip = (pageNum - 1) * limitNum;

        const totalJobs = await Job.countDocuments(query);
        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('userId', 'userName email avatar');

        return res.status(200).json({
            jobs,
            totalJobs,
            currentPage: pageNum,
            totalPages: Math.ceil(totalJobs / limitNum)
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving jobs', error: error.message });
    }
};

const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id).populate('userId', 'userName email avatar');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        let hasApplied = false;
        let application = null;

        if (req.user?._id) {
            application = await Application.findOne({
                jobId: job._id,
                userId: req.user._id
            });
            if (application) {
                hasApplied = true;
            }
        }

        const applicantCount = await Application.countDocuments({ jobId: job._id });

        return res.status(200).json({
            job,
            hasApplied,
            application,
            applicantCount
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching job details', error: error.message });
    }
};

const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ userId: req.user._id }).sort({ createdAt: -1 });

        const jobsWithApplicantCount = await Promise.all(
            jobs.map(async (job) => {
                const count = await Application.countDocuments({ jobId: job._id });
                return {
                    ...job.toObject(),
                    applicantCount: count
                };
            })
        );

        return res.status(200).json({
            jobs: jobsWithApplicantCount
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving your jobs', error: error.message });
    }
};

const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to modify this job' });
        }

        const allowedUpdates = [
            'title',
            'companyName',
            'experienceRequired',
            'description',
            'location',
            'jobType',
            'salary',
            'skillsRequired',
            'status'
        ];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (field === 'skillsRequired' && typeof req.body[field] === 'string') {
                    job[field] = req.body[field].split(',').map((s) => s.trim()).filter(Boolean);
                } else {
                    job[field] = req.body[field];
                }
            }
        });

        await job.save();

        return res.status(200).json({
            job,
            message: 'Job updated successfully'
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating job', error: error.message });
    }
};

const deleteJob = async (req, res) => {
    try {
        const id = req.query.id || req.params.id;

        if (!id) {
            return res.status(400).json({ message: 'Job ID is required' });
        }

        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to delete this job' });
        }

        await Job.findByIdAndDelete(id);
        // Also cleanup associated applications
        await Application.deleteMany({ jobId: id });

        return res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to delete job', error: error.message });
    }
};

export { createJob, getAllJobs, getJobById, getMyJobs, updateJob, deleteJob };
