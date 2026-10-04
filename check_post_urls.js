const mongoose = require('mongoose');
const Post = require('./models/Post');
const connectDB = require('./config/db');

async function checkPostUrls() {
  try {
    await connectDB();
    console.log('Connected to database');
    
    // Find all posts
    const posts = await Post.find({});
    
    console.log(`Found ${posts.length} total posts`);
    
    for (const post of posts) {
      console.log(`Post ${post._id}:`);
      console.log(`  Image URL: ${post.imageUrl}`);
      console.log(`  Full URL would be: http://localhost:3000${post.imageUrl}`);
      
      // Check if file exists
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.join(__dirname, 'uploads', post.imageUrl.replace('/uploads/', ''));
      console.log(`  File path: ${fullPath}`);
      console.log(`  File exists: ${fs.existsSync(fullPath)}`);
      console.log('---');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPostUrls();