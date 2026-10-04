const axios = require('axios');

async function testPasswordChange() {
  try {
    console.log('Testing password change functionality...\n');
    
    // Step 1: Login to get token
    console.log('1. Logging in to get token...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'bhumika_27',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, got token');
    
    // Step 2: Change password
    console.log('\n2. Attempting to change password...');
    const changePasswordResponse = await axios.put('http://localhost:3000/api/users/change-password', {
      currentPassword: 'password123',
      newPassword: 'newpassword123'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Password change response:', changePasswordResponse.data.msg);
    
    // Step 3: Try to login with old password (should fail)
    console.log('\n3. Testing old password (should fail)...');
    try {
      await axios.post('http://localhost:3000/api/auth/login', {
        username: 'bhumika_27',
        password: 'password123'
      });
      console.log('❌ Old password still works (this is unexpected!)');
    } catch (error) {
      if (error.response.status === 400) {
        console.log('✅ Old password correctly rejected');
      } else {
        console.log('❌ Unexpected error when testing old password:', error.response.data);
      }
    }
    
    // Step 4: Try to login with new password (should work)
    console.log('\n4. Testing new password (should work)...');
    try {
      const newLoginResponse = await axios.post('http://localhost:3000/api/auth/login', {
        username: 'bhumika_27',
        password: 'newpassword123'
      });
      console.log('✅ New password works correctly');
    } catch (error) {
      console.log('❌ New password doesn\'t work:', error.response?.data || error.message);
    }
    
    // Step 5: Change password back to original for consistency
    console.log('\n5. Changing password back to original...');
    const newTokenResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'bhumika_27',
      password: 'newpassword123'
    });
    
    const newToken = newTokenResponse.data.token;
    const resetPasswordResponse = await axios.put('http://localhost:3000/api/users/change-password', {
      currentPassword: 'newpassword123',
      newPassword: 'password123'
    }, {
      headers: {
        'Authorization': `Bearer ${newToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Password reset back to original');
    
    console.log('\n🎉 Password change functionality test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testPasswordChange();