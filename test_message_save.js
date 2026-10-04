const mongoose = require('mongoose');
require('dotenv').config();

// Import models to ensure they're registered
require('./models/User');
require('./models/Reel');
const Message = require('./models/Message');

async function testMessageCreation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Test creating a reel_share message directly
    const testMessage = new Message({
      sender: '69746a71b33e863660a5017a', // bhumika_27
      receiver: '696b96e0db4a916e585784af', // jane_smith
      content: 'Test reel share message',
      reel: '69864246f6f411d21d86eb53',
      reelShare: '698a333a9b7385a43e70ee6a',
      messageType: 'reel_share',
      read: false,
      delivered: true
    });
    
    console.log('Attempting to save test message...');
    const savedMessage = await testMessage.save();
    console.log('Message saved successfully:', savedMessage._id);
    
    // Verify it was saved
    const foundMessage = await Message.findById(savedMessage._id)
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .populate('reel', 'caption');
    
    console.log('Found message:', {
      id: foundMessage._id,
      sender: foundMessage.sender?.username,
      receiver: foundMessage.receiver?.username,
      content: foundMessage.content,
      messageType: foundMessage.messageType,
      hasReel: !!foundMessage.reel,
      reelCaption: foundMessage.reel?.caption
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testMessageCreation();