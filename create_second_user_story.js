const http = require('http');
const fs = require('fs');

// Step 1: Create a second test user
function createSecondUser() {
  const userData = JSON.stringify({
    username: 'testuser2',
    email: 'test2@example.com',
    password: 'password123',
    fullName: 'Test User 2'
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
    console.log(`User creation Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('User creation Response:');
      console.log(data);
      
      if (res.statusCode === 200 || res.statusCode === 400) {
        // User created or already exists, now login
        loginSecondUser();
      }
    });
  });

  req.on('error', (error) => {
    console.error('User creation Error:', error);
  });

  req.write(userData);
  req.end();
}

// Step 2: Login as second user
function loginSecondUser() {
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
          uploadStoryForSecondUser(result.token);
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

// Step 3: Upload story for second user
function uploadStoryForSecondUser(token) {
  const filePath = 'test_image.jpg';
  const fileData = fs.readFileSync(filePath);
  
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const postData = 
    `------${boundary}\r\n` +
    'Content-Disposition: form-data; name="file"; filename="test_image2.jpg"\r\n' +
    'Content-Type: image/jpeg\r\n\r\n' +
    fileData.toString('binary') +
    `\r\n------${boundary}--\r\n`;
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/upload',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=----${boundary}`,
      'Content-Length': Buffer.byteLength(postData, 'binary')
    }
  };

  const req = http.request(options, (res) => {
    console.log(`File upload Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('File upload Response:');
      console.log(data);
      
      try {
        const result = JSON.parse(data);
        if (result.url) {
          console.log('File uploaded successfully!');
          createStoryForSecondUser(token, result.url);
        }
      } catch (e) {
        console.log('Error parsing upload response:', e.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('File upload Error:', error);
  });

  req.write(postData, 'binary');
  req.end();
}

// Step 4: Create story for second user
function createStoryForSecondUser(token, imageUrl) {
  const storyData = JSON.stringify({
    imageUrl: imageUrl,
    caption: 'Second user test story',
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
      
      try {
        const result = JSON.parse(data);
        console.log('Second user story created successfully!');
        console.log('Story ID:', result._id);
        
        // Now test viewing stories as first user
        testStoriesAsFirstUser();
      } catch (e) {
        console.log('Error parsing story creation response:', e.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Story creation Error:', error);
  });

  req.write(storyData);
  req.end();
}

// Step 5: Test viewing stories as first user
function testStoriesAsFirstUser() {
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
          getStoriesForViewing(result.token);
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

// Step 6: Get stories to verify both users have stories
function getStoriesForViewing(token) {
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
    console.log(`\nStories Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Stories Response body:');
      console.log(data);
      
      try {
        const stories = JSON.parse(data);
        console.log(`\nFound ${stories.length} stories:`);
        stories.forEach((story, index) => {
          console.log(`${index + 1}. User: ${story.user?.username || 'Unknown'}`);
          console.log(`   Image URL: ${story.imageUrl}`);
          console.log(`   Created: ${story.createdAt}`);
          console.log(`   Is Video: ${story.isVideo}`);
          console.log('---');
        });
        
        console.log('\n✅ Now you can view stories in the app!');
        console.log('Login as test@example.com and you should see both:');
        console.log('- Your story (with + icon)');  
        console.log('- testuser2 story (which you can tap to view)');
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
createSecondUser();