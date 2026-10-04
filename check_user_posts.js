const http = require('http');

console.log('Checking user-specific posts...');

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
      
      // Get user's specific posts
      const userId = '69746a71b33e863660a5017a'; // Bhumika's user ID
      const userPostsOptions = {
        hostname: 'localhost',
        port: 3000,
        path: `/api/posts/user/${userId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const userPostsReq = http.request(userPostsOptions, (res) => {
        let postsData = '';
        res.on('data', (chunk) => {
          postsData += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            const posts = JSON.parse(postsData);
            console.log(`✅ User posts API working! Found ${posts.length} posts for user`);
            posts.forEach((post, index) => {
              console.log(`Post ${index + 1}:`, {
                id: post._id,
                caption: post.caption || '(no caption)',
                imageUrl: post.imageUrl,
                createdAt: post.createdAt
              });
            });
          } else {
            console.log(`❌ User posts API failed with status ${res.statusCode}`);
            console.log('Response:', postsData);
          }
        });
      });
      
      userPostsReq.on('error', (error) => {
        console.log('❌ User posts API error:', error.message);
      });
      
      userPostsReq.end();
      
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