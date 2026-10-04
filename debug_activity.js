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

async function debugActivityData() {
  try {
    console.log('=== Debugging Activity Data ===\n');
    
    // Check if we have activities
    const activities = await Activity.find({}).limit(10);
    console.log(`Found ${activities.length} activities in database`);
    
    if (activities.length > 0) {
      console.log('\nFirst few activities:');
      activities.forEach((activity, index) => {
        console.log(`${index + 1}. Type: ${activity.type}`);
        console.log(`   Recipient: ${activity.recipientId}`);
        console.log(`   Actor: ${activity.actorId}`);
        console.log(`   Content ID: ${activity.contentId}`);
        console.log(`   Content Type: ${activity.contentType}`);
        console.log(`   Timestamp: ${activity.timestamp}`);
        console.log('---');
      });
      
      // Try to populate one activity to see if there are issues
      console.log('\nTrying to populate first activity...');
      try {
        const populatedActivity = await Activity.findById(activities[0]._id)
          .populate('actorId', 'username fullName')
          .populate('contentId');
        console.log('Successfully populated activity:', populatedActivity);
      } catch (populateError) {
        console.log('Error populating activity:', populateError.message);
      }
    } else {
      console.log('No activities found in database');
    }
    
    // Check users
    const users = await User.find({}).limit(5);
    console.log(`\nFound ${users.length} users in database`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user._id})`);
      console.log(`   Posts: ${user.posts?.length || 0}`);
    });
    
    // Check posts
    const posts = await Post.find({}).limit(5);
    console.log(`\nFound ${posts.length} posts in database`);
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.caption?.substring(0, 50) || 'No caption'}`);
      console.log(`   ID: ${post._id}`);
      console.log(`   User: ${post.user}`);
      console.log(`   Likes: ${post.likes?.length || 0}`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error in debug:', error);
    process.exit(1);
  }
}

// Run the debug
debugActivityData();