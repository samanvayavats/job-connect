import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
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
  }
}, {
  timestamps: true
});


export const Application = mongoose.model('Application', applicationSchema);
