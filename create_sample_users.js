const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// Import User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample users data
const sampleUsers = [
  {
    username: 'alice_wonder',
    email: 'alice@example.com',
    password: 'password123',
    fullName: 'Alice Wonder',
    bio: 'Adventure seeker and dreamer',
    followers: [],
    following: [],
  },
  {
    username: 'bob_builder',
    email: 'bob@example.com',
    password: 'password123',
    fullName: 'Bob Builder',
    bio: 'Building dreams one project at a time',
    followers: [],
    following: [],
  },
  {
    username: 'charlie_brown',
    email: 'charlie@example.com',
    password: 'password123',
    fullName: 'Charlie Brown',
    bio: 'Life is like a box of chocolates',
    followers: [],
    following: [],
  },
  {
    username: 'diana_prince',
    email: 'diana@example.com',
    password: 'password123',
    fullName: 'Diana Prince',
    bio: 'Wonder Woman at heart',
    followers: [],
    following: [],
  },
  {
    username: 'ethan_hunt',
    email: 'ethan@example.com',
    password: 'password123',
    fullName: 'Ethan Hunt',
    bio: 'Mission impossible, but I make it possible',
    followers: [],
    following: [],
  },
  {
    username: 'fiona_shrek',
    email: 'fiona@example.com',
    password: 'password123',
    fullName: 'Fiona Shrek',
    bio: 'Ogres are like onions - layered',
    followers: [],
    following: [],
  },
  {
    username: 'george_lucas',
    email: 'george@example.com',
    password: 'password123',
    fullName: 'George Lucas',
    bio: 'Creator of worlds',
    followers: [],
    following: [],
  },
  {
    username: 'hannah_montana',
    email: 'hannah@example.com',
    password: 'password123',
    fullName: 'Hannah Montana',
    bio: 'Living a double life',
    followers: [],
    following: [],
  },
];

async function createSampleUsers() {
  try {
    // Clear existing sample users (optional - remove if you don't want to clear)
    // await User.deleteMany({ email: { $regex: /.*@example\.com$/ } });
    
    // Create new users
    for (const userData of sampleUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        const newUser = new User({
          ...userData,
          password: hashedPassword
        });
        await newUser.save();
        console.log(`Created user: ${userData.username}`);
      } else {
        console.log(`User already exists: ${userData.username}`);
      }
    }
    
    console.log('All sample users processed!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
}

// Run the function
createSampleUsers();
