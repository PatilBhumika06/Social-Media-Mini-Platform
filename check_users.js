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
    
    // Get users
    const usersReq = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/users',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let usersData = '';
      res.on('data', chunk => usersData += chunk);
      res.on('end', () => {
        const users = JSON.parse(usersData);
        console.log('Available users:');
        users.forEach(user => {
          console.log(`- ${user.username} (${user._id})`);
        });
      });
    });
    usersReq.end();
  });
});

loginReq.write(loginData);
loginReq.end();