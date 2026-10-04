const mongoose = require('mongoose');
const Post = require('./models/Post');
const connectDB = require('./config/db');

async function fixPostUrls() {
  try {
    await connectDB();
    console.log('Connected to database');
    
    // Find all posts with double slashes in imageUrl
    const posts = await Post.find({ 
      imageUrl: { $regex: '//post-' } 
    });
    
    console.log(`Found ${posts.length} posts with double slash URLs`);
    
    for (const post of posts) {
      console.log(`Fixing post ${post._id}: ${post.imageUrl}`);
      const fixedUrl = post.imageUrl.replace('//post-', '/post-');
      post.imageUrl = fixedUrl;
      await post.save();
      console.log(`Fixed to: ${fixedUrl}`);
    }
    
    console.log('All post URLs fixed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixPostUrls();