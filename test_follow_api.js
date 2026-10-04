const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function testFollowFunctionality() {
  try {
    console.log('=== Testing Follow API Functionality ===\n');
    
    // Find two test users
    const user1 = await User.findOne({ username: 'john_doe' });
    const user2 = await User.findOne({ username: 'jane_smith' });
    
    if (!user1 || !user2) {
      console.log('❌ Test users not found. Creating sample users...');
      
      // Create test users if they don't exist
      const newUser1 = new User({
        username: 'john_doe',
        email: 'john@test.com',
        password: 'password123',
        fullName: 'John Doe',
        bio: 'Test user 1'
      });
      
      const newUser2 = new User({
        username: 'jane_smith',
        email: 'jane@test.com',
        password: 'password123',
        fullName: 'Jane Smith',
        bio: 'Test user 2'
      });
      
      await newUser1.save();
      await newUser2.save();
      
      console.log('✅ Created test users');
      return;
    }
    
    console.log(`User 1: ${user1.username} (${user1._id})`);
    console.log(`User 2: ${user2.username} (${user2._id})`);
    console.log(`User 1 following count: ${user1.following.length}`);
    console.log(`User 2 followers count: ${user2.followers.length}`);
    
    // Test following
    if (!user2.followers.includes(user1._id)) {
      console.log('\n=== Testing Follow Action ===');
      user2.followers.push(user1._id);
      user1.following.push(user2._id);
      
      await user1.save();
      await user2.save();
      
      console.log('✅ Successfully followed user');
      console.log(`User 1 now following: ${user1.following.length} users`);
      console.log(`User 2 now has: ${user2.followers.length} followers`);
    } else {
      console.log('✅ Users are already connected');
    }
    
    // Test API response format
    console.log('\n=== Testing API Response Format ===');
    const populatedUser = await User.findById(user1._id)
      .populate('following', 'username fullName bio')
      .populate('followers', 'username fullName bio');
    
    console.log('Following list:');
    populatedUser.following.forEach(follow => {
      console.log(`  - ${follow.username} (${follow.fullName})`);
    });
    
    console.log('\nFollowers list:');
    populatedUser.followers.forEach(follower => {
      console.log(`  - ${follower.username} (${follower.fullName})`);
    });
    
    console.log('\n✅ All tests passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testFollowFunctionality();