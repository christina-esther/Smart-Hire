const Job = require('../models/Job');
const User = require('../models/User');

// Uses Gemini API for AI recommendations
exports.getRecommendations = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user.skills || user.skills.length === 0) {
    const jobs = await Job.find({ status: 'active' }).limit(6).sort('-createdAt').populate('postedBy', 'name');
    return res.json({ success: true, jobs, aiPowered: false, message: 'Add skills to get AI recommendations' });
  }

  const allJobs = await Job.find({ status: 'active' }).populate('postedBy', 'name');

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    // Fallback: simple skill matching without AI
    const scored = allJobs.map(job => {
      const jobSkills = job.skills.map(s => s.toLowerCase());
      const userSkills = user.skills.map(s => s.toLowerCase());
      const matches = userSkills.filter(s => jobSkills.some(js => js.includes(s) || s.includes(js)));
      return { job, score: matches.length };
    });

    scored.sort((a, b) => b.score - a.score);
    const jobs = scored.slice(0, 6).map(s => s.job);
    return res.json({ success: true, jobs, aiPowered: false });
  }

  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      User profile:
      - Skills: ${user.skills.join(', ')}
      - Experience: ${user.experience} years
      - Education: ${user.education || 'Not specified'}
      
      Available jobs (JSON array):
      ${JSON.stringify(allJobs.slice(0, 20).map(j => ({ id: j._id, title: j.title, skills: j.skills, experience: j.experience, category: j.category })))}
      
      Return ONLY a JSON array of the top 6 job IDs best matching the user profile, ordered by relevance. Format: ["id1","id2",...]
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/\[.*?\]/s);
    const recommendedIds = match ? JSON.parse(match[0]) : [];

    const jobs = recommendedIds
      .map(id => allJobs.find(j => j._id.toString() === id))
      .filter(Boolean)
      .slice(0, 6);

    res.json({ success: true, jobs, aiPowered: true });
  } catch (err) {
    console.error('Gemini AI error:', err.message);
    const jobs = allJobs.slice(0, 6);
    res.json({ success: true, jobs, aiPowered: false });
  }
};
