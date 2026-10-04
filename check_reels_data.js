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
    console.log('Login successful, token:', token.substring(0, 20) + '...');
    
    // Get reels
    const reelsReq = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/reels',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let reelsData = '';
      res.on('data', chunk => reelsData += chunk);
      res.on('end', () => {
        const reels = JSON.parse(reelsData);
        console.log('Number of reels:', reels.length);
        console.log('First reel data:');
        console.log(JSON.stringify(reels[0], null, 2));
      });
    });
    reelsReq.end();
  });
});

loginReq.write(loginData);
loginReq.end();