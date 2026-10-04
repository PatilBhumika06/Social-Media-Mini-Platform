const http = require('http');
const fs = require('fs');

console.log('=== Creating Test Post for User KIK ===\n');

// Login as User KIK and create a post
function createTestPost() {
  console.log('1. Logging in as User KIK...');
  
  const loginData = JSON.stringify({
    email: 'test2@example.com',
    password: 'password123'
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
          console.log('✅ User KIK login successful');
          // Create a test post
          createPost(result.token);
        } else {
          console.log('❌ Login failed:', result.msg);
        }
      } catch (e) {
        console.log('Error parsing login response:', e.message);
        console.log('Response data:', data);
      }
    });
  });

  loginReq.on('error', (error) => {
    console.error('Login Error:', error);
  });

  loginReq.write(loginData);
  loginReq.end();
}

function createPost(token) {
  console.log('\n2. Creating test post for User KIK...');
  
  // Create form data for post creation
  const postData = JSON.stringify({
    caption: 'Test post for real-time notification testing - please like this post!',
    location: 'Test Location'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/posts',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Post creation status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        if (res.statusCode === 201) {
          const post = JSON.parse(data);
          console.log('✅ Successfully created test post!');
          console.log(`Post ID: ${post._id}`);
          console.log(`Caption: ${post.caption}`);
          console.log(`Created at: ${post.createdAt}`);
          
          console.log('\n=== Test Post Creation Complete ===');
          console.log('Now you can run the real-time notification test');
        } else {
          const result = JSON.parse(data);
          console.log('❌ Post creation failed:', result.msg);
        }
      } catch (e) {
        console.log('Error parsing post creation response:', e.message);
        console.log('Response data:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Post Creation Error:', error);
  });

  req.write(postData);
  req.end();
}

// Start the process
createTestPost();