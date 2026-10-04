const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createFollowConnections() {
  try {
    // Define follow relationships
    const followRelationships = [
      // John follows some users
      { follower: 'john@example.com', followee: 'alice@example.com' },
      { follower: 'john@example.com', followee: 'bob@example.com' },
      { follower: 'john@example.com', followee: 'charlie@example.com' },
      
      // Jane follows some users
      { follower: 'jane@example.com', followee: 'diana@example.com' },
      { follower: 'jane@example.com', followee: 'ethan@example.com' },
      { follower: 'jane@example.com', followee: 'alice@example.com' },
      
      // Alice follows some users
      { follower: 'alice@example.com', followee: 'johndoe@example.com' },
      { follower: 'alice@example.com', followee: 'jane@example.com' },
      { follower: 'alice@example.com', followee: 'bob@example.com' },
      
      // Bob follows some users
      { follower: 'bob@example.com', followee: 'charlie@example.com' },
      { follower: 'bob@example.com', followee: 'diana@example.com' },
      { follower: 'bob@example.com', followee: 'johndoe@example.com' },
      
      // Charlie follows some users
      { follower: 'charlie@example.com', followee: 'jane@example.com' },
      { follower: 'charlie@example.com', followee: 'alice@example.com' },
      { follower: 'charlie@example.com', followee: 'ethan@example.com' },
    ];

    for (const relationship of followRelationships) {
      // Find the follower and followee
      const follower = await User.findOne({ email: relationship.follower });
      const followee = await User.findOne({ email: relationship.followee });

      if (follower && followee) {
        // Check if the follow relationship already exists
        const alreadyFollowing = followee.followers.includes(follower._id);
        if (!alreadyFollowing) {
          // Update follower's following list
          await User.findByIdAndUpdate(follower._id, {
            $addToSet: { following: followee._id }
          });

          // Update followee's followers list
          await User.findByIdAndUpdate(followee._id, {
            $addToSet: { followers: follower._id }
          });

          console.log(`${relationship.follower} is now following ${relationship.followee}`);
        } else {
          console.log(`${relationship.follower} is already following ${relationship.followee}`);
        }
      } else {
        console.log(`User not found - Follower: ${relationship.follower}, Followee: ${relationship.followee}`);
      }
    }

    console.log('All follow relationships processed!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating follow connections:', error);
    process.exit(1);
  }
}

// Run the function
createFollowConnections();