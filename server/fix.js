require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  
  const hash = await bcrypt.hash('password123', 12);
  
  await User.updateOne({ email: 'alex@example.com' }, { $set: { password: hash } });
  await User.updateOne({ email: 'recruiter@techcorp.io' }, { $set: { password: hash } });
  await User.updateOne({ email: 'admin@smarthire.io' }, { $set: { password: hash } });
  
  const user = await User.findOne({ email: 'alex@example.com' });
  const match = await bcrypt.compare('password123', user.password);
  console.log('Fix successful:', match);
  
  process.exit(0);
});