const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Story = require('./backend/models/Story');
const User = require('./backend/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// HTTP request helper
function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        data: jsonData
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        data: data
                    });
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        if (postData) {
            req.write(postData);
        }
        
        req.end();
    });
}

async function diagnoseStoriesIssue() {
    console.log('🔍 DIAGNOSING STORIES ISSUE');
    console.log('==========================\n');
    
    try {
        // First, let's check what stories exist in the database
        console.log('1. Checking all stories in database:');
        const allStories = await Story.find({}).populate('user', 'username fullName');
        console.log(`   Total stories found: ${allStories.length}`);
        
        allStories.forEach((story, index) => {
            console.log(`   Story ${index + 1}:`);
            console.log(`     - ID: ${story._id}`);
            console.log(`     - User: ${story.user?.username || 'Unknown'}`);
            console.log(`     - Caption: ${story.caption}`);
            console.log(`     - Created: ${story.createdAt}`);
            console.log(`     - Expires: ${story.expiresAt}`);
            console.log(`     - Expired: ${story.expiresAt < new Date() ? 'YES' : 'NO'}`);
            console.log(`     - Views: ${story.views.length}`);
            console.log('   ---');
        });
        
        // Test login and get token
        console.log('\n2. Testing login for feature_tester account:');
        const loginData = JSON.stringify({
            email: 'feature_tester@example.com',
            password: 'password123'
        });
        
        const loginResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(loginData)
            }
        }, loginData);
        
        if (loginResponse.statusCode !== 200) {
            console.log('❌ Login failed');
            return;
        }
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful');
        
        // Test getting all stories (the main endpoint)
        console.log('\n3. Testing /api/stories endpoint:');
        const storiesResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/stories',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`   Status: ${storiesResponse.statusCode}`);
        if (storiesResponse.statusCode === 200) {
            console.log(`   Stories returned: ${storiesResponse.data.length}`);
            storiesResponse.data.forEach((story, index) => {
                console.log(`   Story ${index + 1}: ${story.caption} by ${story.user?.username}`);
            });
        } else {
            console.log(`   Error: ${storiesResponse.data.message}`);
        }
        
        // Test getting user's own stories specifically
        console.log('\n4. Testing /api/stories/user/:userId endpoint:');
        const user = await User.findOne({ email: 'feature_tester@example.com' });
        if (user) {
            const userStoriesResponse = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: `/api/stories/user/${user._id}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(`   Status: ${userStoriesResponse.statusCode}`);
            if (userStoriesResponse.statusCode === 200) {
                console.log(`   User stories returned: ${userStoriesResponse.data.length}`);
                userStoriesResponse.data.forEach((story, index) => {
                    console.log(`   Story ${index + 1}: ${story.caption}`);
                });
            } else {
                console.log(`   Error: ${userStoriesResponse.data.message}`);
            }
        }
        
        // Test the my-stories endpoint
        console.log('\n5. Testing /api/stories/my-stories endpoint:');
        const myStoriesResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/stories/my-stories',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`   Status: ${myStoriesResponse.statusCode}`);
        if (myStoriesResponse.statusCode === 200) {
            console.log(`   My stories groups returned: ${myStoriesResponse.data.length}`);
            myStoriesResponse.data.forEach((group, index) => {
                console.log(`   Group ${index + 1}: ${group.user?.username} (${group.stories.length} stories)`);
            });
        } else {
            console.log(`   Error: ${myStoriesResponse.data.message}`);
        }
        
        // Create a new story to test
        console.log('\n6. Creating a new test story:');
        const newStoryData = JSON.stringify({
            imageUrl: 'https://picsum.photos/400/700',
            caption: 'Test story to verify viewing functionality',
            isVideo: false
        });
        
        const createStoryResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/stories',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(newStoryData)
            }
        }, newStoryData);
        
        console.log(`   Status: ${createStoryResponse.statusCode}`);
        if (createStoryResponse.statusCode === 200) {
            console.log('✅ New story created successfully');
            console.log(`   Story ID: ${createStoryResponse.data._id}`);
            
            // Test viewing the new story
            console.log('\n7. Testing story view functionality:');
            const viewResponse = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: `/api/stories/view/${createStoryResponse.data._id}`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(`   View status: ${viewResponse.statusCode}`);
            if (viewResponse.statusCode === 200) {
                console.log('✅ Story view recorded');
            }
            
            // Check if story now appears in feed
            console.log('\n8. Checking if new story appears in stories feed:');
            const finalStoriesResponse = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: '/api/stories',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (finalStoriesResponse.statusCode === 200) {
                const hasNewStory = finalStoriesResponse.data.some(
                    story => story._id === createStoryResponse.data._id
                );
                console.log(`   New story in feed: ${hasNewStory ? 'YES' : 'NO'}`);
            }
        } else {
            console.log(`   Error creating story: ${createStoryResponse.data.message}`);
        }
        
    } catch (error) {
        console.error('❌ Error during diagnosis:', error.message);
    } finally {
        setTimeout(() => {
            mongoose.connection.close();
            console.log('\n🔍 DIAGNOSIS COMPLETE');
        }, 1000);
    }
}

// Run the diagnosis
diagnoseStoriesIssue();