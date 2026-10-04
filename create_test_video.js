const fs = require('fs');
const path = require('path');

// Create a simple test video file (just a small binary file for testing)
const testVideoPath = path.join(__dirname, 'test_video.mp4');
const testContent = Buffer.from('00000018ftypmp4200000008mp42isom00000238moov', 'hex');

console.log('Creating test video file...');
fs.writeFileSync(testVideoPath, testContent);
console.log('Test video file created at:', testVideoPath);
console.log('File size:', fs.statSync(testVideoPath).size, 'bytes');

// Test reading the file
try {
    const data = fs.readFileSync(testVideoPath);
    console.log('File read successfully, size:', data.length, 'bytes');
} catch (error) {
    console.log('Error reading file:', error.message);
}