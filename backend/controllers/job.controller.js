import { Job } from '../models/job.model.js';

 const createJob = async (req, res) => {
  try {
    const { userId, title, experienceRequired, companyName, description } = req.body;

     if ([userId, title, experienceRequired, companyName, description ].some((e) => e?.trim() == '')) {
            return res.status(400).json({
                message: 'all the fields are required'
            });
        }

    const job = await Job.create({
      userId : req?.user?._id,
      title,
      experienceRequired,
      companyName,
      description
    });

    const savedJob = await job.save();
    return res.status(201).json({savedJob , message :'job created successfully'});
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create job', error: error.message });
  }
};

 const deleteJob = async (req, res) => {
  try {
    const { id } = req.query.id;
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete job', error: error.message });
  }
};

export {
    createJob , deleteJob
}