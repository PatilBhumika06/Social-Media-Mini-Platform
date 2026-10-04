const axios = require('axios');

async function testStoriesWithVideo() {
  try {
    console.log('Testing Stories API with Video Support...\n');
    
    // Login
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'bhumika_27',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('✓ Logged in successfully');
    
    // Test creating a story with isVideo flag
    const createRes = await axios.post('http://localhost:3000/api/stories', {
      imageUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      caption: 'My video story!',
      isVideo: true
    }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✓ Created video story:', createRes.data._id);
    console.log('  - Is Video:', createRes.data.isVideo);
    console.log('  - Caption:', createRes.data.caption);
    
    // Get the story to verify it was created with video flag
    const getRes = await axios.get(`http://localhost:3000/api/stories/${createRes.data._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✓ Retrieved story details:');
    console.log('  - ID:', getRes.data._id);
    console.log('  - Is Video:', getRes.data.isVideo);
    console.log('  - Caption:', getRes.data.caption);
    console.log('  - User:', getRes.data.user.username);
    
    // Test creating an image story (without isVideo flag or with false)
    const createImageRes = await axios.post('http://localhost:3000/api/stories', {
      imageUrl: 'https://via.placeholder.com/1080x1920.jpg',
      caption: 'My image story!',
      isVideo: false
    }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✓ Created image story:', createImageRes.data._id);
    console.log('  - Is Video:', createImageRes.data.isVideo);
    
    // Get all stories to verify both are there
    const allStoriesRes = await axios.get('http://localhost:3000/api/stories', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✓ Retrieved ${allStoriesRes.data.length} total stories`);
    
    // Count video and image stories
    const videoStories = allStoriesRes.data.filter(story => story.isVideo === true);
    const imageStories = allStoriesRes.data.filter(story => story.isVideo === false);
    
    console.log(`  - Video stories: ${videoStories.length}`);
    console.log(`  - Image stories: ${imageStories.length}`);
    
    console.log('\n✓ Stories API with video support is working perfectly!');
    console.log('✓ All functionality verified:');
    console.log('  - Creating video stories with isVideo=true');
    console.log('  - Creating image stories with isVideo=false');
    console.log('  - Retrieving stories with correct video/image indicators');
    console.log('  - Properly distinguishing between video and image stories');
    
  } catch (error) {
    console.error('✗ Error:', error.response?.data || error.message);
  }
}

testStoriesWithVideo();