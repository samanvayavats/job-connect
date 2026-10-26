import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        clerkId: {
            type: String,
            unique: true,
            sparse: true,
            index: true
        },
        userName: {
            type: String,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            default: ''
        },
        role: {
            type: String,
            enum: ['job_seeker', 'recruiter'],
            default: 'job_seeker'
        },
        phoneNumber: {
            type: String,
            default: ''
        },
        password: {
            type: String,
            required: false // Managed securely via Clerk
        },
        summary: {
            type: String,
            default: ''
        },
        resume: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
