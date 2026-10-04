const mongoose = require('mongoose');
const Reel = require('./models/Reel');
const User = require('./models/User');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

console.log('Testing reels functionality...');

async function testReels() {
  try {
    // Find a user to test with
    const user = await User.findOne();
    if (!user) {
      console.log('No users found in database');
      return;
    }
    
    console.log('Found user:', user.username);
    
    // Check if user has any reels
    const reels = await Reel.find({ user: user._id });
    console.log('User has', reels.length, 'reels');
    
    if (reels.length > 0) {
      console.log('Reels found:');
      reels.forEach((reel, index) => {
        console.log(`${index + 1}. Video URL: ${reel.videoUrl}`);
        console.log(`   Caption: ${reel.caption}`);
        console.log(`   Created: ${reel.createdAt}`);
      });
    } else {
      console.log('No reels found for this user');
    }
    
    // Check all reels in database
    const allReels = await Reel.find().populate('user', 'username');
    console.log('\nTotal reels in database:', allReels.length);
    
    if (allReels.length > 0) {
      console.log('All reels:');
      allReels.forEach((reel, index) => {
        console.log(`${index + 1}. User: ${reel.user?.username || 'Unknown'}`);
        console.log(`   Video URL: ${reel.videoUrl}`);
        console.log(`   Caption: ${reel.caption}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testReels();