import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  resumeData: {
    type: Object,
    required: true,
  },
  jdText: {
    type: String,
  },
  analysis: {
    type: Object,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
