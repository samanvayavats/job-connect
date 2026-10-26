import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        experienceRequired: {
            type: String,
            required: true
        },
        companyName: {
            type: String,
            required: true
        },
        location: {
            type: String,
            default: 'Remote'
        },
        jobType: {
            type: String,
            enum: ['Full-Time', 'Part-Time', 'Remote', 'Contract', 'Internship'],
            default: 'Full-Time'
        },
        salary: {
            type: String,
            default: 'Competitive'
        },
        skillsRequired: {
            type: [String],
            default: []
        },
        status: {
            type: String,
            enum: ['Active', 'Closed'],
            default: 'Active'
        },
        description: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export const Job = mongoose.model('Job', jobSchema);
