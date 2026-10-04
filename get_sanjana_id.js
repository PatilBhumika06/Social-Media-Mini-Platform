const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

const User = require('./backend/models/User');

async function getUserId() {
  try {
    const user = await User.findOne({ username: 'sanjana' });
    if (user) {
      console.log('User ID for sanjana:', user._id);
    } else {
      console.log('User sanjana not found');
    }
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

getUserId();