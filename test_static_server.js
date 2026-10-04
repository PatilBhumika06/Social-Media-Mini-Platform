const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3002;

// Test the exact same static serving configuration
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/test-file-exists', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', 'post-images', 'post-1770112800861-922348410.png');
  const exists = fs.existsSync(filePath);
  res.json({ 
    filePath: filePath,
    exists: exists,
    stat: exists ? fs.statSync(filePath) : null
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`Try accessing:`);
  console.log(`  http://localhost:${PORT}/uploads/post-images/post-1770112800861-922348410.png`);
  console.log(`  http://localhost:${PORT}/test-file-exists`);
});