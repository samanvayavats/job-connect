import dotenv from 'dotenv';

dotenv.config({
    path: '.env'
});

import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
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
    'http://127.0.0.1:3000'
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, curl, postman)
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(null, true); // Permissive in development
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'healthy', project: 'Job Connect API' });
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
        error: process.env.NODE_ENV === 'production' ? null : err.message
    });
});

const PORT = process.env.PORT || 8000;

// Connecting the db and starting server
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
