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
    
    // Check messages for charlie_brown
    const messagesReq = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/messages/conversation/696c8ae00cfff3cfcd44b13b',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      console.log(`Messages response status: ${res.statusCode}`);
      let messagesData = '';
      res.on('data', chunk => messagesData += chunk);
      res.on('end', () => {
        const messages = JSON.parse(messagesData);
        console.log('Messages found:', messages.length);
        messages.forEach((msg, index) => {
          console.log(`Message ${index + 1}:`, msg.content, `(Type: ${msg.messageType})`);
        });
      });
    });
    messagesReq.end();
  });
});

loginReq.write(loginData);
loginReq.end();