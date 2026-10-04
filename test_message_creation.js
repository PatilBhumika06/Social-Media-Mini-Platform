const http = require('http');

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
    
    // Test sending a regular message
    const testMessage = JSON.stringify({
      receiverId: '696c8ae00cfff3cfcd44b134', // alice_wonder
      content: 'Test message from script'
    });
    
    const messageReq = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/messages/send',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testMessage)
      }
    }, (res) => {
      console.log(`Message response status: ${res.statusCode}`);
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        console.log('Message response:', responseData);
      });
    });
    
    messageReq.write(testMessage);
    messageReq.end();
  });
});

loginReq.write(loginData);
loginReq.end();