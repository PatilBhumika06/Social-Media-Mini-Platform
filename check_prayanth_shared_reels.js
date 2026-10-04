const http = require('http');

// Login as prayanth22 to check shared reels
console.log('=== Login as prayanth22 ===');
const loginData2 = JSON.stringify({
  email: 'prayanth22@gmail.com',
  password: 'password123'
});

const loginReq2 = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData2)
  }
}, (res) => {
  let loginData2 = '';
  res.on('data', (chunk) => {
    loginData2 += chunk;
  });
  
  res.on('end', () => {
    try {
      const loginResult2 = JSON.parse(loginData2);
      if (loginResult2.token) {
        console.log('prayanth22 logged in successfully');
        const token2 = loginResult2.token;
        
        // Check shared reels for prayanth22
        console.log('\n=== Check shared reels for prayanth22 ===');
        const sharedReelsReq = http.request({
          hostname: 'localhost',
          port: 3000,
          path: '/api/reels/shared-with-me',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token2}`,
            'Content-Type': 'application/json'
          }
        }, (res) => {
          console.log(`Shared reels response status: ${res.statusCode}`);
          let sharedReelsData = '';
          res.on('data', (chunk) => {
            sharedReelsData += chunk;
          });
          
          res.on('end', () => {
            console.log('Shared reels response:', sharedReelsData);
          });
        });
        
        sharedReelsReq.end();
      }
    } catch (e) {
      console.log('Error logging in as prayanth22:', e.message);
    }
  });
});

loginReq2.write(loginData2);
loginReq2.end();