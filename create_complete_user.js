const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./backend/models/User');
const Post = require('./backend/models/Post');
const Story = require('./backend/models/Story');
const Reel = require('./backend/models/Reel');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createCompleteUser(username, email, password, fullName, bio = '') {
  try {
    console.log(`\n=== Creating Complete User Account ===`);
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Full Name: ${fullName}`);
    console.log(`Bio: ${bio || 'No bio provided'}`);
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      console.log(`❌ User already exists with this email or username!`);
      console.log(`Existing user ID: ${existingUser._id}`);
      console.log(`You can login with:`);
      console.log(`  Email: ${existingUser.email}`);
      console.log(`  Username: ${existingUser.username}`);
      console.log(`  Password: ${password}`);
      return existingUser;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user with all default fields
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      bio: bio || `${fullName} is now on Social Media!`,
      profilePic: '', // Will be set when user uploads
      followers: [],   // Empty initially
      following: [],   // Empty initially
      stories: [],     // Empty initially
      posts: []        // Empty initially
    });
    
    await newUser.save();
    console.log(`✅ Successfully created user: ${username}`);
    
    // Display user information
    console.log(`\n=== User Account Details ===`);
    console.log(`User ID: ${newUser._id}`);
    console.log(`Username: ${newUser.username}`);
    console.log(`Email: ${newUser.email}`);
    console.log(`Full Name: ${newUser.fullName}`);
    console.log(`Bio: ${newUser.bio}`);
    console.log(`Profile Picture: ${newUser.profilePic || 'Not set'}`);
    console.log(`Followers: ${newUser.followers.length}`);
    console.log(`Following: ${newUser.following.length}`);
    console.log(`Stories: ${newUser.stories.length}`);
    console.log(`Posts: ${newUser.posts.length}`);
    console.log(`Account Created: ${newUser.createdAt}`);
    
    // Display available features
    console.log(`\n=== Available Features ===`);
    console.log(`✅ User Authentication (Login/Logout)`);
    console.log(`✅ Profile Management (Edit bio, name, profile picture)`);
    console.log(`✅ Password Change`);
    console.log(`✅ Follow/Unfollow Users`);
    console.log(`✅ View Followers/Following`);
    console.log(`✅ User Search`);
    console.log(`✅ Create Posts (Images/Videos)`);
    console.log(`✅ Create Stories (Images/Videos)`);
    console.log(`✅ Create Reels (Videos)`);
    console.log(`✅ Like Posts and Reels`);
    console.log(`✅ Comment on Posts and Reels`);
    console.log(`✅ Share Posts and Reels`);
    console.log(`✅ Real-time Messaging (Text/Media)`);
    console.log(`✅ Activity Feed`);
    console.log(`✅ Personalized Content Feed`);
    
    // Display login credentials
    console.log(`\n=== Login Credentials ===`);
    console.log(`Email: ${email}`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`\nUse these credentials to login to the app!`);
    
    return newUser;
  } catch (error) {
    console.error('❌ Error creating user:', error);
    process.exit(1);
  }
}

// Function to create multiple sample users
async function createSampleUsers() {
  console.log('Creating sample users for testing...\n');
  
  const sampleUsers = [
    {
      username: 'bhumika_27',
      email: 'bhumika27@example.com',
      password: 'password123',
      fullName: 'Bhumika Patel',
      bio: 'Social media enthusiast and developer'
    },
    {
      username: 'alex_dev',
      email: 'alex@example.com',
      password: 'password123',
      fullName: 'Alex Johnson',
      bio: 'Tech lover and content creator'
    },
    {
      username: 'sarah_photo',
      email: 'sarah@example.com',
      password: 'password123',
      fullName: 'Sarah Williams',
      bio: 'Photography enthusiast'
    },
    {
      username: 'mike_travel',
      email: 'mike@example.com',
      password: 'password123',
      fullName: 'Mike Thompson',
      bio: 'Travel blogger and adventurer'
    },
    {
      username: 'emma_cook',
      email: 'emma@example.com',
      password: 'password123',
      fullName: 'Emma Davis',
      bio: 'Food lover and home chef'
    }
  ];
  
  for (const userData of sampleUsers) {
    await createCompleteUser(
      userData.username,
      userData.email,
      userData.password,
      userData.fullName,
      userData.bio
    );
    console.log('---');
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  // No arguments - show help
  console.log('Social Media App - User Creation Tool');
  console.log('=====================================');
  console.log('\nUsage:');
  console.log('  node create_complete_user.js <username> <email> <password> <full_name> [bio]');
  console.log('  node create_complete_user.js --sample (creates sample users)');
  console.log('\nExamples:');
  console.log('  node create_complete_user.js john_doe john@example.com password123 "John Doe" "Hello world!"');
  console.log('  node create_complete_user.js --sample');
  console.log('\nAll users get access to ALL features including:');
  console.log('- Posts, Stories, Reels creation');
  console.log('- Following/Followers system');
  console.log('- Messaging system');
  console.log('- Profile customization');
  console.log('- Content interaction (likes, comments)');
  process.exit(0);
}

if (args[0] === '--sample') {
  // Create sample users
  createSampleUsers().then(() => {
    console.log('\n✅ All sample users created successfully!');
    process.exit(0);
  });
} else if (args.length >= 4) {
  // Create single user with provided details
  const username = args[0];
  const email = args[1];
  const password = args[2];
  const fullName = args[3];
  const bio = args[4] || '';
  
  createCompleteUser(username, email, password, fullName, bio).then((user) => {
    console.log('\n✅ User creation completed!');
    process.exit(0);
  });
} else {
  console.log('❌ Invalid arguments. Use --help for usage information.');
  process.exit(1);
}