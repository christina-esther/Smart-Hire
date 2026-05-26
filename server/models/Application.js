const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, default: '' },
  resume: { type: String },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'],
    default: 'pending',
  },
  recruiterNotes: { type: String, default: '' },
}, { timestamps: true });

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
