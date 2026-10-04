const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');

// Import models to ensure they're registered
require('./models/User');
require('./models/Post');
require('./models/Story');
require('./models/Message');
require('./models/Reel');
require('./models/Comment');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const multer = require('multer');

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const profilePicsDir = path.join(uploadsDir, 'profile-pics');
const postImagesDir = path.join(uploadsDir, 'post-images');
const postVideosDir = path.join(uploadsDir, 'post-videos');
const reelVideosDir = path.join(uploadsDir, 'reel-videos');
const storyMediaDir = path.join(uploadsDir, 'story-media');

// Create directories if they don't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(profilePicsDir)) {
  fs.mkdirSync(profilePicsDir);
}
if (!fs.existsSync(postImagesDir)) {
  fs.mkdirSync(postImagesDir);
}
if (!fs.existsSync(postVideosDir)) {
  fs.mkdirSync(postVideosDir);
}
if (!fs.existsSync(reelVideosDir)) {
  fs.mkdirSync(reelVideosDir);
}
if (!fs.existsSync(storyMediaDir)) {
  fs.mkdirSync(storyMediaDir);
}

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
app.use(express.json());

// Configure multer for general file uploads
const generalUpload = multer({ 
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, 'uploads', 'story-media');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `story-${uniqueSuffix}-${file.originalname}`);
    }
  }),
  // Add file size limit (100MB)
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  // Handle errors
  fileFilter: (req, file, cb) => {
    // Accept images and videos based on MIME type or file extension
    const isMimeTypeValid = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
    
    // Also check file extension as a backup method
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
    const isExtensionValid = validExtensions.includes(fileExtension);
    
    if (isMimeTypeValid || isExtensionValid) {
      cb(null, true);
    } else {
      // Pass error to callback
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});



// Test endpoint to verify JSON responses
app.get('/api/test', (req, res) => {
  res.json({ msg: 'Test endpoint working', timestamp: new Date().toISOString() });
});

// Test endpoint to trigger activity events
app.get('/api/test-activity', (req, res) => {
  const { getIo } = require('./socket');
  const io = getIo();
  
  if (io) {
    // Get the current user ID from query params or use a test user
    const targetUserId = req.query.userId || '698b0e380bc9be75c5dc9336';
    
    console.log('Sending test events to user:', targetUserId);
    
    // Emit test events
    io.emit('newLike', {
      postId: 'test123',
      postOwnerId: targetUserId,
      likerId: 'test789',
      likerUsername: 'TestUser',
      timestamp: new Date()
    });
    
    io.emit('newComment', {
      postId: 'test123',
      postOwnerId: targetUserId,
      commenterId: 'test789',
      commenterUsername: 'TestUser',
      commentText: 'Test comment',
      timestamp: new Date()
    });
    
    io.emit('newFollow', {
      followedUserId: targetUserId,
      followerId: 'test789',
      followerUsername: 'TestUser',
      timestamp: new Date()
    });
    
    res.json({ msg: 'Test events sent', timestamp: new Date().toISOString() });
  } else {
    res.status(500).json({ msg: 'IO not available' });
  }
});

// General upload endpoint for stories and other media
app.post('/api/upload', (req, res) => {
  // Use multer as a function here to handle the error in a try-catch block
  generalUpload.single('file')(req, res, function(err) {
    if (err) {
      // Handle multer errors (file too large, invalid type, etc.)
      if (err.message === 'Only image and video files are allowed') {
        return res.status(400).json({ msg: err.message });
      } else if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ msg: 'File too large' });
        }
        return res.status(400).json({ msg: err.message });
      } else {
        return res.status(400).json({ msg: err.message });
      }
    }
    
    // If no error, check if file exists
    if (!req.file) {
      console.error('Upload failed: No file received');
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    
    console.log('File uploaded successfully:', req.file.filename);
    
    res.json({
      url: `/uploads/story-media/${req.file.filename}`,
      fullUrl: `http://localhost:3000/uploads/story-media/${req.file.filename}`,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size
    });
  });
});

// Serve static files from uploads directory (MUST be after API routes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Specifically serve story media files
const storyMediaServingDir = path.join(uploadsDir, 'story-media');
if (!fs.existsSync(storyMediaServingDir)) {
  fs.mkdirSync(storyMediaServingDir, { recursive: true });
}
app.use('/uploads/story-media', express.static(path.join(__dirname, 'uploads/story-media')));

// Specifically serve message media files
const messageMediaDir = path.join(uploadsDir, 'message-media');
if (!fs.existsSync(messageMediaDir)) {
  fs.mkdirSync(messageMediaDir, { recursive: true });
}
app.use('/uploads/message-media', express.static(path.join(__dirname, 'uploads/message-media')));

// Additional route for media files with fallback
app.use('/api/media', express.static(path.join(__dirname, 'uploads')));

// Routes are registered later in the file

// Global error handler to ensure JSON responses
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  // Ensure JSON response for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(500).json({ msg: 'Internal server error', error: err.message });
  }
  // For non-API routes, call next to continue with default error handling
  next(err);
});

// Create HTTP server
const server = http.createServer(app);

const { setIo } = require('./socket');

// Store connected users (userId -> Set<socketId>)
const connectedUsers = new Map();
const pendingVoiceCalls = new Map();
const pendingVideoCalls = new Map();

const normalizeUserId = (value) => (value == null ? null : value.toString());

const addUserSocket = (userId, socketId) => {
  const key = normalizeUserId(userId);
  if (!key) return;
  if (!connectedUsers.has(key)) {
    connectedUsers.set(key, new Set());
  }
  connectedUsers.get(key).add(socketId);
};

const removeUserSocket = (socketId) => {
  for (const [userId, socketIds] of connectedUsers.entries()) {
    if (!socketIds.has(socketId)) continue;
    socketIds.delete(socketId);
    if (socketIds.size === 0) {
      connectedUsers.delete(userId);
      return userId;
    }
    return null;
  }
  return null;
};

const isUserOnline = (userId) => {
  const key = normalizeUserId(userId);
  if (!key) return false;
  const sockets = connectedUsers.get(key);
  return !!sockets && sockets.size > 0;
};

const emitToUser = (ioInstance, userId, eventName, payload) => {
  const key = normalizeUserId(userId);
  if (!key) return;
  ioInstance.to(key).emit(eventName, payload);
};

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  // Add authentication middleware
  allowRequest: (req, callback) => {
    // Allow all requests for now, handle auth in connection handler
    callback(null, true);
  }
});

// Set io instance in socket module
setIo(io);

// Routes - Import after io is set
console.log('Loading routes...');
try {
  console.log('Loading auth route...');
  app.use('/api/auth', require('./routes/auth'));
  console.log('Auth route loaded successfully');
} catch (error) {
  console.error('Error loading auth route:', error);
}

try {
  console.log('Loading users route...');
  app.use('/api/users', require('./routes/users'));
  console.log('Users route loaded successfully');
} catch (error) {
  console.error('Error loading users route:', error);
}

try {
  console.log('Loading posts route...');
  app.use('/api/posts', require('./routes/posts'));
  console.log('Posts route loaded successfully');
} catch (error) {
  console.error('Error loading posts route:', error);
}

try {
  console.log('Loading stories route...');
  app.use('/api/stories', require('./routes/stories'));
  console.log('Stories route loaded successfully');
} catch (error) {
  console.error('Error loading stories route:', error);
}

try {
  console.log('Loading reels route...');
  app.use('/api/reels', require('./routes/reels'));
  console.log('Reels route loaded successfully');
} catch (error) {
  console.error('Error loading reels route:', error);
}

try {
  console.log('Loading messages route...');
  app.use('/api/messages', require('./routes/messages'));
  console.log('Messages route loaded successfully');
} catch (error) {
  console.error('Error loading messages route:', error);
}

try {
  console.log('Loading privacy route...');
  app.use('/api/privacy', require('./routes/privacy'));
  console.log('Privacy route loaded successfully');
} catch (error) {
  console.error('Error loading privacy route:', error);
}

try {
  console.log('Loading admin route...');
  app.use('/api/admin', require('./routes/admin'));
  console.log('Admin route loaded successfully');
} catch (error) {
  console.error('Error loading admin route:', error);
}

console.log('Routes loaded successfully');

// Catch 404 errors for API routes and return JSON
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ msg: 'API route not found' });
  }
  next();
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Extract authentication token from handshake
  const token = socket.handshake.auth?.token;
  let userId = null;
  
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
      userId = decoded.user?.id || decoded.userId || decoded.id || decoded._id;
      console.log(`Authenticated user ${userId} connected with socket ${socket.id}`);
    } catch (error) {
      console.log('Invalid token for socket connection:', error.message);
      socket.disconnect();
      return;
    }
  }
  
  // User joins with their user ID
  socket.on('join', (joinUserId) => {
    // Use authenticated user ID if available, otherwise use provided ID
    const actualUserId = userId || joinUserId;
    const normalizedUserId = normalizeUserId(actualUserId);
    if (!normalizedUserId) return;
    addUserSocket(normalizedUserId, socket.id);
    socket.join(normalizedUserId);
    console.log(`User ${normalizedUserId} joined with socket ${socket.id}`);
    // Broadcast to all users that this user is online
    socket.broadcast.emit('userOnline', normalizedUserId);
  });
  
  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, content } = data;
    
    try {
      // Save message to database
      const Message = require('./models/Message');
      const newMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        content,
      });
      
      const savedMessage = await newMessage.save();
      
      // Populate the message with user info
      await savedMessage.populate('sender', 'username fullName');
      await savedMessage.populate('receiver', 'username fullName');
      
      // Send message to receiver if online
      if (isUserOnline(receiverId)) {
        emitToUser(io, receiverId, 'newMessage', savedMessage);
      }
      
      // Send confirmation to sender
      socket.emit('messageSent', savedMessage);
      
      console.log(`Message sent from ${senderId} to ${receiverId}: ${content}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });
  
  // Handle typing indicators
  socket.on('typing', (data) => {
    const { senderId, receiverId } = data;
    if (isUserOnline(receiverId)) {
      emitToUser(io, receiverId, 'typing', { senderId });
      emitToUser(io, receiverId, 'userTyping', { userId: senderId });
    }
  });
  
  socket.on('stopTyping', (data) => {
    const { senderId, receiverId } = data;
    if (isUserOnline(receiverId)) {
      emitToUser(io, receiverId, 'stopTyping', { senderId });
      emitToUser(io, receiverId, 'userStopTyping', { userId: senderId });
    }
  });

  // WebRTC voice call signaling
  socket.on('voiceCallRequest', (data) => {
    const { callerId, receiverId, callerName } = data || {};
    const callKey = `${callerId}:${receiverId}`;

    // Clear stale timer if same call key exists
    if (pendingVoiceCalls.has(callKey)) {
      clearTimeout(pendingVoiceCalls.get(callKey));
      pendingVoiceCalls.delete(callKey);
    }

    const timeout = setTimeout(() => {
      pendingVoiceCalls.delete(callKey);
      if (isUserOnline(callerId)) {
        emitToUser(io, callerId, 'voiceCallMissed', { receiverId });
      }
    }, 30000);
    pendingVoiceCalls.set(callKey, timeout);

    if (isUserOnline(receiverId)) {
      emitToUser(io, receiverId, 'incomingVoiceCall', {
        callerId,
        callerName,
      });
    }
  });

  socket.on('voiceCallAccepted', (data) => {
    const { callerId, receiverId } = data || {};
    const callKey = `${callerId}:${receiverId}`;
    if (pendingVoiceCalls.has(callKey)) {
      clearTimeout(pendingVoiceCalls.get(callKey));
      pendingVoiceCalls.delete(callKey);
    }
    if (isUserOnline(callerId)) {
      emitToUser(io, callerId, 'voiceCallAccepted', { receiverId });
    }
  });

  socket.on('voiceCallRejected', (data) => {
    const { callerId, receiverId } = data || {};
    const callKey = `${callerId}:${receiverId}`;
    if (pendingVoiceCalls.has(callKey)) {
      clearTimeout(pendingVoiceCalls.get(callKey));
      pendingVoiceCalls.delete(callKey);
    }
    if (isUserOnline(callerId)) {
      emitToUser(io, callerId, 'voiceCallRejected', { receiverId });
    }
  });

  socket.on('voiceOffer', (data) => {
    const { senderId, receiverId, sdp } = data || {};
    if (isUserOnline(receiverId)) {
      emitToUser(io, receiverId, 'voiceOffer', { senderId, sdp });
    }
  });

  socket.on('voiceAnswer', (data) => {
    const { senderId, receiverId, sdp } = data || {};
    if (isUserOnline(receiverId)) {
      emitToUser(io, receiverId, 'voiceAnswer', { senderId, sdp });
    }
  });

  socket.on('voiceIceCandidate', (data) => {
    const { senderId, receiverId, candidate } = data || {};
    if (isUserOnline(receiverId)) {
      emitToUser(io, receiverId, 'voiceIceCandidate', { senderId, candidate });
    }
  });

  socket.on('voiceCallEnded', (data) => {
    const { senderId, receiverId } = data || {};
    const key1 = `${senderId}:${receiverId}`;
    const key2 = `${receiverId}:${senderId}`;
    if (pendingVoiceCalls.has(key1)) {
      clearTimeout(pendingVoiceCalls.get(key1));
      pendingVoiceCalls.delete(key1);
    }
    if (pendingVoiceCalls.has(key2)) {
      clearTimeout(pendingVoiceCalls.get(key2));
      pendingVoiceCalls.delete(key2);
    }
    if (isUserOnline(receiverId)) {
      emitToUser(io, receiverId, 'voiceCallEnded', { senderId });
    }
  });

  // WebRTC video call signaling
  socket.on('videoCallRequest', (data) => {
    const { callerId, receiverId, callerName } = data || {};
    const callKey = `${callerId}:${receiverId}`;

    if (pendingVideoCalls.has(callKey)) {
      clearTimeout(pendingVideoCalls.get(callKey));
      pendingVideoCalls.delete(callKey);
    }

    const timeout = setTimeout(() => {
      pendingVideoCalls.delete(callKey);
      if (isUserOnline(callerId)) {
        emitToUser(io, callerId, 'videoCallMissed', { receiverId });
      }
    }, 30000);
    pendingVideoCalls.set(callKey, timeout);

    if (isUserOnline(receiverId)) {
      emitToUser(io, receiverId, 'incomingVideoCall', {
        callerId,
        callerName,
      });
    }
  });

  socket.on('videoCallAccepted', (data) => {
    const { callerId, receiverId } = data || {};
    const callKey = `${callerId}:${receiverId}`;
    if (pendingVideoCalls.has(callKey)) {
      clearTimeout(pendingVideoCalls.get(callKey));
      pendingVideoCalls.delete(callKey);
    }
    if (isUserOnline(callerId)) {
      emitToUser(io, callerId, 'videoCallAccepted', { receiverId });
    }
  });

  socket.on('videoCallRejected', (data) => {
    const { callerId, receiverId } = data || {};
    const callKey = `${callerId}:${receiverId}`;
    if (pendingVideoCalls.has(callKey)) {
      clearTimeout(pendingVideoCalls.get(callKey));
      pendingVideoCalls.delete(callKey);
    }
    if (isUserOnline(callerId)) {
      emitToUser(io, callerId, 'videoCallRejected', { receiverId });
    }
  });

  socket.on('videoOffer', (data) => {
    const { senderId, receiverId, sdp } = data || {};
    if (isUserOnline(receiverId)) {
      emitToUser(io, receiverId, 'videoOffer', { senderId, sdp });
    }
  });

  socket.on('videoAnswer', (data) => {
    const { senderId, receiverId, sdp } = data || {};
    if (isUserOnline(receiverId)) {
      emitToUser(io, receiverId, 'videoAnswer', { senderId, sdp });
    }
  });

  socket.on('videoIceCandidate', (data) => {
    const { senderId, receiverId, candidate } = data || {};
    if (isUserOnline(receiverId)) {
      emitToUser(io, receiverId, 'videoIceCandidate', { senderId, candidate });
    }
  });

  socket.on('videoCallEnded', (data) => {
    const { senderId, receiverId } = data || {};
    const key1 = `${senderId}:${receiverId}`;
    const key2 = `${receiverId}:${senderId}`;
    if (pendingVideoCalls.has(key1)) {
      clearTimeout(pendingVideoCalls.get(key1));
      pendingVideoCalls.delete(key1);
    }
    if (pendingVideoCalls.has(key2)) {
      clearTimeout(pendingVideoCalls.get(key2));
      pendingVideoCalls.delete(key2);
    }
    if (isUserOnline(receiverId)) {
      emitToUser(io, receiverId, 'videoCallEnded', { senderId });
    }
  });
  
  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const disconnectedUserId = removeUserSocket(socket.id);
    if (disconnectedUserId) {
      socket.broadcast.emit('userOffline', disconnectedUserId);
    }

    if (disconnectedUserId) {
      for (const [callKey, timeout] of pendingVoiceCalls.entries()) {
        if (callKey.startsWith(`${disconnectedUserId}:`) || callKey.endsWith(`:${disconnectedUserId}`)) {
          clearTimeout(timeout);
          pendingVoiceCalls.delete(callKey);
        }
      }
      for (const [callKey, timeout] of pendingVideoCalls.entries()) {
        if (callKey.startsWith(`${disconnectedUserId}:`) || callKey.endsWith(`:${disconnectedUserId}`)) {
          clearTimeout(timeout);
          pendingVideoCalls.delete(callKey);
        }
      }
    }
  });
  
  // Handle activity events from clients (for testing)
  socket.on('newLike', (data) => {
    console.log('Broadcasting newLike event:', data);
    socket.broadcast.emit('newLike', data);
  });
  
  socket.on('newComment', (data) => {
    console.log('Broadcasting newComment event:', data);
    socket.broadcast.emit('newComment', data);
  });
  
  socket.on('newFollow', (data) => {
    console.log('Broadcasting newFollow event:', data);
    socket.broadcast.emit('newFollow', data);
  });
});

// Connect Database
connectDB();

// Schedule cleanup of expired stories (runs every hour)
setInterval(async () => {
  try {
    const Story = require('./models/Story');
    const User = require('./models/User');
    
    // Find expired stories
    const expiredStories = await Story.find({
      expiresAt: { $lt: new Date() }
    });
    
    if (expiredStories.length > 0) {
      const expiredStoryIds = expiredStories.map(story => story._id);
      
      // Remove stories from users' stories arrays
      await User.updateMany(
        { stories: { $in: expiredStoryIds } },
        { $pull: { stories: { $in: expiredStoryIds } } }
      );
      
      // Delete the expired stories
      await Story.deleteMany({
        _id: { $in: expiredStoryIds }
      });
      
      console.log(`Cleaned up ${expiredStories.length} expired stories`);
    }
  } catch (error) {
    console.error('Error during scheduled story cleanup:', error.message);
  }
}, 60 * 60 * 1000); // Run every hour

// Log when server starts
console.log('Express server configured with upload directories and static serving');

// Add error handling for server startup
server.on('error', (error) => {
  console.error('Server error:', error);
});

server.listen(PORT, () => console.log(`Server started on port ${PORT} with WebSocket support`));
