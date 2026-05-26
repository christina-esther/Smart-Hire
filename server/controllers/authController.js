const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });

  const allowedRoles = ['candidate', 'recruiter'];
  const userRole = allowedRoles.includes(role) ? role : 'candidate';

  const user = await User.create({ name, email, password, role: userRole });
  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'Account has been deactivated' });
  }

  const token = signToken(user._id);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      skills: user.skills,
    },
  });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password').populate('savedJobs', 'title company location type');
  res.json({ success: true, user });
};
