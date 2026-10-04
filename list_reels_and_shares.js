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
    
    // Get all reels
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
      console.log(`Reels response status: ${res.statusCode}`);
      let reelsData = '';
      res.on('data', chunk => reelsData += chunk);
      res.on('end', () => {
        try {
          const reels = JSON.parse(reelsData);
          console.log(`Found ${reels.length} reels:`);
          reels.forEach((reel, index) => {
            console.log(`${index + 1}. ${reel._id} - ${reel.caption || 'No caption'}`);
            console.log(`   Shares: ${reel.shares?.length || 0}`);
            if (reel.shares && reel.shares.length > 0) {
              reel.shares.forEach(share => {
                console.log(`     - Shared to: ${share.sharedTo} at ${share.sharedAt}`);
              });
            }
          });
        } catch (e) {
          console.log('Error parsing reels:', e.message);
          console.log('Raw response:', reelsData);
        }
      });
    });
    
    reelsReq.end();
  });
});

loginReq.write(loginData);
loginReq.end();