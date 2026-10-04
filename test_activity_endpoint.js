const http = require('http');

console.log('=== Testing Activity Endpoint Directly ===\n');

// Login as User KIK and test activity endpoint
function testActivityEndpoint() {
  console.log('1. Logging in as User KIK...');
  
  const loginData = JSON.stringify({
    email: 'test2@example.com',
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
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.token) {
          console.log('✅ User KIK login successful');
          // Test activity endpoint
          testActivity(result.token);
        } else {
          console.log('❌ Login failed:', result.msg);
        }
      } catch (e) {
        console.log('Error parsing login response:', e.message);
        console.log('Response data:', data);
      }
    });
  });

  loginReq.on('error', (error) => {
    console.error('Login Error:', error);
  });

  loginReq.write(loginData);
  loginReq.end();
}

function testActivity(token) {
  console.log('\n2. Testing activity endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/users/activity',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Activity request status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response headers:', res.headers);
      console.log('Raw response data:', data);
      
      try {
        const activities = JSON.parse(data);
        console.log(`✅ Successfully parsed ${activities.length} activities`);
        console.log('Activities:', JSON.stringify(activities, null, 2));
      } catch (e) {
        console.log('❌ Error parsing activity response:', e.message);
        console.log('Response data:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Activity Error:', error);
  });

  req.end();
}

// Start the test
testActivityEndpoint();