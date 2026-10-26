import { Qualification } from '../models/qualification.model.js';

const addQualification = async (req, res) => {
    try {
        const { instituteName, courseName, startingYear, endingYear, percentage } = req.body;

        if (
            [instituteName, courseName, startingYear, endingYear, percentage].some(
                (e) => !e || e.toString().trim() === ''
            )
        ) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const qualification = await Qualification.create({
            userId: req.user._id,
            instituteName: instituteName.trim(),
            courseName: courseName.trim(),
            startingYear: startingYear.toString().trim(),
            endingYear: endingYear.toString().trim(),
            percentage: percentage.toString().trim()
        });

        return res.status(201).json({
            qualification,
            message: 'Qualification added successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Adding qualification failed, please try again',
            error: error.message
        });
    }
};

const getMyQualifications = async (req, res) => {
    try {
        const qualifications = await Qualification.find({ userId: req.user._id }).sort({ endingYear: -1 });
        return res.status(200).json({ qualifications });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving qualifications', error: error.message });
    }
};

const deleteQualification = async (req, res) => {
    try {
        const id = req.query.id || req.params.id;

        if (!id) {
            return res.status(400).json({
                message: 'Qualification ID is required'
            });
        }

        const qualification = await Qualification.findById(id);

        if (!qualification) {
            return res.status(404).json({ message: 'Qualification not found' });
        }

        if (qualification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to delete this qualification' });
        }

        await Qualification.findByIdAndDelete(id);

        return res.status(200).json({
            message: 'Qualification deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Qualification deletion failed',
            error: error.message
        });
    }
};

export { addQualification, getMyQualifications, deleteQualification };
