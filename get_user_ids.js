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
    
    // Get all users to find correct IDs
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
      console.log(`Users response status: ${res.statusCode}`);
      let usersData = '';
      res.on('data', chunk => usersData += chunk);
      res.on('end', () => {
        try {
          const users = JSON.parse(usersData);
          console.log('User IDs:');
          users.forEach(user => {
            console.log(`${user.username}: ${user._id}`);
          });
        } catch (e) {
          console.log('Error parsing users:', e.message);
        }
      });
    });
    
    usersReq.end();
  });
});

loginReq.write(loginData);
loginReq.end();