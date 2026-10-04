const http = require('http');
const fs = require('fs');

// First login to get token
const loginData = JSON.stringify({
  email: 'test@example.com',
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
        console.log('Login successful, creating test story...');
        createTestStory(result.token);
      }
    } catch (e) {
      console.log('Login error:', e.message);
    }
  });
});

loginReq.on('error', (error) => {
  console.error('Login Error:', error);
});

loginReq.write(loginData);
loginReq.end();

function createTestStory(token) {
  // Create multipart form data
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  
  // Read a test image file
  const testImagePath = 'test_image.jpg';
  let imageData;
  try {
    imageData = fs.readFileSync(testImagePath);
  } catch (e) {
    console.log('Test image not found, creating a simple test story with text data');
    // Create a simple test story without file upload
    createSimpleStory(token);
    return;
  }
  
  const postData = 
    `------${boundary}\r\n` +
    'Content-Disposition: form-data; name="userId"\r\n\r\n' +
    '6970be57d0961641beae67f3\r\n' +
    `------${boundary}\r\n` +
    'Content-Disposition: form-data; name="storyImage"; filename="test.jpg"\r\n' +
    'Content-Type: image/jpeg\r\n\r\n' +
    imageData.toString('binary') +
    `\r\n------${boundary}--\r\n`;
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/stories',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=----${boundary}`,
      'Content-Length': Buffer.byteLength(postData, 'binary')
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
        console.log('Story created successfully:', result.message);
        
        // Now test viewing stories
        testStories(token);
      } catch (e) {
        console.log('Error parsing story creation response:', e.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Story creation Error:', error);
  });

  req.write(postData, 'binary');
  req.end();
}

function createSimpleStory(token) {
  // Create a simple story with just text data (no file)
  const storyData = JSON.stringify({
    userId: '6970be57d0961641beae67f3'
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
    console.log(`Simple story Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Simple story Response:');
      console.log(data);
      
      // Test viewing stories
      testStories(token);
    });
  });

  req.on('error', (error) => {
    console.error('Simple story Error:', error);
  });

  req.write(storyData);
  req.end();
}

function testStories(token) {
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