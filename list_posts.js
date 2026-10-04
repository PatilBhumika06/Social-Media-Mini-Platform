require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia')
  .then(async () => {
    const posts = await Post.find().populate('user', 'username');
    console.log('Posts found:', posts.length);
    posts.forEach((p, i) => {
      console.log(`${i+1}. ID: ${p._id}, User: ${p.user?.username || 'Unknown'}, Comments: ${p.comments?.length || 0}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });