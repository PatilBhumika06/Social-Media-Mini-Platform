const axios = require('axios');

async function testStoriesAPI() {
  try {
    console.log('Testing Stories API functionality...\n');
    
    // Step 1: Login to get token
    console.log('1. Logging in to get token...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'bhumika_27',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, got token');
    
    // Step 2: Create a test story
    console.log('\n2. Creating a test story...');
    const createStoryResponse = await axios.post('http://localhost:3000/api/stories', {
      imageUrl: 'https://example.com/test-story-image.jpg',
      caption: 'This is a test story!'
    }, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    
    const storyId = createStoryResponse.data._id;
    console.log('✅ Story created successfully with ID: ' + storyId);
    
    // Step 3: Get all stories
    console.log('\n3. Getting all stories...');
    const getAllStoriesResponse = await axios.get('http://localhost:3000/api/stories', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Retrieved ' + getAllStoriesResponse.data.length + ' stories');
    
    // Step 4: Get user's stories specifically
    console.log('\n4. Getting user-specific stories...');
    const getUserStoriesResponse = await axios.get('http://localhost:3000/api/stories/user/' + loginResponse.data.user.id, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Retrieved ' + getUserStoriesResponse.data.length + ' stories for user');
    
    // Step 5: Get the specific story
    console.log('\n5. Getting specific story...');
    const getSpecificStoryResponse = await axios.get('http://localhost:3000/api/stories/' + storyId, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Retrieved specific story with caption: ' + getSpecificStoryResponse.data.caption);
    
    // Step 6: Clean up - delete the test story
    console.log('\n6. Cleaning up - deleting test story...');
    const deleteStoryResponse = await axios.delete('http://localhost:3000/api/stories/' + storyId, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Story deleted successfully');
    
    console.log('\n🎉 Stories API functionality test completed successfully!');
    console.log('✅ All endpoints are working correctly:');
    console.log('   - POST /api/stories (create)');
    console.log('   - GET /api/stories (retrieve all)');
    console.log('   - GET /api/stories/user/:userId (retrieve user-specific)');
    console.log('   - GET /api/stories/:id (retrieve specific)');
    console.log('   - DELETE /api/stories/:id (delete)');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testStoriesAPI();