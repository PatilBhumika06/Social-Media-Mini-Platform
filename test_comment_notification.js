const axios = require('axios');

// Test credentials
const BASE_URL = 'http://localhost:3000/api';

// Sample tokens - you'll need to replace these with actual tokens from your test users
let abcToken = null;
let kikToken = null;

async function loginAndGetToken(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password
    });
    console.log(`Login successful for ${email}`);
    return response.data.token;
  } catch (error) {
    console.error(`Login failed for ${email}:`, error.response?.data || error.message);
    return null;
  }
}

async function getUserInfo(token) {
  try {
    const response = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { 'x-auth-token': token }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting user info:', error.response?.data || error.message);
    return null;
  }
}

async function getPostsByUser(userId, token) {
  try {
    const response = await axios.get(`${BASE_URL}/posts/user/${userId}`, {
      headers: { 'x-auth-token': token }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting user posts:', error.response?.data || error.message);
    return [];
  }
}

async function addComment(postId, commentText, token) {
  try {
    const response = await axios.post(`${BASE_URL}/posts/comment/${postId}`, {
      text: commentText
    }, {
      headers: { 'x-auth-token': token }
    });
    console.log(`Comment added to post ${postId}: ${commentText}`);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error.response?.data || error.message);
    return null;
  }
}

async function getActivity(token) {
  try {
    const response = await axios.get(`${BASE_URL}/users/activity`, {
      headers: { 'x-auth-token': token }
    });
    console.log('Activity fetched successfully');
    return response.data;
  } catch (error) {
    console.error('Error fetching activity:', error.response?.data || error.message);
    return [];
  }
}

async function testCommentNotification() {
  console.log('Starting comment notification test...\n');
  
  // Login as ABC (the user who will comment)
  console.log('Logging in as user ABC...');
  abcToken = await loginAndGetToken('test@example.com', 'password123'); // ABC user
  if (!abcToken) {
    console.log('Failed to login as ABC user');
    return;
  }
  
  // Login as KIK (the user who owns the post and should receive notification)
  console.log('Logging in as user KIK...');
  kikToken = await loginAndGetToken('test2@example.com', 'password123'); // KIK user
  if (!kikToken) {
    console.log('Failed to login as KIK user');
    return;
  }

  // Get ABC's user info
  console.log('\nGetting ABC user info...');
  const abcUser = await getUserInfo(abcToken);
  if (!abcUser) {
    console.log('Failed to get ABC user info');
    return;
  }
  console.log(`ABC user ID: ${abcUser._id}, Username: ${abcUser.username}`);

  // Get KIK's user info
  console.log('\nGetting KIK user info...');
  const kikUser = await getUserInfo(kikToken);
  if (!kikUser) {
    console.log('Failed to get KIK user info');
    return;
  }
  console.log(`KIK user ID: ${kikUser._id}, Username: ${kikUser.username}`);

  // Get KIK's posts to comment on
  console.log('\nGetting KIK\'s posts...');
  const kikPosts = await getPostsByUser(kikUser._id, abcToken); // ABC can see KIK's posts if following
  if (kikPosts.length === 0) {
    console.log('No posts found for KIK user');
    // Let's get all posts instead to find one to comment on
    try {
      const allPosts = await axios.get(`${BASE_URL}/posts/all`, {
        headers: { 'x-auth-token': abcToken }
      });
      if (allPosts.data && allPosts.data.length > 0) {
        kikPosts.push(allPosts.data[0]); // Use first post from all posts
        console.log(`Using first available post: ${allPosts.data[0]._id}`);
      } else {
        console.log('No posts available to comment on');
        return;
      }
    } catch (error) {
      console.error('Error getting all posts:', error.response?.data || error.message);
      return;
    }
  }
  
  const postId = kikPosts[0]._id;
  console.log(`Found post ID: ${postId}`);
  console.log(`Post caption: ${kikPosts[0].caption || 'No caption'}`);

  // Get KIK's activity before commenting
  console.log('\nGetting KIK\'s activity before comment...');
  const activityBefore = await getActivity(kikToken);
  console.log(`Activity count before comment: ${activityBefore.length}`);

  // Add a comment from ABC on KIK's post
  console.log('\nAdding comment from ABC on KIK\'s post...');
  const commentText = `This is a test comment from ${abcUser.username}`;
  const commentResult = await addComment(postId, commentText, abcToken);
  if (!commentResult) {
    console.log('Failed to add comment');
    return;
  }

  // Wait a moment for the real-time notification to be processed
  console.log('Waiting 2 seconds for real-time notification...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Get KIK's activity after commenting
  console.log('\nGetting KIK\'s activity after comment...');
  const activityAfter = await getActivity(kikToken);
  console.log(`Activity count after comment: ${activityAfter.length}`);

  // Check if the comment notification appeared in KIK's activity
  const newActivities = activityAfter.filter(activity => 
    !activityBefore.some(beforeActivity => beforeActivity.id === activity.id)
  );

  console.log('\n--- RESULTS ---');
  if (newActivities.length > 0) {
    console.log('✅ SUCCESS: Comment notification was received!');
    newActivities.forEach(activity => {
      console.log(`- New activity: ${activity.action} by ${activity.actor.username}`);
      console.log(`  Content: ${activity.content}`);
      console.log(`  Type: ${activity.type}`);
      console.log(`  Timestamp: ${activity.timestamp}`);
    });
  } else {
    console.log('❌ FAILURE: No new activity found after comment');
    console.log('Comment notification system may not be working properly');
  }

  console.log('\n--- ACTIVITY SUMMARY ---');
  console.log(`Total activities before comment: ${activityBefore.length}`);
  console.log(`Total activities after comment: ${activityAfter.length}`);
  console.log(`New activities: ${newActivities.length}`);

  // Show latest activities
  if (activityAfter.length > 0) {
    console.log('\nLatest activities:');
    activityAfter.slice(0, 5).forEach((activity, index) => {
      console.log(`${index + 1}. ${activity.actor.username} ${activity.action} - ${new Date(activity.timestamp).toLocaleTimeString()}`);
    });
  }
}

// Run the test
testCommentNotification().catch(console.error);