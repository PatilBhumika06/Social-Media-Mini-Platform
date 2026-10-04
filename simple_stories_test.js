const axios = require('axios');

async function simpleTest() {
  try {
    console.log('Testing Stories API...\n');
    
    // Login
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'bhumika_27',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('✓ Logged in successfully');
    
    // Test getting stories (should return empty initially)
    const storiesRes = await axios.get('http://localhost:3000/api/stories', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✓ Retrieved ${storiesRes.data.length} stories`);
    
    // Test creating a story
    const createRes = await axios.post('http://localhost:3000/api/stories', {
      imageUrl: 'https://example.com/story.jpg',
      caption: 'My first story!'
    }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✓ Created story:', createRes.data._id);
    
    // Test getting stories again (should have 1 now)
    const storiesRes2 = await axios.get('http://localhost:3000/api/stories', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✓ Retrieved ${storiesRes2.data.length} stories after creation`);
    
    console.log('\n✓ All stories functionality working correctly!');
    
  } catch (error) {
    console.error('✗ Error:', error.response?.data || error.message);
  }
}

simpleTest();