const axios = require('axios');

async function checkUserReels() {
  try {
    const response = await axios.get('http://localhost:3000/api/reels/user/69746a71b33e863660a5017a', {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTc0NmE3MWIzM2U4NjM2NjBhNTAxN2EiLCJpYXQiOjE3NzA0MDcxNTQsImV4cCI6MTc3MTAxMTk1NH0.Kk8UnnYq5Ge0Pyp7gxN_pZMKYs0oA_UC-6wbDOWNqVQ'
      }
    });
    
    console.log('Reels for user def:');
    response.data.forEach((reel, index) => {
      console.log(`${index + 1}. Caption: ${reel.caption || 'No caption'}, Video URL: ${reel.videoUrl}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

checkUserReels();