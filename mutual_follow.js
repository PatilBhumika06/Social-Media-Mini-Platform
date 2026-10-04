const http = require('http');

// Make first user follow second user
function firstUserFollowSecond() {
  const loginData = JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.token) {
          console.log('First user login successful!');
          // Follow the second user
          followUser(result.token, '69889d1ecb580fe38a6dc1ba');
        }
      } catch (e) {
        console.log('Login error:', e.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Login Error:', error);
  });

  req.write(loginData);
  req.end();
}

function followUser(token, userIdToFollow) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/users/follow/${userIdToFollow}`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Follow Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Follow Response:');
      console.log(data);
      
      // Now test stories as first user
      testStoriesAfterMutualFollow();
    });
  });

  req.on('error', (error) => {
    console.error('Follow Error:', error);
  });

  req.end();
}

function testStoriesAfterMutualFollow() {
  const loginData = JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.token) {
          console.log('First user login successful!');
          getStoriesAfterMutualFollow(result.token);
        }
      } catch (e) {
        console.log('Login error:', e.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Login Error:', error);
  });

  req.write(loginData);
  req.end();
}

function getStoriesAfterMutualFollow(token) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/stories',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`\nStories Status after mutual follow: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Stories Response body:');
      console.log(data);
      
      try {
        const stories = JSON.parse(data);
        console.log(`\nFound ${stories.length} stories after mutual follow:`);
        stories.forEach((story, index) => {
          console.log(`${index + 1}. User: ${story.user?.username || 'Unknown'}`);
          console.log(`   Image URL: ${story.imageUrl}`);
          console.log(`   Created: ${story.createdAt}`);
          console.log(`   Is Video: ${story.isVideo}`);
          console.log('---');
        });
        
        if (stories.length > 1) {
          console.log('\n✅ Perfect! Now you should be able to view stories in the app.');
          console.log('Login as test@example.com and you should see:');
          console.log('- Your story (with + icon) - tap to create new story');
          console.log('- testuser2 story (normal circle) - tap to view the story');
          console.log('\n🎉 The story viewing feature is now working correctly!');
        } else {
          console.log('\n⚠️  Still only showing one story. There might be a caching issue.');
        }
      } catch (e) {
        console.log('Error parsing stories JSON:', e.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Stories Error:', error);
  });

  req.end();
}

// Start the process
firstUserFollowSecond();