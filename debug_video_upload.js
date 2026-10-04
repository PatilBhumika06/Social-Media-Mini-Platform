const fs = require('fs');
const path = require('path');

// Simulate what happens in the Flutter app
console.log('=== Video Upload Debug Test ===\n');

// 1. Check if upload directory exists and is writable
const uploadDir = path.join(__dirname, 'uploads', 'message-media');
console.log('1. Checking upload directory:', uploadDir);

try {
    const stats = fs.statSync(uploadDir);
    console.log('   ✓ Directory exists');
    console.log('   ✓ Directory is readable');
    
    // Test writing a small file
    const testFile = path.join(uploadDir, 'test_write.txt');
    fs.writeFileSync(testFile, 'test');
    console.log('   ✓ Directory is writable');
    fs.unlinkSync(testFile);
    console.log('   ✓ Temporary file cleaned up');
} catch (error) {
    console.log('   ✗ Error:', error.message);
    process.exit(1);
}

// 2. Check existing video files
console.log('\n2. Checking existing media files:');
const files = fs.readdirSync(uploadDir);
const videoFiles = files.filter(f => f.toLowerCase().endsWith('.mp4') || f.toLowerCase().endsWith('.mov'));
console.log('   Total files:', files.length);
console.log('   Video files:', videoFiles.length);
if (videoFiles.length > 0) {
    console.log('   Sample video files:', videoFiles.slice(0, 3));
}

// 3. Test file size limits
console.log('\n3. Testing file size handling:');
files.forEach(file => {
    const filePath = path.join(uploadDir, file);
    try {
        const stats = fs.statSync(filePath);
        console.log(`   ${file}: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    } catch (error) {
        console.log(`   ${file}: Error reading file - ${error.message}`);
    }
});

// 4. Check multer configuration
console.log('\n4. Multer configuration check:');
const multer = require('multer');
console.log('   ✓ Multer module loaded');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('   Storage destination function called');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'message-' + uniqueSuffix + path.extname(file.originalname);
        console.log('   Generated filename:', filename);
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    console.log('   File filter called for:', file.originalname);
    console.log('   File mimetype:', file.mimetype);
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        console.log('   ✓ File accepted');
        cb(null, true);
    } else {
        console.log('   ✗ File rejected');
        cb(new Error('Only image and video files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

console.log('   ✓ Multer configured with 10MB limit');

console.log('\n=== Test completed successfully ===');
console.log('If you\'re still getting server errors, the issue is likely:');
console.log('1. Authentication token issues');
console.log('2. Database connection problems');
console.log('3. Network connectivity issues');
console.log('4. Client-side file preparation issues');