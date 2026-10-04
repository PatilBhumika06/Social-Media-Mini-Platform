const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing Social Media API...\n');
    
    // Test base URL
    console.log('1. Testing base API endpoint...');
    const baseResponse = await axios.get('http://localhost:3000/');
    console.log('✅ Base endpoint working:', baseResponse.data.message);
    
    // Test login with username
    console.log('\n2. Testing login with username...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'bhumika_27',
      password: 'password123'
    });
    console.log('✅ Login successful!');
    console.log('Token received:', loginResponse.data.token.substring(0, 50) + '...');
    console.log('User info:', loginResponse.data.user.fullName, `(@${loginResponse.data.user.username})`);
    
    // Test login with email
    console.log('\n3. Testing login with email...');
    const emailLoginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'bhumikapatil2121@gmail.com',
      password: 'password123'
    });
    console.log('✅ Email login successful!');
    console.log('User info:', emailLoginResponse.data.user.fullName, `(@${emailLoginResponse.data.user.username})`);
    
    // Test getting user profile (requires authentication)
    console.log('\n4. Testing authenticated user endpoint...');
    const userResponse = await axios.get('http://localhost:3000/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.token}`
      }
    });
    console.log('✅ User profile retrieved successfully!');
    
    console.log('\n🎉 All API tests passed! Your backend is working correctly.');
    
  } catch (error) {
    console.error('❌ API Test failed:', error.response?.data || error.message);
  }
}

testAPI();