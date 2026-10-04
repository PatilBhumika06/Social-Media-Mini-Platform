const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// Import User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createUser(username, email, password, fullName, bio) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username: username }, { email: email }] 
    });
    
    if (existingUser) {
      console.log(`User with username '${username}' or email '${email}' already exists!`);
      process.exit(1);
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword, // Password will be hashed
      fullName: fullName,
      bio: bio || 'New user on the platform!',
      followers: [],
      following: []
    });
    
    await newUser.save();
    console.log(`Successfully created user: ${username}`);
    console.log(`User details:`);
    console.log(`- Username: ${newUser.username}`);
    console.log(`- Email: ${newUser.email}`);
    console.log(`- Full Name: ${newUser.fullName}`);
    console.log(`- Bio: ${newUser.bio}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 4) {
  console.log('Usage: node create_user.js <username> <email> <password> <full_name> [bio]');
  console.log('Example: node create_user.js bhumika_27 bhumika27@example.com password123 "Bhumika Patel" "Social media enthusiast"');
  process.exit(1);
}

const username = args[0];
const email = args[1];
const password = args[2];
const fullName = args[3];
const bio = args[4] || 'New user on the platform!';

createUser(username, email, password, fullName, bio);