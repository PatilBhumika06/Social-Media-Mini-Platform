const http = require('http');
const fs = require('fs');
const path = require('path');

// Step 1: Login to get token
function login() {
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
          console.log('Login successful!');
          uploadStoryFile(result.token);
        } else {
          console.log('Login failed:', data);
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

// Step 2: Upload the story file
function uploadStoryFile(token) {
  const filePath = 'test_image.jpg';
  const fileData = fs.readFileSync(filePath);
  
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const postData = 
    `------${boundary}\r\n` +
    'Content-Disposition: form-data; name="file"; filename="test_image.jpg"\r\n' +
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
          console.log('File URL:', result.url);
          createStory(token, result.url);
        } else {
          console.log('Upload failed:', data);
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

// Step 3: Create the story with the uploaded file URL
function createStory(token, imageUrl) {
  const storyData = JSON.stringify({
    imageUrl: imageUrl,
    caption: 'Test story from API',
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
        console.log('Story created successfully!');
        console.log('Story ID:', result._id);
        
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

  req.write(storyData);
  req.end();
}

// Step 4: Test viewing stories
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
        
        console.log('\n✅ Story viewing test completed successfully!');
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
login();