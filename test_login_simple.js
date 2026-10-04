const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function testLogin(username, password) {
  try {
    // Find user by username
    const user = await User.findOne({ username: username });
    
    if (!user) {
      console.log(`User '${username}' not found!`);
      process.exit(1);
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      console.log('✅ Login successful!');
      console.log(`Welcome back, ${user.fullName} (@${user.username})`);
      console.log(`Email: ${user.email}`);
      console.log(`Bio: ${user.bio || 'No bio set'}`);
      console.log(`Followers: ${user.followers.length}`);
      console.log(`Following: ${user.following.length}`);
    } else {
      console.log('❌ Incorrect password!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error during login test:', error);
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node test_login.js <username> <password>');
  console.log('Example: node test_login.js bhumika_27 password123');
  console.log('\nAvailable users:');
  console.log('- bhumika_27 (password: your_password)');
  console.log('- bhumika_patel (password: your_password)');
  console.log('- john_doe (password: your_password)');
  console.log('- jane_smith (password: your_password)');
  process.exit(1);
}

const username = args[0];
const password = args[1];

testLogin(username, password);