import mongoose from 'mongoose';

const qualificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        instituteName: {
            type: String,
            required: true
        },
        courseName: {
            type: String,
            required: true
        },
        startingYear: {
            type: String,
            required: true
        },
        endingYear: {
            type: String,
            required: true
        },
        percentage: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export const Qualification = mongoose.model('Qualification', qualificationSchema);
