const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function resetUserPasswords() {
  try {
    const newPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Reset password for jyoti_18
    const jyotiUser = await User.findOne({ username: 'jyoti_18' });
    if (jyotiUser) {
      jyotiUser.password = hashedPassword;
      await jyotiUser.save();
      console.log(`✅ Password reset for jyoti_18 to: ${newPassword}`);
    } else {
      console.log('❌ jyoti_18 user not found');
    }

    // Reset password for aruu_04
    const aruuUser = await User.findOne({ username: 'aruu_04' });
    if (aruuUser) {
      aruuUser.password = hashedPassword;
      await aruuUser.save();
      console.log(`✅ Password reset for aruu_04 to: ${newPassword}`);
    } else {
      console.log('❌ aruu_04 user not found');
    }

    console.log('Password reset process completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting passwords:', error);
    process.exit(1);
  }
}

resetUserPasswords();