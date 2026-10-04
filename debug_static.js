const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3003;

console.log('Current directory:', __dirname);
console.log('Uploads directory path:', path.join(__dirname, 'uploads'));
console.log('Uploads directory exists:', fs.existsSync(path.join(__dirname, 'uploads')));
console.log('Post images directory exists:', fs.existsSync(path.join(__dirname, 'uploads', 'post-images')));

// Test the exact same static serving configuration
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/test-file', (req, res) => {
  const testPath = path.join(__dirname, 'uploads', 'post-images', 'post-1770112800861-922348410.png');
  res.json({ 
    testPath: testPath,
    exists: fs.existsSync(testPath),
    uploadsDir: path.join(__dirname, 'uploads'),
    requestUrl: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});