const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();
const jwt = require('jsonwebtoken');

async function testReelsWithAuth() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Find user bhumika_27
    const user = await User.findOne({ username: 'bhumika_27' });
    if (!user) {
      console.log('User bhumika_27 not found');
      return;
    }
    
    console.log('Found user:', user.username);
    console.log('User ID:', user._id);
    
    // Generate a test token
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('Generated token:', token);
    
    // Test the reels endpoint manually
    const express = require('express');
    const app = express();
    const reelsRouter = require('./routes/reels');
    const auth = require('./middleware/auth');
    
    app.use('/api/reels', auth, reelsRouter);
    
    // This is just to show the token is valid
    console.log('Token would be valid for user:', user._id);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

testReelsWithAuth();