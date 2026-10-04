const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testAuth() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia');
    console.log('Connected to database');

    // Find a test user
    const user = await User.findOne({ username: 'john_doe' });
    if (!user) {
      console.log('No test user found');
      return;
    }

    console.log('Test user found:');
    console.log('- Username:', user.username);
    console.log('- Email:', user.email);
    console.log('- Password hashed:', user.password ? 'Yes' : 'No');
    console.log('- ID:', user._id);

    // Test password comparison
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare('password123', user.password);
    console.log('- Password match for "password123":', isMatch);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error testing auth:', error);
    mongoose.connection.close();
  }
}

testAuth();