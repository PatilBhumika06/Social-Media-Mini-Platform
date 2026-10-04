const mongoose = require('mongoose');
require('dotenv').config();

// Import models to ensure they're registered
require('./models/User');
require('./models/Reel');
const ReelShare = require('./models/ReelShare');

async function checkReelShares() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const shares = await ReelShare.find()
      .populate('reel', 'caption')
      .populate('fromUser', 'username')
      .populate('toUser', 'username');
    
    console.log(`Found ${shares.length} reel shares:`);
    shares.forEach((share, index) => {
      console.log(`${index + 1}. Reel: ${share.reel?.caption || 'No caption'}`);
      console.log(`   From: ${share.fromUser?.username || 'Unknown'}`);
      console.log(`   To: ${share.toUser?.username || 'Unknown'}`);
      console.log(`   Message: ${share.message}`);
      console.log(`   Created: ${share.createdAt}`);
      console.log('---');
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkReelShares();