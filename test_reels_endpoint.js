const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const http = require('http');

async function testReelsEndpoint() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Find user bhumika_27
    const user = await User.findOne({ username: 'bhumika_27' });
    if (!user) {
      console.log('User bhumika_27 not found');
      return;
    }
    
    console.log('Found user:', user.username);
    console.log('User ID:', user._id);
    
    // Generate a valid token
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('Generated token:', token);
    
    // Test the reels endpoint
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/reels',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Response Status Code:', res.statusCode);
        console.log('Response Headers:', res.headers);
        console.log('Response Data:', data);
        
        if (res.statusCode === 200) {
          try {
            const reels = JSON.parse(data);
            console.log('Successfully loaded', reels.length, 'reels');
            console.log('Reels data:', JSON.stringify(reels, null, 2));
          } catch (e) {
            console.log('Error parsing JSON:', e);
          }
        }
        
        mongoose.connection.close();
      });
    });
    
    req.on('error', (error) => {
      console.error('Request error:', error);
      mongoose.connection.close();
    });
    
    req.end();
    
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

testReelsEndpoint();