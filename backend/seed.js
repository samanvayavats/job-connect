import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import mongoose from 'mongoose';
import { User } from './models/user.model.js';
import { Job } from './models/job.model.js';

const sampleJobs = [
    {
        title: 'Full Stack Software Engineer (MERN Stack)',
        companyName: 'Razorpay',
        location: 'Bangalore / Hybrid',
        jobType: 'Full-Time',
        experienceRequired: '1-3 Years',
        salary: '₹12,00,000 - ₹18,00,000 PA',
        skillsRequired: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'TypeScript'],
        description: `We are looking for a skilled Full Stack Engineer to join our payments platform team.
        
Responsibilities:
• Architect, build, and maintain robust client-facing web applications using React.js and modern state management.
• Develop performant, secure RESTful microservices in Node.js and Express.
• Collaborate with product managers and designers to translate business requirements into clean, scalable software.
• Write automated tests, participate in code reviews, and optimize database queries for low-latency transaction handling.

Requirements:
• Strong proficiency in JavaScript (ES6+), React.js, and Node.js.
• Practical experience with MongoDB schema design and indexing.
• Familiarity with modern authentication patterns (OAuth, JWT, Clerk) and Git workflows.`
    },
    {
        title: 'Frontend Developer (React & Tailwind CSS)',
        companyName: 'Swiggy',
        location: 'Remote',
        jobType: 'Remote',
        experienceRequired: '1-2 Years',
        salary: '₹9,00,000 - ₹14,00,000 PA',
        skillsRequired: ['React.js', 'Tailwind CSS', 'Redux / Context API', 'JavaScript', 'Responsive UI'],
        description: `Join our consumer-facing web team to build intuitive, lightning-fast food delivery and quick-commerce experiences for millions of daily active users.
        
Key Responsibilities:
• Translate Figma prototypes into responsive, accessible, pixel-perfect React components.
• Optimize client-side bundle size, Core Web Vitals, and rendering performance.
• Integrate backend REST and GraphQL endpoints for real-time order tracking and search filtering.

Requirements:
• 1+ years building production SPAs with React 18+ and Tailwind CSS.
• Deep understanding of the DOM, browser performance metrics, and responsive mobile-first styling.`
    },
    {
        title: 'Backend API Engineer (Node.js & Microservices)',
        companyName: 'Zomato',
        location: 'Gurugram / Hybrid',
        jobType: 'Full-Time',
        experienceRequired: '2-4 Years',
        salary: '₹15,00,000 - ₹22,00,000 PA',
        skillsRequired: ['Node.js', 'Express.js', 'MongoDB', 'Redis', 'Docker', 'REST APIs'],
        description: `Zomato engineering is looking for a Backend Engineer to scale our dining and ordering services.
        
What You'll Do:
• Design and implement high-throughput REST APIs and asynchronous background task workers.
• Model and optimize NoSQL schemas in MongoDB for concurrent multi-tenant workloads.
• Implement distributed caching strategies using Redis to reduce database read latencies.
• Ensure bulletproof API security, request validation, and zero-downtime container deployments.

Ideal Candidate:
• Demonstrated experience with Node.js event loops, Express middleware, and MongoDB aggregations.
• Understanding of asynchronous programming patterns and microservices architectures.`
    },
    {
        title: 'Associate Software Development Engineer (SDE-1)',
        companyName: 'Microsoft',
        location: 'Hyderabad / Hybrid',
        jobType: 'Full-Time',
        experienceRequired: 'Fresher',
        salary: '₹14,00,000 - ₹18,00,000 PA',
        skillsRequired: ['Data Structures', 'Algorithms', 'JavaScript', 'React', 'Problem Solving'],
        description: `Microsoft is hiring early-career Software Development Engineers for our Cloud & AI product groups.
        
Role Overview:
• Build customer-centric features across web platforms and enterprise cloud dashboards.
• Work alongside Senior Engineers to design modular, well-tested code adhering to strict software engineering standards.
• Debug production incidents, write unit tests, and continuously improve CI/CD pipelines.

Qualifications:
• Bachelor's or Master's degree in Computer Science, Information Technology, or related discipline (2024-2026 batches welcome).
• Solid understanding of Data Structures, Object-Oriented Design, and basic web technologies.`
    },
    {
        title: 'Software Engineering Intern (Summer 2026)',
        companyName: 'Stripe',
        location: 'Remote',
        jobType: 'Internship',
        experienceRequired: 'Fresher',
        salary: '₹60,000 / month Stipend',
        skillsRequired: ['JavaScript', 'React', 'Node.js', 'Git', 'REST APIs'],
        description: `Join Stripe as a Software Engineering Intern and gain hands-on experience building global economic infrastructure for the internet.
        
What You Will Experience:
• 6-month paid internship working with experienced mentor engineers on live customer-facing projects.
• Contribute real code to our merchant onboarding portals and payment reconciliation dashboards.
• Participate in engineering design reviews, hackathons, and technical brown-bag sessions.
• Top-performing interns will be considered for Pre-Placement Offers (PPOs) upon graduation.`
    },
    {
        title: 'DevOps & Cloud Infrastructure Engineer',
        companyName: 'CRED',
        location: 'Bangalore',
        jobType: 'Full-Time',
        experienceRequired: '2-4 Years',
        salary: '₹18,00,000 - ₹26,00,000 PA',
        skillsRequired: ['AWS', 'Docker', 'Kubernetes', 'CI/CD GitHub Actions', 'Linux', 'Terraform'],
        description: `Help CRED maintain 99.99% uptime across millions of high-value financial credit card transactions.
        
Responsibilities:
• Maintain automated CI/CD deployment pipelines on GitHub Actions and Kubernetes clusters.
• Manage AWS cloud infrastructure, VPC peering, and secure identity federation.
• Implement monitoring, distributed tracing, and Prometheus/Grafana alerting metrics.

Requirements:
• 2+ years of hands-on cloud experience with Docker containers, Linux administration, and AWS.`
    },
    {
        title: 'UI/UX Product Designer & Design Technologist',
        companyName: 'InnoTech Studios',
        location: 'Remote',
        jobType: 'Remote',
        experienceRequired: '1-3 Years',
        salary: '₹10,00,000 - ₹16,00,000 PA',
        skillsRequired: ['Figma', 'UI/UX Design', 'Design Systems', 'HTML/CSS', 'Prototyping'],
        description: `We are searching for a UI/UX Designer who loves crafting elegant, intuitive web applications and design systems.
        
Role Focus:
• Conduct user research, wireframe customer journeys, and produce interactive high-fidelity Figma components.
• Maintain our unified design system, ensuring accessibility (WCAG) and responsive typography.
• Collaborate closely with React frontend developers to inspect implementation fidelity.`
    },
    {
        title: 'Junior React Native / Mobile App Developer',
        companyName: 'Urban Company',
        location: 'Gurugram / Remote',
        jobType: 'Full-Time',
        experienceRequired: '1-2 Years',
        salary: '₹8,00,000 - ₹13,00,000 PA',
        skillsRequired: ['React Native', 'React.js', 'Redux Toolkit', 'Mobile UI', 'REST APIs'],
        description: `Urban Company is expanding its mobile engineering squad to build partner and customer mobile experiences.
        
Key Responsibilities:
• Build cross-platform mobile features using React Native for iOS and Android.
• Integrate native device capabilities (geolocation, camera, push notifications).
• Write clean, modular components with smooth 60fps animations.`
    }
];

async function seedDatabase() {
    const dbUrl = process.env.database_url;

    if (!dbUrl) {
        console.error('Error: database_url is missing from .env');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(dbUrl);
        console.log('Connected successfully!');

        // Find or create a default demo recruiter user to author the jobs
        let demoRecruiter = await User.findOne({ role: 'recruiter' });

        if (!demoRecruiter) {
            demoRecruiter = await User.create({
                clerkId: 'recruiter_demo_official',
                userName: 'tech_recruiter',
                email: 'recruitment@jobconnect.com',
                fullName: 'Job Connect Talent Partner',
                role: 'recruiter',
                summary: 'Official corporate recruitment partner on Job Connect.'
            });
            console.log('Created demo recruiter user:', demoRecruiter.userName);
        }

        // Delete existing sample jobs or append
        console.log('Populating sample job listings...');
        const jobsToInsert = sampleJobs.map((job) => ({
            ...job,
            userId: demoRecruiter._id,
            status: 'Active'
        }));

        const insertedJobs = await Job.insertMany(jobsToInsert);
        console.log(`Successfully seeded ${insertedJobs.length} professional job postings!`);

        console.log('\nSample Jobs seeded:');
        insertedJobs.forEach((j, i) => {
            console.log(`${i + 1}. [${j.companyName}] ${j.title} (${j.jobType} - ${j.location})`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seedDatabase();
