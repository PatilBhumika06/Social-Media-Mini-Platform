const axios = require('axios');

async function testReels() {
  try {
    console.log('Testing reels functionality...\n');
    
    // Login
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'bhumika_27',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('✓ Logged in successfully\n');
    
    // Get all reels
    console.log('Getting all reels...');
    const allReelsRes = await axios.get('http://localhost:3000/api/reels', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✓ Retrieved ${allReelsRes.data.length} total reels`);
    
    // Get reels from followed users
    console.log('\nGetting reels from followed users...');
    const followingReelsRes = await axios.get('http://localhost:3000/api/reels/following', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✓ Retrieved ${followingReelsRes.data.length} reels from followed users`);
    
    // Check if we should create a reel for the user
    if (allReelsRes.data.length === 0) {
      console.log('\nCreating a test reel for the user...');
      const createRes = await axios.post('http://localhost:3000/api/reels', {
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        caption: 'My first reel!'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✓ Created test reel:', createRes.data.caption);
    }
    
    // Get reels again to see the new one
    console.log('\nGetting reels again...');
    const updatedReelsRes = await axios.get('http://localhost:3000/api/reels', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✓ Now retrieved ${updatedReelsRes.data.length} total reels`);
    
    if (updatedReelsRes.data.length > 0) {
      console.log('\nReel details:');
      updatedReelsRes.data.forEach((reel, index) => {
        console.log(`${index + 1}. "${reel.caption}" by ${reel.user.username}`);
        console.log(`   Likes: ${reel.likes.length}, Shares: ${reel.shares}`);
      });
    }
    
    console.log('\n✅ Reels functionality working correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testReels();