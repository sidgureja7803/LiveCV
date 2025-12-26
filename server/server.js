const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const socketIo = require('socket.io');
const ejs = require('ejs');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Enhanced debugging
require('./debug-log');

// Load environment variables
dotenv.config();

// Import configuration validator
const { validateAllConfig, logValidationResults } = require('./config/validateConfig');

// Validate configuration before starting server
console.debug('Starting LiveCV server...');
console.debug(`Node Environment: ${process.env.NODE_ENV || 'development'}`);
console.debug(`Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);

// Run configuration validation
const configValidation = validateAllConfig();
logValidationResults(configValidation);

// Exit if critical configuration is missing
if (configValidation.criticalFailure) {
  console.error('\n❌ Server startup aborted due to missing critical configuration');
  console.error('Please check your .env file and ensure all required variables are set\n');
  process.exit(1);
}

// Import routes
const resumeRoutes = require('./routes/resumeRoutes');
const authRoutes = require('./routes/authRoutes');
const atsRoutes = require('./routes/atsRoutes');
const matchRoutes = require('./routes/matchRoutes');
const reportRoutes = require('./routes/reportRoutes');
const renderRoutes = require('./routes/renderRoute');
const appwriteAuthRoutes = require('./routes/auth');
const templatesRoutes = require('./routes/templates');
const jdMatchRoutes = require('./routes/jdMatchRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Import Appwrite configuration
const { validateConnection, isAppwriteConfigured } = require('./config/appwrite');

// Validate Appwrite is configured
if (isAppwriteConfigured()) {
  console.debug('✅ Using Appwrite for database, storage, and authentication');
  
  // Validate connection on startup
  validateConnection()
    .then(isConnected => {
      if (isConnected) {
        console.debug('✅ Appwrite connection validated successfully');
      } else {
        console.warn('⚠️ Appwrite connection validation failed, but server will continue');
      }
    })
    .catch(error => {
      // Catch any unexpected errors in the validation process
      console.error('⚠️ Error during Appwrite validation:', error);
      console.warn('⚠️ Server will continue without Appwrite validation');
    });
} else {
  console.warn('⚠️ Appwrite is not configured properly, some features may not work');
}

// Set up Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || ['https://livecv-client.vercel.app', 'http://localhost:5173', 'http://localhost:5172', '*'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", process.env.FRONTEND_URL || '*']
    }
  },
  crossOriginEmbedderPolicy: false
}));
app.use(compression()); // Compress responses
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL, 
      'https://livecv-client.vercel.app', 
      'https://livecv.netlify.app', 
      'http://localhost:5173',
      'http://localhost:5172',
      '*'
    ];
    // In development, allow all origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(null, true); // Allow all origins in production for now to debug issues
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Appwrite-Project', 'X-Appwrite-Key', 'X-SDK-Version']
}));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies

// Use express-session for pending user registration data
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'livecv-fallback-secret-key-2025',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 60 * 1000 // 30 minutes
  }
}));

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Track active editing sessions
const activeSessions = new Map();

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join a specific resume editing room
  socket.on('joinRoom', (resumeId) => {
    if (!resumeId) return;
    
    // Leave previous rooms
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    
    // Join the resume room
    socket.join(resumeId);
    console.log(`Client ${socket.id} joined room ${resumeId}`);
    
    // Track user in the active session
    if (!activeSessions.has(resumeId)) {
      activeSessions.set(resumeId, new Set());
    }
    activeSessions.get(resumeId).add(socket.id);
    
    // Notify clients about number of editors
    const editorCount = activeSessions.get(resumeId).size;
    io.to(resumeId).emit('editorCount', { count: editorCount });
  });
  
  // Handle resume updates
  socket.on('resumeUpdate', ({ resumeId, data, timestamp }) => {
    if (!resumeId) return;
    
    // Broadcast to all clients in the room except sender
    socket.to(resumeId).emit('resumeUpdated', { data, timestamp });
    
    // Log the update
    console.log(`Resume ${resumeId} updated by client ${socket.id} at ${timestamp}`);
  });
  
  // Handle cursor position updates for live coding
  socket.on('cursorUpdate', ({ resumeId, position, user }) => {
    if (!resumeId) return;
    
    // Broadcast cursor position to all clients in the room except sender
    socket.to(resumeId).emit('cursorUpdated', { position, user, clientId: socket.id });
  });
  
  // Handle text selection updates for live coding
  socket.on('selectionUpdate', ({ resumeId, selection, user }) => {
    if (!resumeId) return;
    
    // Broadcast selection to all clients in the room except sender
    socket.to(resumeId).emit('selectionUpdated', { selection, user, clientId: socket.id });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Remove client from active sessions
    activeSessions.forEach((clients, resumeId) => {
      if (clients.has(socket.id)) {
        clients.delete(socket.id);
        
        // If no clients left, remove the session
        if (clients.size === 0) {
          activeSessions.delete(resumeId);
        } else {
          // Update editor count for remaining clients
          io.to(resumeId).emit('editorCount', { count: clients.size });
        }
      }
    });
  });
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', appwriteAuthRoutes); // Appwrite authentication
app.use('/api/auth/legacy', authRoutes); // Legacy auth (keep for backward compatibility)
app.use('/api/resume', resumeRoutes);
app.use('/api/render', renderRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/jd-match', jdMatchRoutes);

// Legacy routes for backward compatibility
app.use('/ats-score', atsRoutes);
app.use('/match-score', matchRoutes);
app.use('/download-report', reportRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'LiveCV API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    appwrite: isAppwriteConfigured() ? 'configured' : 'not configured'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Start server only if not being imported for serverless
if (process.env.NODE_ENV !== 'production' || require.main === module) {
  const PORT = process.env.PORT;
  server.listen(PORT, () => {
    console.log(`LiveCV server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

module.exports = { app, server, io };