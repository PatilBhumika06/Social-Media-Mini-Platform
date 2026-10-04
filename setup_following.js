const http = require('http');

// Login as second user and follow first user
function followFirstUser() {
  const loginData = JSON.stringify({
    email: 'test2@example.com',
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
          console.log('Second user login successful!');
          // Follow the first user
          followUser(result.token, '6970be57d0961641beae67f3');
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
      testStoriesAfterFollowing();
    });
  });

  req.on('error', (error) => {
    console.error('Follow Error:', error);
  });

  req.end();
}

function testStoriesAfterFollowing() {
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
          getStoriesAfterFollowing(result.token);
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

function getStoriesAfterFollowing(token) {
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
    console.log(`\nStories Status after following: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Stories Response body:');
      console.log(data);
      
      try {
        const stories = JSON.parse(data);
        console.log(`\nFound ${stories.length} stories after following:`);
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
        } else {
          console.log('\n⚠️  Still only showing one story. Let me check the follow relationship...');
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
followFirstUser();