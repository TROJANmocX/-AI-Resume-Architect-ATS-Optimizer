import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Template description is required'],
    trim: true,
  },
  resumeData: {
    type: Object,
    required: [true, 'Resume data is required for templates'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Template || mongoose.model('Template', TemplateSchema);
