const multer = require('multer');
const path = require('path');

// Test the file filter function
const fileFilter = (req, file, cb) => {
  console.log('Testing file filter:');
  console.log('File mimetype:', file.mimetype);
  console.log('File originalname:', file.originalname);
  console.log('File extension:', path.extname(file.originalname));
  
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    console.log('✓ Mimetype is valid');
    cb(null, true);
  } else {
    console.log('✗ Mimetype is not valid');
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

// Test with different file types
const testFiles = [
  { mimetype: 'image/jpeg', originalname: 'test.jpg' },
  { mimetype: 'image/png', originalname: 'test.png' },
  { mimetype: 'video/mp4', originalname: 'test.mp4' },
  { mimetype: 'video/quicktime', originalname: 'test.mov' },
  { mimetype: 'text/plain', originalname: 'test.txt' },
  { mimetype: 'application/pdf', originalname: 'test.pdf' }
];

testFiles.forEach(file => {
  console.log('\n--- Testing:', file.originalname, '---');
  fileFilter(null, file, (error, result) => {
    if (error) {
      console.log('Result: REJECTED -', error.message);
    } else {
      console.log('Result: ACCEPTED -', result);
    }
  });
});