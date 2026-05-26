const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

exports.apply = async (req, res) => {
  const { jobId } = req.params;
  const { coverLetter } = req.body;

  const job = await Job.findById(jobId);
  if (!job || job.status !== 'active') {
    return res.status(404).json({ success: false, message: 'Job not found or closed' });
  }

  const existing = await Application.findOne({ job: jobId, applicant: req.user.id });
  if (existing) return res.status(409).json({ success: false, message: 'Already applied to this job' });

  const user = await User.findById(req.user.id);

  const application = await Application.create({
    job: jobId,
    applicant: req.user.id,
    coverLetter,
    resume: user.resume,
  });

  res.status(201).json({ success: true, application });
};

exports.getMyApplications = async (req, res) => {
  const applications = await Application.find({ applicant: req.user.id })
    .populate({ path: 'job', select: 'title company location type salary status', populate: { path: 'postedBy', select: 'name' } })
    .sort('-createdAt');

  res.json({ success: true, applications });
};

exports.getJobApplicants = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user.id });
  if (!job && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate('applicant', 'name email phone skills experience education resume resumeOriginalName avatar location')
    .sort('-createdAt');

  res.json({ success: true, applications });
};

exports.updateApplicationStatus = async (req, res) => {
  const { status, recruiterNotes } = req.body;
  const validStatuses = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const application = await Application.findById(req.params.id).populate('job');
  if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

  if (application.job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  application.status = status;
  if (recruiterNotes) application.recruiterNotes = recruiterNotes;
  await application.save();

  res.json({ success: true, application });
};
