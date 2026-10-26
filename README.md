# Job Connect 🚀

> A Modern Full-Stack Web-Based Job Recruitment and Applicant Tracking System (ATS) engineered with **React.js**, **Express.js**, **MongoDB Atlas**, and **Clerk**.

[![Live Application](https://img.shields.io/badge/Live%20Demo-Vercel%20Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://job-connect-omega-three.vercel.app/)
[![API Status](https://img.shields.io/badge/API%20Server-Render%20Cloud-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://job-connect-api-8w32.onrender.com/api/health)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Backend-Express.js%20%2B%20Node.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk%20Identity-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)

---

## 🌐 Live Deployments

- 🖥️ **Live Web Portal**: [https://job-connect-omega-three.vercel.app/](https://job-connect-omega-three.vercel.app/)
- ⚙️ **Production REST API**: [https://job-connect-api-8w32.onrender.com/](https://job-connect-api-8w32.onrender.com/)
- 🩺 **API Health Check**: [https://job-connect-api-8w32.onrender.com/api/health](https://job-connect-api-8w32.onrender.com/api/health)
- 📂 **GitHub Repository**: [https://github.com/samanvayavats/job-connect](https://github.com/samanvayavats/job-connect)

---

## 📌 Project Overview

**Job Connect** is an end-to-end digital recruitment platform designed to eliminate the "resume black hole" and streamline the hiring lifecycle for both applicants and employers.

The platform provides a dual-persona workflow:
1. **Candidate Portal**: Browse verified job vacancies with faceted filtering, submit comprehensive application dossiers with PDF resumes, and monitor real-time review stages.
2. **Employer / Recruiter Console**: Publish and manage job postings, review applicant dossiers, inspect resumes, and advance candidates through a deterministic Applicant Tracking System (ATS) state machine:
   $$\text{Applied} \longrightarrow \text{Reviewing} \longrightarrow \text{Shortlisted} \longrightarrow \text{Interview Scheduled} \longrightarrow \text{Accepted} / \text{Rejected}$$

---

## 🌟 Key Features

### 💼 For Job Seekers
- **Faceted Vacancy Search**: Filter listings by title, skills, employment type (*Full-Time, Remote, Internship, Contract, Part-Time*), and experience level.
- **Application Dossier Submissions**: Apply using your profile resume or upload a custom resume file alongside cover notes and qualification summaries.
- **Real-Time Application Tracking**: Live visual status badges and internal recruiter feedback notes on all submitted applications.
- **Candidate Profile Management**: Manage academic degrees, graduation years, percentages, and work experiences.

### 🏢 For Recruiters & Employers
- **Recruiter Management Console**: Overview metrics for active vacancies, total applications, and candidate pipeline volume.
- **Rapid Vacancy Publishing**: Intuitive forms for creating vacancies with skills, compensation bands, and detailed descriptions.
- **Applicant Tracking System (ATS)**: Filter candidates by review stage, download attached resumes, record recruiter evaluation notes, and update statuses dynamically.
- **Listing Lifecycle Controls**: Toggle between `Active` and `Closed` listing states or delete vacancies with automatic cleanup.

### 🔒 Enterprise Identity & Security
- **Clerk Authentication**: Turnkey identity management, social logins, passwordless sign-in, MFA, and edge-distributed session tokens.
- **Automatic User Provisioning**: Express middleware verifies Clerk session tokens and auto-provisions user profiles in MongoDB.
- **Cloud Document Storage**: Integrated with Cloudinary for handling avatars and candidate resumes with automated cleanup.

---

## 🏗️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite | Component-driven Single Page Application (SPA) |
| **Routing** | React Router DOM v6 | Declarative client-side routing & protected routes |
| **Styling** | Tailwind CSS | Modern utility-first responsive design |
| **Icons** | Lucide React | Clean, consistent UI iconography |
| **API Client** | Axios | Configured with Clerk token interceptors & credentials |
| **Backend Server** | Node.js, Express.js | Event-driven RESTful API microservice (ES Modules) |
| **Database** | MongoDB Atlas (Cloud M0) | Flexible document database managed via Mongoose |
| **Identity & Auth** | Clerk Authentication | Enterprise user identity, session management & RBAC |
| **File Handling** | Multer & Cloudinary | Multipart document validation and cloud storage |
| **Hosting** | Vercel & Render | Cloud hosting with automatic GitHub CI/CD |

---

## 📁 Repository Structure

```
job-connect/
├── backend/
│   ├── controllers/
│   │   ├── application.controller.js  # ATS pipeline & applicant tracking
│   │   ├── experience.controller.js   # Work experience CRUD
│   │   ├── job.controller.js          # Vacancy creation, filters, search
│   │   ├── qualification.controller.js# Academic qualification CRUD
│   │   └── user.controller.js         # Clerk profile synchronization
│   ├── middleware/
│   │   ├── authentication.js          # Clerk session token verification
│   │   └── multer.js                  # Multipart document upload middleware
│   ├── models/
│   │   ├── application.model.js       # ATS application schema
│   │   ├── experience.model.js        # Work experience schema
│   │   ├── job.model.js               # Job vacancy schema
│   │   ├── qualification.model.js     # Academic qualification schema
│   │   └── user.model.js              # User & recruiter schema (Clerk linked)
│   ├── routes/
│   │   ├── application.route.js
│   │   ├── experience.route.js
│   │   ├── job.route.js
│   │   ├── qualification.route.js
│   │   └── user.route.js
│   ├── utils/
│   │   ├── bcrypt.js                  # Password verification utilities
│   │   ├── cloudinary.js              # Cloudinary asset uploader
│   │   ├── db.js                      # MongoDB connection handler
│   │   └── filehandler.js             # Local filesystem cleanup
│   ├── index.js                       # Express server entrypoint
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── Navbar.jsx             # Role-aware nav with Clerk UserButton
│   │   │   ├── ProtectedRoute.jsx     # Route guard enforcing roles
│   │   │   └── StatusBadge.jsx        # Color-coded ATS stage badge
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Clerk auth & MongoDB user context
│   │   ├── pages/
│   │   │   ├── CandidateDashboard.jsx # Application status tracker
│   │   │   ├── CandidateProfile.jsx   # Profile, qualifications & CV
│   │   │   ├── Home.jsx               # Landing page with search banner
│   │   │   ├── JobApplicants.jsx      # Recruiter ATS candidate board
│   │   │   ├── JobDetails.jsx         # Job specification & application modal
│   │   │   ├── Jobs.jsx               # Search, faceted filters & pagination
│   │   │   ├── Login.jsx              # Clerk SignIn page
│   │   │   ├── PostJob.jsx            # Create job opening form
│   │   │   ├── RecruiterDashboard.jsx # Recruiter management console
│   │   │   └── Register.jsx           # Clerk SignUp with role selector
│   │   ├── services/
│   │   │   └── api.js                 # Axios instance with Clerk auth interceptors
│   │   ├── App.jsx                    # Routing & ClerkProvider shell
│   │   ├── index.css                  # Tailwind styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json                    # SPA routing rewrites for Vercel
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or local MongoDB instance
- [Clerk Account](https://clerk.com/)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=8000
NODE_ENV=development
database_url=mongodb+srv://<username>:<password>@cluster0.opgt5ai.mongodb.net/jobconnect?retryWrites=true&w=majority
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
cloudinary_API_key=your_cloudinary_api_key
cloudinary_API_secret=your_cloudinary_api_secret
cloudinary_cloud_name=your_cloudinary_cloud_name
```

Start the backend server:
```bash
npm run dev
# Server runs on http://localhost:8000
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Start the frontend development server:
```bash
npm run dev
# Application accessible at http://localhost:5173
```

---

## 📡 REST API Reference

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Root status endpoint & API documentation |
| `GET` | `/api/health` | Public | Service health check |
| `POST` | `/api/user/sync` | Authenticated | Synchronize Clerk user profile into MongoDB |
| `GET` | `/api/user/me` | Authenticated | Fetch current profile, qualifications & history |
| `PUT` | `/api/user/update-profile` | Authenticated | Update candidate or recruiter information |
| `POST` | `/api/user/update-resume` | Authenticated | Upload or replace resume PDF via Cloudinary |
| `POST` | `/api/user/update-avatar` | Authenticated | Upload or replace profile avatar |
| `GET` | `/api/job/all` | Public | Filterable, searchable, and paginated job listings |
| `GET` | `/api/job/get/:id` | Public | Detailed vacancy information & application check |
| `GET` | `/api/job/my-jobs` | Recruiter | List vacancies posted by logged-in recruiter |
| `POST` | `/api/job/create-job-opening` | Recruiter | Publish a new job opening |
| `PUT` | `/api/job/update-job/:id` | Recruiter | Edit job attributes or change active status |
| `DELETE` | `/api/job/delete-job-opening` | Recruiter | Delete job posting and clean up applications |
| `POST` | `/api/application/apply` | Candidate | Submit application with resume & details |
| `GET` | `/api/application/my-applications` | Candidate | Retrieve all applications submitted by candidate |
| `GET` | `/api/application/job/:jobId` | Recruiter | Retrieve all candidates for a specific job |
| `PATCH`| `/api/application/status/:id` | Recruiter | Update candidate ATS stage & add feedback note |
| `DELETE`| `/api/application/withdraw/:id`| Candidate | Withdraw submitted job application |

---

## 👥 Authors & Academic Attribution

- **Project Title**: Job Connect: A Modern Full-Stack Web-Based Job Recruitment and Applicant Tracking System
- **Course**: Minor Project Submission
- **Developer**: Samanvaya Vats ([@samanvayavats](https://github.com/samanvayavats))
- **Live Demo**: [https://job-connect-omega-three.vercel.app/](https://job-connect-omega-three.vercel.app/)
- **Backend API**: [https://job-connect-api-8w32.onrender.com/](https://job-connect-api-8w32.onrender.com/)
