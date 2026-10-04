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
    
    // Test sharing a reel to create a message (use david_brown)
    const shareData = JSON.stringify({
      toUserId: '696b96e1db4a916e585784b5', // david_brown
      message: 'Check out this awesome reel!'
    });
    
    const shareReq = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/reels/share/69864246f6f411d21d86eb53',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(shareData)
      }
    }, (res) => {
      console.log(`Share response status: ${res.statusCode}`);
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        console.log('Share response:', responseData);
        try {
          const result = JSON.parse(responseData);
          console.log('Share result:', result);
        } catch (e) {
          console.log('Could not parse response as JSON');
        }
      });
    });
    
    shareReq.write(shareData);
    shareReq.end();
  });
});

loginReq.write(loginData);
loginReq.end();