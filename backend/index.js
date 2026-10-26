import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({
    path: '.env'
});

import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { clerkMiddleware } from '@clerk/express';
import connectdb from './utils/db.js';
import userRouter from './routes/user.route.js';
import qualificationRouter from './routes/qualification.route.js';
import experienceRouter from './routes/experience.route.js';
import jobRouter from './routes/job.route.js';
import applicationRouter from './routes/application.route.js';

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://job-connect-omega-three.vercel.app'
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (e.g. mobile apps, curl, postman)
            if (!origin) return callback(null, true);

            try {
                const hostname = new URL(origin).hostname;
                if (
                    allowedOrigins.includes(origin) ||
                    hostname.endsWith('vercel.app') ||
                    hostname === 'localhost' ||
                    hostname === '127.0.0.1'
                ) {
                    return callback(null, true);
                }
            } catch (e) {
                // Ignore URL parsing errors
            }
            return callback(null, true);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-clerk-user-id']
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Initialize Clerk Authentication Middleware
try {
    app.use(clerkMiddleware());
} catch (clerkInitErr) {
    console.warn('Clerk middleware initialized in standalone fallback mode:', clerkInitErr.message);
}

// Root Status Endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'online',
        message: 'Job Connect REST API is running successfully',
        documentation: 'Full-stack job recruitment and ATS portal powered by Express, MongoDB, and Clerk',
        endpoints: {
            health: '/api/health',
            jobs: '/api/job/all',
            userProfile: '/api/user/me',
            applications: '/api/application/my-applications'
        }
    });
});

// Ensure public directory exists for static asset serving
const publicPath = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
}

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        project: 'Job Connect API (Clerk Auth)',
        build: 'v1.1.0-memory-storage',
        storage: 'memoryStorage'
    });
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/qualification', qualificationRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/job', jobRouter);
app.use('/api/application', applicationRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: err?.message || 'Server error occurred'
    });
});

const PORT = process.env.PORT || 8000;

// Connect to MongoDB and start server
connectdb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Job Connect server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });

export default app;
