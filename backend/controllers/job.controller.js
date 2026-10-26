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

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: 'Unauthorized: User profile could not be verified. Please re-authenticate.'
            });
        }

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

const seedSampleJobs = async (req, res) => {
    try {
        const count = await Job.countDocuments();
        if (count >= 5 && req.query.force !== 'true') {
            return res.status(200).json({
                message: `Database already contains ${count} job vacancies. Pass ?force=true to add more.`,
                totalJobs: count
            });
        }

        let demoRecruiter = await User.findOne({ role: 'recruiter' });
        if (!demoRecruiter) {
            demoRecruiter = await User.create({
                clerkId: 'recruiter_demo_official',
                userName: 'talent_partner',
                email: 'recruitment@jobconnect.com',
                fullName: 'Job Connect Talent Partner',
                role: 'recruiter',
                summary: 'Official corporate hiring partner on Job Connect.'
            });
        }

        const sampleJobsList = [
            {
                title: 'Full Stack Software Engineer (MERN Stack)',
                companyName: 'Razorpay',
                location: 'Bangalore / Hybrid',
                jobType: 'Full-Time',
                experienceRequired: '1-3 Years',
                salary: '₹12,00,000 - ₹18,00,000 PA',
                skillsRequired: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'TypeScript'],
                description: `We are looking for a skilled Full Stack Engineer to join our payments platform team.\n\nResponsibilities:\n• Architect, build, and maintain robust client-facing web applications using React.js and modern state management.\n• Develop performant, secure RESTful microservices in Node.js and Express.\n• Collaborate with product managers and designers to translate business requirements into clean, scalable software.\n• Write automated tests, participate in code reviews, and optimize database queries for low-latency transaction handling.\n\nRequirements:\n• Strong proficiency in JavaScript (ES6+), React.js, and Node.js.\n• Practical experience with MongoDB schema design and indexing.\n• Familiarity with modern authentication patterns (OAuth, JWT, Clerk) and Git workflows.`
            },
            {
                title: 'Frontend Developer (React & Tailwind CSS)',
                companyName: 'Swiggy',
                location: 'Remote',
                jobType: 'Remote',
                experienceRequired: '1-2 Years',
                salary: '₹9,00,000 - ₹14,00,000 PA',
                skillsRequired: ['React.js', 'Tailwind CSS', 'Redux / Context API', 'JavaScript', 'Responsive UI'],
                description: `Join our consumer-facing web team to build intuitive, lightning-fast food delivery and quick-commerce experiences for millions of daily active users.\n\nKey Responsibilities:\n• Translate Figma prototypes into responsive, accessible, pixel-perfect React components.\n• Optimize client-side bundle size, Core Web Vitals, and rendering performance.\n• Integrate backend REST and GraphQL endpoints for real-time order tracking and search filtering.\n\nRequirements:\n• 1+ years building production SPAs with React 18+ and Tailwind CSS.\n• Deep understanding of the DOM, browser performance metrics, and responsive mobile-first styling.`
            },
            {
                title: 'Backend API Engineer (Node.js & Microservices)',
                companyName: 'Zomato',
                location: 'Gurugram / Hybrid',
                jobType: 'Full-Time',
                experienceRequired: '2-4 Years',
                salary: '₹15,00,000 - ₹22,00,000 PA',
                skillsRequired: ['Node.js', 'Express.js', 'MongoDB', 'Redis', 'Docker', 'REST APIs'],
                description: `Zomato engineering is looking for a Backend Engineer to scale our dining and ordering services.\n\nWhat You'll Do:\n• Design and implement high-throughput REST APIs and asynchronous background task workers.\n• Model and optimize NoSQL schemas in MongoDB for concurrent multi-tenant workloads.\n• Implement distributed caching strategies using Redis to reduce database read latencies.\n• Ensure bulletproof API security, request validation, and zero-downtime container deployments.\n\nIdeal Candidate:\n• Demonstrated experience with Node.js event loops, Express middleware, and MongoDB aggregations.\n• Understanding of asynchronous programming patterns and microservices architectures.`
            },
            {
                title: 'Associate Software Development Engineer (SDE-1)',
                companyName: 'Microsoft',
                location: 'Hyderabad / Hybrid',
                jobType: 'Full-Time',
                experienceRequired: 'Fresher',
                salary: '₹14,00,000 - ₹18,00,000 PA',
                skillsRequired: ['Data Structures', 'Algorithms', 'JavaScript', 'React', 'Problem Solving'],
                description: `Microsoft is hiring early-career Software Development Engineers for our Cloud & AI product groups.\n\nRole Overview:\n• Build customer-centric features across web platforms and enterprise cloud dashboards.\n• Work alongside Senior Engineers to design modular, well-tested code adhering to strict software engineering standards.\n• Debug production incidents, write unit tests, and continuously improve CI/CD pipelines.\n\nQualifications:\n• Bachelor's or Master's degree in Computer Science, Information Technology, or related discipline (2024-2026 batches welcome).\n• Solid understanding of Data Structures, Object-Oriented Design, and basic web technologies.`
            },
            {
                title: 'Software Engineering Intern (Summer 2026)',
                companyName: 'Stripe',
                location: 'Remote',
                jobType: 'Internship',
                experienceRequired: 'Fresher',
                salary: '₹60,000 / month Stipend',
                skillsRequired: ['JavaScript', 'React', 'Node.js', 'Git', 'REST APIs'],
                description: `Join Stripe as a Software Engineering Intern and gain hands-on experience building global economic infrastructure for the internet.\n\nWhat You Will Experience:\n• 6-month paid internship working with experienced mentor engineers on live customer-facing projects.\n• Contribute real code to our merchant onboarding portals and payment reconciliation dashboards.\n• Participate in engineering design reviews, hackathons, and technical brown-bag sessions.\n• Top-performing interns will be considered for Pre-Placement Offers (PPOs) upon graduation.`
            },
            {
                title: 'DevOps & Cloud Infrastructure Engineer',
                companyName: 'CRED',
                location: 'Bangalore',
                jobType: 'Full-Time',
                experienceRequired: '2-4 Years',
                salary: '₹18,00,000 - ₹26,00,000 PA',
                skillsRequired: ['AWS', 'Docker', 'Kubernetes', 'CI/CD GitHub Actions', 'Linux', 'Terraform'],
                description: `Help CRED maintain 99.99% uptime across millions of high-value financial credit card transactions.\n\nResponsibilities:\n• Maintain automated CI/CD deployment pipelines on GitHub Actions and Kubernetes clusters.\n• Manage AWS cloud infrastructure, VPC peering, and secure identity federation.\n• Implement monitoring, distributed tracing, and Prometheus/Grafana alerting metrics.\n\nRequirements:\n• 2+ years of hands-on cloud experience with Docker containers, Linux administration, and AWS.`
            },
            {
                title: 'UI/UX Product Designer & Design Technologist',
                companyName: 'InnoTech Studios',
                location: 'Remote',
                jobType: 'Remote',
                experienceRequired: '1-3 Years',
                salary: '₹10,00,000 - ₹16,00,000 PA',
                skillsRequired: ['Figma', 'UI/UX Design', 'Design Systems', 'HTML/CSS', 'Prototyping'],
                description: `We are searching for a UI/UX Designer who loves crafting elegant, intuitive web applications and design systems.\n\nRole Focus:\n• Conduct user research, wireframe customer journeys, and produce interactive high-fidelity Figma components.\n• Maintain our unified design system, ensuring accessibility (WCAG) and responsive typography.\n• Collaborate closely with React frontend developers to inspect implementation fidelity.`
            },
            {
                title: 'Junior React Native / Mobile App Developer',
                companyName: 'Urban Company',
                location: 'Gurugram / Remote',
                jobType: 'Full-Time',
                experienceRequired: '1-2 Years',
                salary: '₹8,00,000 - ₹13,00,000 PA',
                skillsRequired: ['React Native', 'React.js', 'Redux Toolkit', 'Mobile UI', 'REST APIs'],
                description: `Urban Company is expanding its mobile engineering squad to build partner and customer mobile experiences.\n\nKey Responsibilities:\n• Build cross-platform mobile features using React Native for iOS and Android.\n• Integrate native device capabilities (geolocation, camera, push notifications).\n• Write clean, modular components with smooth 60fps animations.`
            }
        ];

        const jobsToInsert = sampleJobsList.map((job) => ({
            ...job,
            userId: demoRecruiter._id,
            status: 'Active'
        }));

        const insertedJobs = await Job.insertMany(jobsToInsert);

        return res.status(201).json({
            message: `Successfully seeded ${insertedJobs.length} sample job postings!`,
            jobs: insertedJobs
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error seeding sample jobs', error: error.message });
    }
};

export { createJob, getAllJobs, getJobById, getMyJobs, updateJob, deleteJob, seedSampleJobs };
