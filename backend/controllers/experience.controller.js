import { Experience } from '../models/experience.model.js';

const addExperience = async (req, res) => {
    try {
        const { jobTitle, role, description } = req.body;

        if ([jobTitle, role, description].some((e) => !e || e.trim() === '')) {
            return res.status(400).json({
                message: 'All fields (Job title, role, and description) are required'
            });
        }

        const experience = await Experience.create({
            userId: req.user._id,
            jobTitle: jobTitle.trim(),
            role: role.trim(),
            description: description.trim()
        });

        return res.status(201).json({
            message: 'Experience added successfully',
            data: experience,
            experience
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error adding experience',
            error: error.message
        });
    }
};

const getMyExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find({ userId: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ experiences });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving experiences', error: error.message });
    }
};

const deleteExperience = async (req, res) => {
    try {
        const id = req.query.id || req.params.id;

        if (!id) {
            return res.status(400).json({
                message: 'Experience ID is required'
            });
        }

        const experience = await Experience.findById(id);

        if (!experience) {
            return res.status(404).json({
                message: 'Experience not found'
            });
        }

        if (experience.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to delete this experience' });
        }

        await Experience.findByIdAndDelete(id);

        return res.status(200).json({
            message: 'Experience deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting experience',
            error: error.message
        });
    }
};

export { addExperience, getMyExperiences, deleteExperience };
