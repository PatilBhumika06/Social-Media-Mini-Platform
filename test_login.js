const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia')
  .then(async () => {
    console.log('Connected to database');
    
    const User = require('./models/User');
    
    // Create a test user if not exists
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      testUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        fullName: 'Test User',
        bio: 'Test account'
      });
      
      await testUser.save();
      console.log('Created test user with credentials:');
      console.log('Email: test@example.com');
      console.log('Password: password123');
    } else {
      console.log('Test user already exists with credentials:');
      console.log('Email: test@example.com');
      console.log('Password: password123');
    }
    
    // Test login with the credentials
    const user = await User.findOne({ email: 'test@example.com' });
    if (user) {
      const isValid = await bcrypt.compare('password123', user.password);
      console.log('\nLogin test results:');
      console.log('User found:', !!user);
      console.log('Password matches:', isValid);
      
      if (isValid) {
        console.log('\n✅ LOGIN SHOULD WORK WITH THESE CREDENTIALS:');
        console.log('Email: test@example.com');
        console.log('Password: password123');
      } else {
        console.log('\n❌ PASSWORD DOES NOT MATCH');
      }
    } else {
      console.log('❌ USER NOT FOUND');
    }
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
  });