const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Post = require('./models/Post');
const Activity = require('./models/Activity');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createTestActivity() {
  try {
    console.log('=== Creating Test Activity ===\n');
    
    // Find User KIK
    const userKIK = await User.findOne({ email: 'test2@example.com' });
    if (!userKIK) {
      console.log('❌ User KIK not found');
      process.exit(1);
    }
    
    console.log(`✅ Found User KIK: ${userKIK.username} (${userKIK._id})`);
    
    // Find User ABC
    const userABC = await User.findOne({ email: 'test@example.com' });
    if (!userABC) {
      console.log('❌ User ABC not found');
      process.exit(1);
    }
    
    console.log(`✅ Found User ABC: ${userABC.username} (${userABC._id})`);
    
    // Find a post by User KIK
    const post = await Post.findOne({ user: userKIK._id });
    if (!post) {
      console.log('❌ No post found for User KIK');
      process.exit(1);
    }
    
    console.log(`✅ Found post: ${post._id}`);
    
    // Create a test like activity
    const activity = new Activity({
      recipientId: userKIK._id,
      actorId: userABC._id,
      type: 'like',
      contentId: post._id,
      contentType: 'Post',
      timestamp: new Date()
    });
    
    await activity.save();
    console.log('✅ Created test activity');
    
    // Try to populate the activity
    const populatedActivity = await Activity.findById(activity._id)
      .populate('actorId', 'username fullName profilePic')
      .populate('contentId');
    
    console.log('✅ Successfully populated activity:');
    console.log(`   Actor: ${populatedActivity.actorId.username}`);
    console.log(`   Content: ${populatedActivity.contentId.caption?.substring(0, 30) || 'No caption'}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error creating test activity:', error);
    process.exit(1);
  }
}

// Run the test
createTestActivity();