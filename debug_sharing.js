const http = require('http');

// First, login to get a token
const loginData = JSON.stringify({
  email: 'bhumikapatil2121@gmail.com',
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

console.log('Logging in...');
const loginReq = http.request(loginOptions, (res) => {
  let loginData = '';
  res.on('data', (chunk) => {
    loginData += chunk;
  });
  
  res.on('end', () => {
    try {
      const loginResult = JSON.parse(loginData);
      console.log('Login response:', loginResult);
      
      if (loginResult.token) {
        console.log('Login successful! Token:', loginResult.token.substring(0, 20) + '...');
        const token = loginResult.token;
        
        // Get a reel to share
        const getReelsOptions = {
          hostname: 'localhost',
          port: 3000,
          path: '/api/reels',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };
        
        console.log('\nGetting reels...');
        const getReelsReq = http.request(getReelsOptions, (res) => {
          console.log(`Get reels response status: ${res.statusCode}`);
          let reelsResponse = '';
          res.on('data', (chunk) => {
            reelsResponse += chunk;
          });
          
          res.on('end', () => {
            console.log('Reels response body preview:', reelsResponse.substring(0, 200) + '...');
            try {
              const reelsResult = JSON.parse(reelsResponse);
              
              if (reelsResult && reelsResult.length > 0) {
                const reelId = reelsResult[0]._id;
                console.log('Using reel ID:', reelId);
                
                // Try to share to an existing user (prayanth22)
                const shareData = JSON.stringify({
                  toUserId: '6986096c99b09f25e33ee598', // prayanth22
                  message: 'Check out this awesome reel!'
                });
                
                const shareOptions = {
                  hostname: 'localhost',
                  port: 3000,
                  path: `/api/reels/share/${reelId}`,
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(shareData)
                  }
                };
                
                console.log('\nAttempting to share reel...');
                const shareReq = http.request(shareOptions, (res) => {
                  console.log(`Share response status: ${res.statusCode}`);
                  let shareResponse = '';
                  res.on('data', (chunk) => {
                    shareResponse += chunk;
                  });
                  
                  res.on('end', () => {
                    console.log('Share response body:', shareResponse);
                    try {
                      const shareResult = JSON.parse(shareResponse);
                      console.log('Parsed share result:', shareResult);
                    } catch (e) {
                      console.log('Could not parse share response as JSON');
                      console.log('Raw response:', shareResponse);
                    }
                  });
                });
                
                shareReq.on('error', (error) => {
                  console.error('Share request error:', error);
                });
                
                shareReq.write(shareData);
                shareReq.end();
                
              } else {
                console.log('No reels found to share');
              }
            } catch (e) {
              console.log('Error parsing reels response:', e.message);
              console.log('Raw response:', reelsResponse);
            }
          });
        });
        
        getReelsReq.on('error', (error) => {
          console.error('Get reels request error:', error);
        });
        
        getReelsReq.end();
        
      } else {
        console.log('Login failed:', loginData);
      }
    } catch (e) {
      console.log('Error parsing login response:', e.message);
      console.log('Raw response:', loginData);
    }
  });
});

loginReq.on('error', (error) => {
  console.error('Login request error:', error);
});

loginReq.write(loginData);
loginReq.end();