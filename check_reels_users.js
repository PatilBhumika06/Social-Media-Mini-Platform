const mongoose = require('mongoose');
const Reel = require('./models/Reel');
const User = require('./models/User');
require('dotenv').config();

async function checkReelsWithUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const reels = await Reel.find().populate('user', 'username');
    console.log('Reels with user info:');
    reels.forEach((r, i) => {
      console.log(`${i+1}. User: ${r.user?.username || 'Unknown'} (${r.user?._id || r.user})`);
      console.log(`   Video: ${r.videoUrl}`);
      console.log(`   ID: ${r._id}`);
      console.log('---');
    });
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkReelsWithUsers();