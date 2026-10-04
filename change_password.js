const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function changeUserPassword(username, newPassword) {
  try {
    // Find user by username
    const user = await User.findOne({ username: username });
    
    if (!user) {
      console.log(`❌ User '${username}' not found!`);
      process.exit(1);
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the user's password
    user.password = hashedPassword;
    await user.save();
    
    console.log(`✅ Password successfully changed for user: ${username}`);
    console.log(`User: ${user.fullName} (@${user.username})`);
    console.log(`New password has been set.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error changing password:', error);
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node change_password.js <username> <new_password>');
  console.log('Example: node change_password.js jyoti_18 newSecurePassword123');
  console.log('');
  console.log('Available users:');
  console.log('- bhumika_27 (Bhumika Patil)');
  console.log('- bhumika_patel (Bhumika Patel)');
  console.log('- jyoti_18 (Jyoti Sahani)');
  console.log('- aruu_04 (Arpita Koli)');
  console.log('- john_doe, jane_smith, etc. (other sample users)');
  process.exit(1);
}

const username = args[0];
const newPassword = args[1];

changeUserPassword(username, newPassword);