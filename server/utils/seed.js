require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Job = require('../models/Job');

const connectDB = require('../config/db');

const seed = async () => {
  await connectDB();

  await User.deleteMany();
  await Job.deleteMany();

  const password = await bcrypt.hash('password123', 12);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@smarthire.io',
    password,
    role: 'admin',
    isActive: true,
  });

  const recruiter = await User.create({
    name: 'TechCorp HR',
    email: 'recruiter@techcorp.io',
    password,
    role: 'recruiter',
    location: 'San Francisco, CA',
    isActive: true,
  });

  const candidate = await User.create({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password,
    role: 'candidate',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    experience: 3,
    education: "Bachelor's in Computer Science",
    location: 'New York, NY',
    bio: 'Full-stack developer passionate about building scalable web apps.',
    isActive: true,
  });

  const jobsData = [
    {
      title: 'Senior React Developer',
      description: 'We are looking for an experienced React developer to join our growing team. You will build and maintain high-performance web applications.',
      requirements: ['5+ years experience', 'Strong React/Redux knowledge', 'REST API experience'],
      responsibilities: ['Build reusable UI components', 'Collaborate with design team', 'Code reviews'],
      skills: ['React', 'Redux', 'TypeScript', 'GraphQL'],
      salary: { min: 100000, max: 140000, currency: 'USD' },
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: '5+ years',
      category: 'Engineering',
      company: { name: 'TechCorp Inc.', logo: '', website: 'https://techcorp.io', description: 'Leading tech company' },
      postedBy: recruiter._id,
      status: 'active',
    },
    {
      title: 'Node.js Backend Engineer',
      description: 'Join our backend team to build scalable APIs and microservices for our platform serving millions of users.',
      requirements: ['3+ years Node.js', 'MongoDB experience', 'REST/GraphQL'],
      responsibilities: ['Design and build APIs', 'Database optimization', 'System architecture'],
      skills: ['Node.js', 'Express', 'MongoDB', 'Docker'],
      salary: { min: 90000, max: 120000, currency: 'USD' },
      location: 'Remote',
      type: 'Remote',
      experience: '3-5 years',
      category: 'Engineering',
      company: { name: 'DataFlow Systems', logo: '', website: 'https://dataflow.io', description: 'Data infrastructure startup' },
      postedBy: recruiter._id,
      status: 'active',
    },
    {
      title: 'UX/UI Designer',
      description: 'Create beautiful, user-centered designs for web and mobile products. Work closely with product and engineering teams.',
      requirements: ['Portfolio required', 'Figma proficiency', '3+ years experience'],
      responsibilities: ['Create wireframes & prototypes', 'User research', 'Design system maintenance'],
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      salary: { min: 80000, max: 110000, currency: 'USD' },
      location: 'New York, NY',
      type: 'Full-time',
      experience: '3-5 years',
      category: 'Design',
      company: { name: 'Creative Labs', logo: '', website: 'https://creativelabs.io', description: 'Design-first product studio' },
      postedBy: recruiter._id,
      status: 'active',
    },
    {
      title: 'Machine Learning Engineer',
      description: 'Build and deploy ML models that power our recommendation engine and predictive analytics platform.',
      requirements: ['MS/PhD in ML or CS', 'Python expertise', 'TensorFlow/PyTorch'],
      responsibilities: ['Build ML pipelines', 'Model training & evaluation', 'Production deployment'],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'SQL'],
      salary: { min: 130000, max: 180000, currency: 'USD' },
      location: 'Seattle, WA',
      type: 'Full-time',
      experience: '5+ years',
      category: 'Data Science',
      company: { name: 'AI Dynamics', logo: '', website: 'https://aidynamics.io', description: 'AI-first startup' },
      postedBy: recruiter._id,
      status: 'active',
    },
    {
      title: 'DevOps Engineer',
      description: 'Manage our cloud infrastructure on AWS, automate deployment pipelines, and ensure 99.9% uptime for our services.',
      requirements: ['AWS/GCP certified', 'Kubernetes experience', 'CI/CD pipelines'],
      responsibilities: ['Infrastructure as code', 'Monitor & alert systems', 'Security hardening'],
      skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'Jenkins'],
      salary: { min: 100000, max: 135000, currency: 'USD' },
      location: 'Austin, TX',
      type: 'Full-time',
      experience: '3-5 years',
      category: 'DevOps',
      company: { name: 'CloudBase', logo: '', website: 'https://cloudbase.io', description: 'Cloud infrastructure company' },
      postedBy: recruiter._id,
      status: 'active',
    },
    {
      title: 'Frontend Developer Intern',
      description: 'Great opportunity for students or recent graduates to gain real-world experience building modern web apps.',
      requirements: ['React basics', 'HTML/CSS/JS', 'Enrolled in CS program'],
      responsibilities: ['Build UI features', 'Write tests', 'Participate in standups'],
      skills: ['React', 'HTML', 'CSS', 'JavaScript'],
      salary: { min: 25, max: 40, currency: 'USD' },
      location: 'Chicago, IL',
      type: 'Internship',
      experience: 'Fresher',
      category: 'Engineering',
      company: { name: 'StartupXYZ', logo: '', website: 'https://startupxyz.io', description: 'Fast-growing startup' },
      postedBy: recruiter._id,
      status: 'active',
    },
  ];

  await Job.insertMany(jobsData);

  console.log('✅ Seed complete!');
  console.log('👤 Admin: admin@smarthire.io / password123');
  console.log('🏢 Recruiter: recruiter@techcorp.io / password123');
  console.log('👔 Candidate: alex@example.com / password123');

  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
