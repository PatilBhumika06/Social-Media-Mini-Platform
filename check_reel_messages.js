const http = require('http');

// Login first
const loginData = JSON.stringify({
  email: 'bhumikapatil2121@gmail.com',
  password: 'password123'
});

const loginReq = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const result = JSON.parse(data);
    const token = result.token;
    console.log('Login successful');
    
    // Check messages for alice_wonder
    const messagesReq = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/messages/conversation/696c8ae00cfff3cfcd44b134',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      console.log(`Messages response status: ${res.statusCode}`);
      let messagesData = '';
      res.on('data', chunk => messagesData += chunk);
      res.on('end', () => {
        console.log('Messages response length:', messagesData.length);
        if (messagesData.length > 2) {
          const messages = JSON.parse(messagesData);
          console.log(`Total messages: ${messages.length}`);
          
          const reelMessages = messages.filter(msg => msg.messageType === 'reel_share');
          console.log(`Reel share messages: ${reelMessages.length}`);
          
          reelMessages.forEach((msg, index) => {
            console.log(`\n--- Reel Message ${index + 1} ---`);
            console.log('Content:', msg.content);
            console.log('Message Type:', msg.messageType);
            console.log('Has Reel:', !!msg.reel);
            if (msg.reel) {
              console.log('Reel ID:', msg.reel._id);
              console.log('Reel Caption:', msg.reel.caption);
            }
            console.log('Sender:', msg.sender?.username || msg.sender);
            console.log('Receiver:', msg.receiver?.username || msg.receiver);
          });
        } else {
          console.log('No messages found or empty response');
        }
      });
    });
    messagesReq.end();
  });
});

loginReq.write(loginData);
loginReq.end();