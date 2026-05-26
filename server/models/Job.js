const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  skills: [{ type: String }],
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' },
  },
  location: { type: String, required: true },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'], default: 'Full-time' },
  experience: { type: String, enum: ['Fresher', '1-3 years', '3-5 years', '5+ years'], default: 'Fresher' },
  category: { type: String, required: true },
  company: {
    name: { type: String, required: true },
    logo: { type: String, default: '' },
    website: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
  deadline: { type: Date },
  views: { type: Number, default: 0 },
}, { timestamps: true });

jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
