# Job Connect: Project Implementation Specification & Generator Guide

This document outlines the full technical architecture, directory structure, schema definitions, and implementation roadmap to build the **Job Connect** portal using **React**, **Express.js**, **MongoDB**, and **Clerk**.

---

## 1. Project Directory Structure

```
job-connect/
├── client/                     # React Single Page Application
│   ├── public/
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── src/
│   │   ├── assets/             # Logos, icons, illustration images
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── FilterSidebar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── pages/              # Route views
│   │   │   ├── Home.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── ApplyJob.jsx
│   │   │   ├── CandidateDashboard.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   ├── PostJob.jsx
│   │   │   ├── ManageApplicants.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/            # Auth & global application state
│   │   ├── services/           # Axios API service instances
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind / Custom styling
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                     # Express.js REST API Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection logic (Mongoose)
│   ├── controllers/
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   ├── userController.js
│   │   └── webhookController.js # Clerk user synchronization
│   ├── middleware/
│   │   ├── authMiddleware.js   # Clerk JWT token verifier
│   │   ├── roleMiddleware.js   # RBAC check (Recruiter vs Seeker)
│   │   ├── uploadMiddleware.js # Multer configuration for resumes
│   │   └── errorMiddleware.js  # Global error interceptor
│   ├── models/
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── userRoutes.js
│   │   └── webhookRoutes.js
│   ├── utils/
│   │   └── fileUploader.js     # Cloudinary / S3 / Local upload helper
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express application entrypoint
│
└── README.md
```

---

## 2. Environment Variables Specification

### Client (`client/.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:5000/api
```

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/jobconnect?retryWrites=true&w=majority
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_clerk_webhook_signing_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

---

## 3. MongoDB Schemas (Mongoose)

### 3.1 User Schema (`server/models/User.js`)
```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  role: { 
    type: String, 
    enum: ['job_seeker', 'recruiter', 'admin'], 
    default: 'job_seeker' 
  },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  resumeUrl: { type: String, default: '' },
  resumeFileName: { type: String, default: '' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
```

### 3.2 Job Schema (`server/models/Job.js`)
```javascript
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  description: { type: String, required: true },
  requirements: [{ type: String, required: true }],
  location: { type: String, required: true },
  jobType: { 
    type: String, 
    enum: ['Full-Time', 'Part-Time', 'Remote', 'Contract', 'Internship'], 
    required: true 
  },
  experienceLevel: { 
    type: String, 
    enum: ['Entry-Level', 'Mid-Level', 'Senior-Level', 'Lead'], 
    required: true 
  },
  salaryMin: { type: Number, default: 0 },
  salaryMax: { type: Number, default: 0 },
  salaryCurrency: { type: String, default: 'INR' },
  status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
  applicantCount: { type: Number, default: 0 }
}, { timestamps: true });

JobSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Job', JobSchema);
```

### 3.3 Application Schema (`server/models/Application.js`)
```javascript
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeUrl: { type: String, required: true },
  coverLetter: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Applied', 'Reviewing', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Accepted'], 
    default: 'Applied' 
  },
  statusHistory: [
    {
      status: { type: String },
      updatedAt: { type: Date, default: Date.now },
      note: { type: String, default: '' }
    }
  ]
}, { timestamps: true });

ApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
```

---

## 4. Key Express Middleware & Clerk Auth

### 4.1 Token Verification Middleware (`server/middleware/authMiddleware.js`)
```javascript
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

const requireAuth = ClerkExpressRequireAuth();

const attachDbUser = async (req, res, next) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User profile not found in database.' });
    }
    req.dbUser = user;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Authentication error', error: err.message });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (req.dbUser && req.dbUser.role === role) {
    return next();
  }
  return res.status(403).json({ message: `Access denied. Requires ${role} role.` });
};

module.exports = { requireAuth, attachDbUser, requireRole };
```

---

## 5. Primary API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | List jobs with keyword, location, jobType, page, limit |
| `GET` | `/api/jobs/:id` | Public | Retrieve single job vacancy and details |
| `POST` | `/api/jobs` | Recruiter | Create a new job vacancy |
| `PUT` | `/api/jobs/:id` | Recruiter | Edit existing job vacancy |
| `DELETE` | `/api/jobs/:id` | Recruiter | Close or delete a job posting |
| `POST` | `/api/applications/:jobId` | Candidate | Submit job application with resume & cover letter |
| `GET` | `/api/applications/my` | Candidate | Retrieve all applications submitted by candidate |
| `GET` | `/api/applications/job/:jobId`| Recruiter | List all candidates for a specific job posting |
| `PATCH`| `/api/applications/:id/status`| Recruiter | Update candidate status in the ATS lifecycle |
| `POST` | `/api/webhooks/clerk` | Public / Svix | Sync Clerk user registration/update events into Mongo |

---

## 6. Recommended Quick-Start Commands

### Server Initialization
```bash
cd server
npm init -y
npm install express mongoose dotenv cors @clerk/clerk-sdk-node svix multer cloudinary multer-storage-cloudinary
npm install --save-dev nodemon
```

### Client Initialization
```bash
cd client
npm create vite@latest . -- --template react
npm install @clerk/clerk-react react-router-dom axios lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
