import { Experience } from '../models/experience.model.js';

const addExperience = async (req, res) => {
    try {
        const { jobTitle, role, description } = req.body;

        if ([jobTitle, role, description].some((e) => e?.trim() == '')) {
            return res.status(400).json({
                message: 'all the fields are required'
            });
        }

        const experience = await Experience.create({
            userId: req.user?._id,
            jobTitle,
            role,
            description
        });

        const savedExperience = await experience.save();

        res.status(201).json({
            message: 'Experience added successfully',
            data: savedExperience
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding experience',
            error: error.message
        });
    }
};

const deleteExperience = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                message: 'Experience ID is required'
            });
        }

        const deletedExperience = await Experience.findByIdAndDelete(id);

        if (!deletedExperience) {
            return res.status(404).json({
                message: 'Experience not found'
            });
        }

        res.status(200).json({
            message: 'Experience deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting experience',
            error: error.message
        });
    }
};

export { addExperience, deleteExperience };
