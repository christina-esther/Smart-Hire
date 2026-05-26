const Job = require('../models/Job');
const Application = require('../models/Application');

exports.createJob = async (req, res) => {
  const job = await Job.create({ ...req.body, postedBy: req.user.id });
  res.status(201).json({ success: true, job });
};

exports.getJobs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { status: 'active' };

  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { 'company.name': { $regex: req.query.search, $options: 'i' } },
      { skills: { $in: [new RegExp(req.query.search, 'i')] } },
    ];
  }
  if (req.query.location) filter.location = { $regex: req.query.location, $options: 'i' };
  if (req.query.type) filter.type = req.query.type;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.experience) filter.experience = req.query.experience;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate('postedBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt'),
    Job.countDocuments(filter),
  ]);

  res.json({ success: true, jobs, total, page, pages: Math.ceil(total / limit) });
};

exports.getJob = async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name email location');
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

  job.views += 1;
  await job.save();

  res.json({ success: true, job });
};

exports.updateJob = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, postedBy: req.user.id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found or not authorized' });

  Object.assign(job, req.body);
  await job.save();

  res.json({ success: true, job });
};

exports.deleteJob = async (req, res) => {
  const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, postedBy: req.user.id };
  const job = await Job.findOneAndDelete(query);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found or not authorized' });

  await Application.deleteMany({ job: req.params.id });
  res.json({ success: true, message: 'Job deleted' });
};

exports.getRecruiterJobs = async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user.id })
    .populate('applicants')
    .sort('-createdAt');

  const jobsWithCount = await Promise.all(
    jobs.map(async (job) => {
      const count = await Application.countDocuments({ job: job._id });
      return { ...job.toObject(), applicantCount: count };
    })
  );

  res.json({ success: true, jobs: jobsWithCount });
};
