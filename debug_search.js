const http = require('http');

console.log('=== Debugging Search Functionality ===\n');

// Login and search for a user
function testSearch() {
  console.log('1. Logging in as test user...');
  
  const loginData = JSON.stringify({
    email: 'test@example.com',
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
          console.log('✅ Login successful');
          console.log('Token:', result.token.substring(0, 20) + '...');
          
          // Test different search queries
          testSearchQueries(result.token);
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

function testSearchQueries(token) {
  const queries = ['test', 'test2', 'john', 'jane', 'user'];
  
  console.log('\n2. Testing search queries...');
  
  queries.forEach((query, index) => {
    setTimeout(() => {
      console.log(`\n--- Testing search for: "${query}" ---`);
      performSearch(token, query);
    }, index * 1000); // 1 second delay between searches
  });
}

function performSearch(token, query) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/users/search/${query}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Search status for "${query}": ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const users = JSON.parse(data);
        console.log(`Found ${users.length} users for query "${query}"`);
        if (users.length > 0) {
          users.slice(0, 3).forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.username} (${user.email}) - Following: ${user.isFollowing ? 'Yes' : 'No'}`);
          });
          if (users.length > 3) {
            console.log(`  ... and ${users.length - 3} more users`);
          }
        }
      } catch (e) {
        console.log(`Error parsing search response for "${query}":`, e.message);
        console.log('Response data:', data.substring(0, 200) + '...');
      }
    });
  });

  req.on('error', (error) => {
    console.error(`Search Error for "${query}":`, error);
  });

  req.end();
}

// Start the test
testSearch();