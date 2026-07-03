import { Qualification } from '../models/qualification.model.js';

const addQualification = async (req, res) => {
    try {
        const { instituteName, courseName, startingYear, endingYear, percentage } = req.body;

        if (
            [instituteName, courseName, startingYear, endingYear, percentage].some(
                (e) => e?.trim() == ''
            )
        ) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const qualification = await Qualification.create({
            userId: req.user._id,
            instituteName,
            courseName,
            startingYear,
            endingYear,
            percentage
        });

        return res.status(200).json({
            qualification,
            message: 'qualification  added'
        });
    } catch (error) {
        console.log('the error at the time of addind the qualification');

        return res.status(500).json({
            message: 'adding qualification failed , Please try again after some time'
        });
    }
};

const deleteQualification = async (req, res) => {
    try {
        const id = req.query.id;

        if (!id) {
            return res.status.json({
                message: 'id is required'
            });
        }

        const qualification = await Qualification.findByIdAndDelete(id);

        const qualificationAfterDeletion = await Qualification.findOne({ _id: id });

        if (qualificationAfterDeletion) {
            return res.status(500).json({
                message: 'qualification deletion failed , pls try agian '
            });
        }

        return res.status(200).json({
            message: 'qualification deleted successfully'
        });
    } catch (error) {
        console.log('error at the time of deleting the qualification', error);
        return res.status(500).json({
            message: 'qualification deletion failed , pls try agian '
        });
    }
};

export { addQualification, deleteQualification };
