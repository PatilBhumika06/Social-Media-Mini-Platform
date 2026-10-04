const http = require('http');
const fs = require('fs');

// Login first
const loginData = JSON.stringify({
  email: 'bhumikapatil2121@gmail.com',
  password: 'password123'
});

const loginReq = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const result = JSON.parse(data);
    const token = result.token;
    console.log('Login successful');
    
    // Test media upload
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const filePath = '../test_image.jpg'; // Test image file
    
    // Create multipart form data
    const formData = [
      `--${boundary}\r\n`,
      'Content-Disposition: form-data; name="receiverId"\r\n\r\n',
      '696c8ae00cfff3cfcd44b134\r\n', // alice_wonder
      `--${boundary}\r\n`,
      'Content-Disposition: form-data; name="content"\r\n\r\n',
      'Test media message\r\n',
      `--${boundary}\r\n`,
      'Content-Disposition: form-data; name="media"; filename="test.jpg"\r\n',
      'Content-Type: image/jpeg\r\n\r\n'
    ].join('');
    
    const footer = `\r\n--${boundary}--\r\n`;
    
    // Read test image file
    try {
      const imageData = fs.readFileSync(filePath);
      const postData = Buffer.concat([
        Buffer.from(formData, 'utf8'),
        imageData,
        Buffer.from(footer, 'utf8')
      ]);
      
      const mediaReq = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/messages/send',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': postData.length
        }
      }, (res) => {
        console.log(`Media upload response status: ${res.statusCode}`);
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          console.log('Media upload response:', responseData);
          try {
            const result = JSON.parse(responseData);
            console.log('Parsed result:', result);
          } catch (e) {
            console.log('Could not parse response as JSON');
          }
        });
      });
      
      mediaReq.write(postData);
      mediaReq.end();
      
    } catch (error) {
      console.log('Error reading test image:', error.message);
      console.log('Creating a simple test without image file...');
      
      // Fallback test with minimal data
      const simpleData = JSON.stringify({
        receiverId: '696c8ae00cfff3cfcd44b134',
        content: 'Test message without media'
      });
      
      const simpleReq = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/messages/send',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(simpleData)
        }
      }, (res) => {
        console.log(`Simple message response status: ${res.statusCode}`);
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          console.log('Simple message response:', responseData);
        });
      });
      
      simpleReq.write(simpleData);
      simpleReq.end();
    }
  });
});

loginReq.write(loginData);
loginReq.end();