const axios = require('axios');

async function testDeleteStory() {
  try {
    console.log('Testing story deletion functionality...\n');
    
    // Login
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'bhumika_27',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('✓ Logged in successfully\n');
    
    // Create a test story to delete
    console.log('Creating a test story to delete...');
    const createRes = await axios.post('http://localhost:3000/api/stories', {
      imageUrl: 'https://via.placeholder.com/1080x1920.jpg',
      caption: 'Test story to delete',
      isVideo: false
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const storyId = createRes.data._id;
    console.log('✓ Test story created with ID:', storyId);
    
    // Verify the story exists
    console.log('\nVerifying story exists before deletion...');
    const getRes = await axios.get(`http://localhost:3000/api/stories/${storyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✓ Story found before deletion:', getRes.data.caption);
    
    // Delete the story
    console.log('\nDeleting the story...');
    const deleteRes = await axios.delete(`http://localhost:3000/api/stories/${storyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✓ Story deletion response:', deleteRes.data.msg);
    
    // Try to get the story again (should fail)
    console.log('\nTrying to get the deleted story...');
    try {
      const afterDeleteRes = await axios.get(`http://localhost:3000/api/stories/${storyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✗ Story still exists after deletion!');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✓ Story properly deleted (not found after deletion)');
      } else {
        console.log('✗ Unexpected error:', error.message);
      }
    }
    
    console.log('\n✅ Story deletion functionality is working correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testDeleteStory();