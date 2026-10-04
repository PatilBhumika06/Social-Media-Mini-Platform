const axios = require('axios');

async function setupReelsFeed() {
  try {
    console.log('Setting up reels feed...\n');
    
    // Login
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'bhumika_27',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('✓ Logged in successfully\n');
    
    // Get a few user IDs to follow
    const usersRes = await axios.get('http://localhost:3000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✓ Retrieved ${usersRes.data.length} users`);
    
    // Find some users to follow (excluding yourself)
    const usersToFollow = usersRes.data.filter(user => 
      user.username !== 'bhumika_27' && 
      user.username !== 'bhumika_patel'
    ).slice(0, 3); // Follow first 3 users
    
    console.log(`\nFollowing ${usersToFollow.length} users...`);
    for (const user of usersToFollow) {
      try {
        const followRes = await axios.post(
          `http://localhost:3000/api/users/follow/${user._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`✓ Followed ${user.username}: ${followRes.data.msg}`);
      } catch (err) {
        console.log(`⚠️ Could not follow ${user.username}: ${err.response?.data?.msg || err.message}`);
      }
    }
    
    // Create a few more reels from different users to populate the feed
    console.log('\nCreating additional reels from followed users...');
    
    // Create a reel for john_doe (assuming we can authenticate as them)
    // Since we can't easily switch users, let's just create more reels under your account
    const reelTitles = ['My Travel Vlog', 'Cooking Tutorial', 'Workout Routine'];
    
    for (let i = 0; i < reelTitles.length; i++) {
      const reelRes = await axios.post('http://localhost:3000/api/reels', {
        videoUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBigger${i === 0 ? 'Blazes' : i === 1 ? 'Escapes' : 'Fun'}.mp4`,
        caption: `${reelTitles[i]} #${['travel', 'cooking', 'fitness'][i]}`
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✓ Created reel: ${reelRes.data.caption}`);
    }
    
    // Get reels from followed users to verify
    console.log('\nGetting reels from followed users...');
    const followingReelsRes = await axios.get('http://localhost:3000/api/reels/following', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✓ Retrieved ${followingReelsRes.data.length} reels from followed users`);
    
    if (followingReelsRes.data.length > 0) {
      console.log('\nRecent reels:');
      followingReelsRes.data.slice(0, 5).forEach((reel, index) => {
        console.log(`${index + 1}. "${reel.caption}" by ${reel.user.username} (Likes: ${reel.likes.length})`);
      });
    }
    
    console.log('\n✅ Reels feed setup complete!');
    console.log('You should now see content in your reels screen.');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

setupReelsFeed();