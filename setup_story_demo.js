const http = require('http');

// Function to create a test user
function createTestUser(email, username, password, fullName, callback) {
  const userData = JSON.stringify({
    username: username,
    email: email,
    password: password,
    fullName: fullName
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(userData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`\nCreating ${username}: Status ${res.statusCode}`);
      console.log(data);
      callback();
    });
  });

  req.on('error', (error) => {
    console.error(`Error creating ${username}:`, error);
    callback();
  });

  req.write(userData);
  req.end();
}

// Function to login and create a story
function createStoryForUser(email, password, storyCaption, callback) {
  // First login
  const loginData = JSON.stringify({
    email: email,
    password: password
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const loginReq = http.request(loginOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.token) {
          console.log(`\n${email} login successful!`);
          // Create story
          uploadAndCreateStory(result.token, storyCaption, callback);
        } else {
          console.log(`Login failed for ${email}`);
          callback();
        }
      } catch (e) {
        console.log(`Login error for ${email}:`, e.message);
        callback();
      }
    });
  });

  loginReq.on('error', (error) => {
    console.error(`Login error for ${email}:`, error);
    callback();
  });

  loginReq.write(loginData);
  loginReq.end();
}

// Function to upload file and create story
function uploadAndCreateStory(token, caption, callback) {
  // For demo purposes, we'll create a story with a placeholder
  // In a real app, you'd upload an actual image file
  
  const storyData = JSON.stringify({
    imageUrl: '/uploads/story-media/story-placeholder.jpg',
    caption: caption,
    isVideo: false
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/stories',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(storyData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Story creation Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Story creation Response:');
      console.log(data);
      callback();
    });
  });

  req.on('error', (error) => {
    console.error('Story creation Error:', error);
    callback();
  });

  req.write(storyData);
  req.end();
}

// Function to make users follow each other
function setupFollowingRelationships() {
  console.log('\n=== Setting up following relationships ===');
  
  // Make your main account follow the test accounts
  followUser('test@example.com', 'password123', 'testuser2@example.com', () => {
    followUser('test@example.com', 'password123', 'testuser3@example.com', () => {
      console.log('\n✅ Setup complete!');
      console.log('\nNow login with test@example.com and you should see:');
      console.log('- Your story (with + icon)');
      console.log('- testuser2 story (to view)');
      console.log('- testuser3 story (to view)');
    });
  });
}

function followUser(followerEmail, followerPassword, followeeEmail, callback) {
  // Get follower's token
  const loginData = JSON.stringify({
    email: followerEmail,
    password: followerPassword
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const loginReq = http.request(loginOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.token) {
          // Get followee user ID
          getUserByEmail(followeeEmail, (followeeId) => {
            if (followeeId) {
              // Perform follow
              const followOptions = {
                hostname: 'localhost',
                port: 3000,
                path: `/api/users/follow/${followeeId}`,
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${result.token}`,
                  'Content-Type': 'application/json'
                }
              };

              const followReq = http.request(followOptions, (res) => {
                console.log(`Follow ${followeeEmail} Status: ${res.statusCode}`);
                callback();
              });

              followReq.on('error', (error) => {
                console.error('Follow Error:', error);
                callback();
              });

              followReq.end();
            } else {
              callback();
            }
          });
        } else {
          callback();
        }
      } catch (e) {
        console.log('Error:', e.message);
        callback();
      }
    });
  });

  loginReq.on('error', (error) => {
    console.error('Login Error:', error);
    callback();
  });

  loginReq.write(loginData);
  loginReq.end();
}

function getUserByEmail(email, callback) {
  // This would normally require an API endpoint to get user by email
  // For demo purposes, we'll use known user IDs
  const userMap = {
    'testuser2@example.com': '69889d1ecb580fe38a6dc1ba',
    'testuser3@example.com': '69889d1ecb580fe38a6dc1bb' // This would need to be created
  };
  
  callback(userMap[email] || null);
}

// Main execution
console.log('=== Creating Test Accounts for Story Viewing Demo ===\n');

// Create test accounts
createTestUser('testuser2@example.com', 'testuser2', 'password123', 'Test User 2', () => {
  createTestUser('testuser3@example.com', 'testuser3', 'password123', 'Test User 3', () => {
    console.log('\n=== Creating Stories for Test Users ===');
    
    // Create stories for test users
    createStoryForUser('testuser2@example.com', 'password123', 'Test user 2 story', () => {
      createStoryForUser('testuser3@example.com', 'password123', 'Test user 3 story', () => {
        setupFollowingRelationships();
      });
    });
  });
});