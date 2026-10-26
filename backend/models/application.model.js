import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true
        },
        username: {
            type: String,
            required: true,
            trim: true
        },
        resume: {
            type: String,
            required: true
        },
        qualification: {
            type: String,
            required: true,
            trim: true
        },
        experience: {
            type: String,
            required: true
        },
        fullName: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        },
        phone: {
            type: String,
            default: ''
        },
        coverLetter: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            enum: ['Applied', 'Reviewing', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Accepted'],
            default: 'Applied'
        },
        recruiterNote: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

export const Application = mongoose.model('Application', applicationSchema);
