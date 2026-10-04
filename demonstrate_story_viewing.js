const http = require('http');

// Clear demonstration of viewing your own stories vs stories from your account
async function demonstrateStoryViewing() {
    console.log('📺 STORY VIEWING DEMONSTRATION');
    console.log('==============================\n');
    
    const account = {
        email: 'feature_tester@example.com',
        password: 'password123',
        name: 'Feature Tester'
    };
    
    console.log(`👤 ACCOUNT: ${account.name}`);
    console.log(`📧 EMAIL: ${account.email}\n`);
    
    try {
        // Login
        const loginData = JSON.stringify({
            email: account.email,
            password: account.password
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
        
        if (loginResponse.statusCode === 200) {
            const token = loginResponse.data.token;
            const userId = loginResponse.data.user.id;
            console.log('✅ LOGIN SUCCESSFUL\n');
            
            // 1. VIEW YOUR OWN STORIES (stories YOU created)
            console.log('1️⃣ YOUR PERSONAL STORIES (Stories you created)');
            console.log('================================================');
            
            const myStoriesResponse = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: `/api/stories/user/${userId}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (myStoriesResponse.statusCode === 200 && myStoriesResponse.data.length > 0) {
                console.log(`📱 Found ${myStoriesResponse.data.length} stories YOU created:\n`);
                myStoriesResponse.data.forEach((story, index) => {
                    console.log(`   📖 Story ${index + 1}:`);
                    console.log(`      Caption: "${story.caption}"`);
                    console.log(`      Views: ${story.views.length} people watched this`);
                    console.log(`      Created: ${new Date(story.createdAt).toLocaleString()}`);
                    console.log(`      Story ID: ${story._id}`);
                    console.log('   ---');
                });
                
                console.log('\n✅ To view these in app:');
                console.log('   - Open app → Login');
                console.log('   - Tap YOUR profile picture at top of feed');
                console.log('   - Your stories play automatically\n');
                
            } else {
                console.log('   ❌ No personal stories found\n');
            }
            
            // 2. VIEW ALL STORIES IN YOUR FEED (including your own + others you follow)
            console.log('2️⃣ ALL STORIES IN YOUR FEED');
            console.log('=============================');
            
            const allStoriesResponse = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: '/api/stories',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (allStoriesResponse.statusCode === 200 && allStoriesResponse.data.length > 0) {
                console.log(`📱 Found ${allStoriesResponse.data.length} total stories in your feed:\n`);
                
                const myStories = allStoriesResponse.data.filter(story => story.user?._id === userId);
                const othersStories = allStoriesResponse.data.filter(story => story.user?._id !== userId);
                
                console.log(`🌟 YOUR STORIES (${myStories.length}):`);
                myStories.forEach((story, index) => {
                    console.log(`   ${index + 1}. "${story.caption}" by YOU (${story.views.length} views)`);
                });
                
                if (othersStories.length > 0) {
                    console.log(`\n👥 OTHERS' STORIES (${othersStories.length}):`);
                    othersStories.forEach((story, index) => {
                        console.log(`   ${index + 1}. "${story.caption}" by ${story.user?.username} (${story.views.length} views)`);
                    });
                } else {
                    console.log('\n👥 No stories from other users (you\'re not following anyone yet)');
                }
                
                console.log('\n✅ To view all stories in app:');
                console.log('   - Open app → Login');
                console.log('   - Scroll to top of feed');
                console.log('   - Tap any profile circle to view their stories');
                console.log('   - Your stories appear first, then others you follow\n');
                
            } else {
                console.log('   ❌ No stories in feed\n');
            }
            
            // 3. DEMONSTRATE VIEWING A SPECIFIC STORY
            console.log('3️⃣ VIEWING A SPECIFIC STORY');
            console.log('============================');
            
            if (myStoriesResponse.data.length > 0) {
                const firstStory = myStoriesResponse.data[0];
                console.log(`📱 Viewing: "${firstStory.caption}"\n`);
                
                // Mark as viewed
                const viewResponse = await makeRequest({
                    hostname: 'localhost',
                    port: 3000,
                    path: `/api/stories/view/${firstStory._id}`,
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (viewResponse.statusCode === 200) {
                    console.log('✅ Story view recorded!');
                    
                    // Get updated story info
                    const storyDetails = await makeRequest({
                        hostname: 'localhost',
                        port: 3000,
                        path: `/api/stories/${firstStory._id}`,
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (storyDetails.statusCode === 200) {
                        console.log(`📊 Story Details:`);
                        console.log(`   Total Views: ${storyDetails.data.views.length}`);
                        console.log(`   Your Views: ${storyDetails.data.views.includes(userId) ? 'YES' : 'NO'}`);
                        console.log(`   Created: ${new Date(storyDetails.data.createdAt).toLocaleString()}`);
                        console.log(`   Expires: ${new Date(storyDetails.data.expiresAt).toLocaleString()}`);
                    }
                }
            }
            
        } else {
            console.log(`❌ Login failed: ${loginResponse.data.message}`);
        }
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('\n📱 MOBILE APP INSTRUCTIONS:');
    console.log('===========================');
    console.log('\nFOR VIEWING YOUR OWN STORIES:');
    console.log('1. Open the app and login');
    console.log('2. Look at the TOP of your feed');
    console.log('3. Find YOUR profile picture circle (usually first)');
    console.log('4. Tap your profile picture');
    console.log('5. Your stories play automatically');
    console.log('6. Swipe to navigate between your stories');
    
    console.log('\nFOR VIEWING ALL STORIES:');
    console.log('1. Open the app and login');
    console.log('2. Scroll to the top of your feed');
    console.log('3. You\'ll see circles with profile pictures');
    console.log('4. Tap any circle to view their stories');
    console.log('5. Your stories appear first, then others');
    console.log('6. Stories auto-play and advance');
    
    console.log('\n💡 TIPS:');
    console.log('- Your stories show your profile picture');
    console.log('- Others\' stories show their profile pictures');
    console.log('- Stories expire after 24 hours');
    console.log('- View counts increase when stories are watched');
}

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

// Run the demonstration
demonstrateStoryViewing();