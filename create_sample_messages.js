const mongoose = require('mongoose');
require('dotenv').config();

// Import User and Message models
const User = require('./models/User');
const Message = require('./models/Message');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createSampleMessages() {
  try {
    // Sample messages data
    const sampleMessages = [
      {
        sender: 'alice@example.com',
        receiver: 'john@example.com',
        content: 'Hi John! Great to connect with you!'
      },
      {
        sender: 'john@example.com',
        receiver: 'alice@example.com',
        content: 'Hello Alice! Nice to meet you too.'
      },
      {
        sender: 'bob@example.com',
        receiver: 'jane@example.com',
        content: 'Hey Jane, saw your post today - very inspiring!'
      },
      {
        sender: 'jane@example.com',
        receiver: 'bob@example.com',
        content: 'Thanks Bob! Appreciate the support.'
      },
      {
        sender: 'charlie@example.com',
        receiver: 'alice@example.com',
        content: 'Alice, your stories are amazing!'
      },
      {
        sender: 'diana@example.com',
        receiver: 'ethan@example.com',
        content: 'Ready for our collaboration project?'
      },
      {
        sender: 'ethan@example.com',
        receiver: 'diana@example.com',
        content: 'Absolutely! Let\'s make it happen.'
      },
      {
        sender: 'jane@example.com',
        receiver: 'john@example.com',
        content: 'John, your latest post was awesome!'
      },
    ];

    for (const messageData of sampleMessages) {
      // Find sender and receiver
      const sender = await User.findOne({ email: messageData.sender });
      const receiver = await User.findOne({ email: messageData.receiver });

      if (sender && receiver) {
        // Create new message
        const newMessage = new Message({
          sender: sender._id,
          receiver: receiver._id,
          content: messageData.content
        });

        await newMessage.save();
        console.log(`Message sent from ${messageData.sender} to ${messageData.receiver}: "${messageData.content}"`);
      } else {
        console.log(`User not found - Sender: ${messageData.sender}, Receiver: ${messageData.receiver}`);
      }
    }

    console.log('All sample messages processed!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample messages:', error);
    process.exit(1);
  }
}

// Run the function
createSampleMessages();