# Job Connect 🚀

> A Modern Full-Stack Web-Based Job Recruitment and Applicant Tracking System (ATS) engineered with **React.js**, **Express.js**, **MongoDB**, and **Clerk**.

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Backend-Express.js%20%2B%20Node.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk%20%2B%20JWT-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)

---

## 📌 Overview

**Job Connect** is a complete, scalable digital recruitment exchange designed to eliminate the "resume black hole" and streamline the talent acquisition pipeline for both candidates and employers.

The platform provides a dual-persona workflow:
1. **Candidate Portal**: Browse curated job listings with multi-faceted filtering, submit customized application dossiers with resumes, and monitor application status in real-time.
2. **Employer / Recruiter Console**: Publish and manage job vacancies, review incoming applicant credentials, inspect candidate resumes, and transition applicants through a deterministic Applicant Tracking System (ATS) lifecycle (`Applied` $\rightarrow$ `Reviewing` $\rightarrow$ `Shortlisted` $\rightarrow$ `Interview Scheduled` $\rightarrow$ `Accepted` / `Rejected`).

---

## 🌟 Key Features

### 💼 For Job Seekers
- **Dynamic Vacancy Exploration**: Real-time faceted search and filtering across job title, technical skills, employment type (Full-Time, Remote, Internship, etc.), and experience levels.
- **Detailed Job Dossiers**: Comprehensive view of job responsibilities, compensation, requirements, and hiring company profiles.
- **One-Click Application Submissions**: Apply using your saved profile resume or upload a custom PDF/DOCX resume file alongside optional cover notes.
- **Application Status Tracker**: Live visual tracker for all submitted applications with color-coded status badges and internal recruiter feedback notes.
- **Candidate Profile Management**: Interactive management of educational qualifications (degrees, percentages, institutions) and work history experiences.

### 🏢 For Recruiters & Employers
- **Recruiter Management Console**: Overview metrics including total vacancies, active postings, and candidate pipeline volume.
- **Quick Vacancy Publishing**: Intuitive forms for creating vacancies with skills, salary ranges, and detailed descriptions.
- **Applicant Tracking System (ATS)**: Filter candidates by stage, review candidate contact details, inspect attached resumes, and record internal evaluation notes.
- **Listing Lifecycle Controls**: One-click toggling between `Active` and `Closed` listing states or permanent deletion.

### 🔒 Security & Architecture
- **Dual Authentication**: Integrated support for modern **Clerk SSO** and robust **JWT + HTTP-Only Cookies** session management with password hashing via bcrypt.
- **Cloud Document Storage**: Integrated with Cloudinary for handling avatars and candidate resumes with automated file cleanup.
- **Decoupled Architecture**: Fast React SPA powered by Vite communicating with an asynchronous RESTful Express API backend.

---

## 🏗️ Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite | High-performance Single Page Application (SPA) |
| **Routing** | React Router DOM v6 | Declarative client-side routing and protected routes |
| **Styling** | Tailwind CSS | Utility-first responsive design and modern interface |
| **Icons** | Lucide React | Consistent modern iconography |
| **API Client** | Axios | Configured with token interceptors and credentials |
| **Backend Server** | Node.js, Express.js | Event-driven RESTful API microservice (ES Modules) |
| **Database** | MongoDB & Mongoose | Flexible document database with schema enforcement |
| **Identity & Auth** | Clerk & JWT | Secure user identity, RBAC, and session management |
| **File Handling** | Multer & Cloudinary | Multipart document validation and cloud storage |

---

## 📁 Repository Structure

```
job-connect/
├── backend/
│   ├── controllers/
│   │   ├── application.controller.js  # ATS pipeline & submissions
│   │   ├── experience.controller.js   # Work experience CRUD
│   │   ├── job.controller.js          # Vacancy creation, filters, search
│   │   ├── qualification.controller.js# Educational history CRUD
│   │   └── user.controller.js         # Auth, profile, Clerk sync
│   ├── middleware/
│   │   ├── authentication.js          # JWT & Bearer token verification
│   │   └── multer.js                  # Document upload middleware
│   ├── models/
│   │   ├── application.model.js       # ATS application schema
│   │   ├── experience.model.js        # Work experience schema
│   │   ├── job.model.js               # Job vacancy schema
│   │   ├── qualification.model.js     # Academic qualification schema
│   │   └── user.model.js              # User & recruiter schema
│   ├── routes/
│   │   ├── application.route.js
│   │   ├── experience.route.js
│   │   ├── job.route.js
│   │   ├── qualification.route.js
│   │   └── user.route.js
│   ├── utils/
│   │   ├── bcrypt.js                  # Password hashing & verification
│   │   ├── cloudinary.js              # Cloud asset management
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
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global user session & auth state
│   │   ├── pages/
│   │   │   ├── CandidateDashboard.jsx # Application status tracker
│   │   │   ├── CandidateProfile.jsx   # Profile, qualifications & CV
│   │   │   ├── Home.jsx               # Landing page with search banner
│   │   │   ├── JobApplicants.jsx      # Recruiter ATS candidate tracker
│   │   │   ├── JobDetails.jsx         # Job view & application modal
│   │   │   ├── Jobs.jsx               # Search, faceted filters & pagination
│   │   │   ├── Login.jsx              # Account login
│   │   │   ├── PostJob.jsx            # Create job vacancy form
│   │   │   ├── RecruiterDashboard.jsx # Recruiter management console
│   │   │   └── Register.jsx           # Dual-role account registration
│   │   ├── services/
│   │   │   └── api.js                 # Axios instance with auth interceptors
│   │   ├── App.jsx                    # Routing configuration
│   │   ├── index.css                  # Tailwind styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- [Cloudinary Account](https://cloudinary.com/) (For resume and avatar uploads)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=8000
database_url=mongodb+srv://<username>:<password>@cluster0.mongodb.net/jobconnect?retryWrites=true&w=majority
refresh_token_secret=your_super_secret_refresh_key_12345
access_token_secret=your_super_secret_access_key_12345
cloudinary_API_key=your_cloudinary_api_key
cloudinary_API_secret=your_cloudinary_api_secret
cloudinary_cloud_name=your_cloudinary_cloud_name
NODE_ENV=development
```

Start the backend development server:
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
# Optional: Provide Clerk key if integrating Clerk SSO
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
```

Start the frontend development server:
```bash
npm run dev
# Application accessible at http://localhost:5173
```

To create an optimized production build:
```bash
npm run build
```

---

## 📡 Primary REST API Endpoints

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/user/register` | Public | Register new Job Seeker or Recruiter |
| `POST` | `/api/user/login` | Public | Authenticate user & issue tokens |
| `GET` | `/api/user/me` | Authenticated | Fetch current profile, qualifications & history |
| `PUT` | `/api/user/update-profile` | Authenticated | Update candidate or recruiter information |
| `POST` | `/api/user/clerk-sync` | Public | Synchronize Clerk SSO user profile into MongoDB |
| `GET` | `/api/job/all` | Public | Filterable, searchable, and paginated job list |
| `GET` | `/api/job/get/:id` | Public | Detailed vacancy information & application check |
| `GET` | `/api/job/my-jobs` | Recruiter | List vacancies posted by logged-in recruiter |
| `POST` | `/api/job/create-job-opening` | Recruiter | Publish a new job opening |
| `PUT` | `/api/job/update-job/:id` | Recruiter | Edit job attributes or change active status |
| `DELETE` | `/api/job/delete-job-opening` | Recruiter | Delete job posting and clean up applications |
| `POST` | `/api/application/apply` | Candidate | Submit application with resume & details |
| `GET` | `/api/application/my-applications` | Candidate | Retrieve all submitted applications |
| `GET` | `/api/application/job/:jobId` | Recruiter | Retrieve all candidates for a specific job |
| `PATCH`| `/api/application/status/:id` | Recruiter | Update candidate ATS stage & add feedback note |
| `DELETE`| `/api/application/withdraw/:id`| Candidate | Withdraw submitted job application |

---

## 👥 Authors & Academic Attribution

- **Project Title**: Job Connect
- **Course**: Minor Project Submission
- **Developer**: Samanvaya Vats ([@samanvayavats](https://github.com/samanvayavats))
- **Tech Stack**: React, Express, MongoDB, Clerk
