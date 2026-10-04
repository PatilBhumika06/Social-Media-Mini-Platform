const http = require('http');

// First, let's login to get a valid token
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
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Login Status:', res.statusCode);
    if (res.statusCode === 200) {
      const loginResponse = JSON.parse(body);
      const token = loginResponse.token;
      console.log('Got token:', token.substring(0, 20) + '...');
      
      // Now test adding a comment
      const commentData = JSON.stringify({text: 'Test comment from backend test'});
      const commentOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/posts/comment/69821cbb9c5d2b00aefafb1c',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': commentData.length
        }
      };
      
      const commentReq = http.request(commentOptions, res => {
        let commentBody = '';
        res.on('data', chunk => commentBody += chunk);
        res.on('end', () => {
          console.log('Comment Status:', res.statusCode);
          console.log('Comment Response:', commentBody);
        });
      });
      
      commentReq.on('error', error => {
        console.error('Comment Error:', error);
      });
      
      commentReq.write(commentData);
      commentReq.end();
    } else {
      console.log('Login failed:', body);
    }
  });
});

loginReq.on('error', error => {
  console.error('Login Error:', error);
});

loginReq.write(loginData);
loginReq.end();