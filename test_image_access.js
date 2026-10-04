const http = require('http');

// Test if the image files are accessible
const testImageUrl = '/uploads/post-1770112800861-922348410.png';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: testImageUrl,
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  if (res.statusCode === 200) {
    console.log('✅ Image file is accessible');
  } else {
    console.log('❌ Image file is not accessible');
  }
});

req.on('error', (error) => {
  console.log('❌ Request error:', error.message);
});

req.end();