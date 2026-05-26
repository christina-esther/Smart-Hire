const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

exports.getDashboardStats = async (req, res) => {
  const [totalUsers, totalJobs, totalApplications, recentJobs, recentApplications] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
    Job.find().sort('-createdAt').limit(5).populate('postedBy', 'name'),
    Application.find().sort('-createdAt').limit(5)
      .populate('applicant', 'name email')
      .populate('job', 'title company'),
  ]);

  const candidates = await User.countDocuments({ role: 'candidate' });
  const recruiters = await User.countDocuments({ role: 'recruiter' });
  const activeJobs = await Job.countDocuments({ status: 'active' });

  const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const newUsers = await User.countDocuments({ createdAt: { $gte: last30 } });
  const newJobs = await Job.countDocuments({ createdAt: { $gte: last30 } });

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalJobs,
      totalApplications,
      candidates,
      recruiters,
      activeJobs,
      newUsers,
      newJobs,
    },
    recentJobs,
    recentApplications,
  });
};
