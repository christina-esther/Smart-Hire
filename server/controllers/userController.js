const User = require('../models/User');
const Job = require('../models/Job');

exports.updateProfile = async (req, res) => {
  const allowed = ['name', 'phone', 'location', 'bio', 'skills', 'experience', 'education', 'avatar'];
  const updates = {};
  allowed.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
  res.json({ success: true, user });
};

exports.uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { resume: req.file.filename, resumeOriginalName: req.file.originalname },
    { new: true }
  ).select('-password');

  res.json({ success: true, message: 'Resume uploaded successfully', user });
};

exports.saveJob = async (req, res) => {
  const user = await User.findById(req.user.id);
  const jobId = req.params.jobId;

  const idx = user.savedJobs.indexOf(jobId);
  if (idx > -1) {
    user.savedJobs.splice(idx, 1);
    await user.save();
    return res.json({ success: true, message: 'Job removed from saved', saved: false });
  }

  user.savedJobs.push(jobId);
  await user.save();
  res.json({ success: true, message: 'Job saved successfully', saved: true });
};

exports.getSavedJobs = async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: 'savedJobs',
    populate: { path: 'postedBy', select: 'name' },
  });
  res.json({ success: true, jobs: user.savedJobs });
};

exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };

  const [users, total] = await Promise.all([
    User.find(filter).select('-password').skip(skip).limit(limit).sort('-createdAt'),
    User.countDocuments(filter),
  ]);

  res.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
};

exports.toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
};
