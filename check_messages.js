const mongoose = require('mongoose');
require('dotenv').config();

// Import models to ensure they're registered
require('./models/User');
require('./models/Reel');
const Message = require('./models/Message');

async function checkMessages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const messages = await Message.find()
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .populate('reel', 'caption')
      .sort({ createdAt: -1 })
      .limit(10);
    
    console.log(`Found ${messages.length} recent messages:`);
    messages.forEach((msg, index) => {
      console.log(`${index + 1}. From: ${msg.sender?.username || 'Unknown'}`);
      console.log(`   To: ${msg.receiver?.username || 'Unknown'}`);
      console.log(`   Content: ${msg.content}`);
      console.log(`   Type: ${msg.messageType}`);
      console.log(`   Has reel: ${!!msg.reel}`);
      if (msg.reel) {
        console.log(`   Reel caption: ${msg.reel.caption || 'No caption'}`);
      }
      console.log(`   Created: ${msg.createdAt}`);
      console.log('---');
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkMessages();