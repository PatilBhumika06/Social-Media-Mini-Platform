const axios = require('axios');

async function testStoryCreation() {
  try {
    console.log('Testing story creation...\n');
    
    // Login
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'bhumika_27',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('✓ Logged in successfully\n');
    
    // Try to create a story with an image
    console.log('Creating an image story...');
    const imageStoryRes = await axios.post('http://localhost:3000/api/stories', {
      imageUrl: 'https://via.placeholder.com/1080x1920.jpg',
      caption: 'This is an image story',
      isVideo: false
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✓ Image story created successfully!');
    console.log('  ID:', imageStoryRes.data._id);
    console.log('  Is Video:', imageStoryRes.data.isVideo);
    console.log('  Caption:', imageStoryRes.data.caption);
    console.log('');
    
    // Try to create a story with a video
    console.log('Creating a video story...');
    const videoStoryRes = await axios.post('http://localhost:3000/api/stories', {
      imageUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      caption: 'This is a video story',
      isVideo: true
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✓ Video story created successfully!');
    console.log('  ID:', videoStoryRes.data._id);
    console.log('  Is Video:', videoStoryRes.data.isVideo);
    console.log('  Caption:', videoStoryRes.data.caption);
    console.log('');
    
    // Get all stories
    console.log('Getting all stories...');
    const allStoriesRes = await axios.get('http://localhost:3000/api/stories', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`✓ Retrieved ${allStoriesRes.data.length} stories`);
    console.log('');
    
    // Show details of the last two stories
    const recentStories = allStoriesRes.data.slice(0, 2);
    recentStories.forEach((story, index) => {
      console.log(`Recent Story ${index + 1}:`);
      console.log(`  ID: ${story._id}`);
      console.log(`  Is Video: ${story.isVideo}`);
      console.log(`  Caption: ${story.caption}`);
      console.log(`  User: ${story.user.username}`);
      console.log('');
    });
    
    console.log('✅ All story functionality is working correctly!');
    
  } catch (error) {
    console.error('❌ Error occurred:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testStoryCreation();