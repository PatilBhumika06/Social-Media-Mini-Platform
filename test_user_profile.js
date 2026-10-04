const http = require('http');

console.log('Testing User Profile API with postsCount...');

// First, let's login to get a token
const loginData = JSON.stringify({
  email: 'john@example.com',
  password: 'password123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

const loginReq = http.request(loginOptions, (res) => {
  let loginData = '';
  res.on('data', (chunk) => {
    loginData += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      const loginResponse = JSON.parse(loginData);
      const token = loginResponse.token;
      console.log('✅ Login successful, got token');
      
      // Now test getting user profile
      const userOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/users/69746a71b33e863660a5017a', // Bhumika's user ID
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const userReq = http.request(userOptions, (res) => {
        let userData = '';
        res.on('data', (chunk) => {
          userData += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            const user = JSON.parse(userData);
            console.log('✅ User profile API working!');
            console.log('User data:', {
              username: user.username,
              postsCount: user.postsCount,
              followers: user.followers?.length || 0,
              following: user.following?.length || 0
            });
          } else {
            console.log(`❌ User profile API failed with status ${res.statusCode}`);
            console.log('Response:', userData);
          }
        });
      });
      
      userReq.on('error', (error) => {
        console.log('❌ User profile API error:', error.message);
      });
      
      userReq.end();
      
    } else {
      console.log(`❌ Login failed with status ${res.statusCode}`);
      console.log('Response:', loginData);
    }
  });
});

loginReq.on('error', (error) => {
  console.log('❌ Login request error:', error.message);
});

loginReq.write(loginData);
loginReq.end();