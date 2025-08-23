const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const winston = require('winston');
const dotenv = require('dotenv');

console.log('🚀 Starting CV Slayer Server with Enhanced Debug...');

// Load environment variables
dotenv.config();

console.log('✅ Environment variables loaded');
console.log('🔑 GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'PRESENT' : 'MISSING');
console.log('🗄️ MONGODB_URI:', process.env.MONGODB_URI ? 'PRESENT' : 'MISSING');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('🌐 Server config:', { PORT, NODE_ENV });

// Basic logger setup first
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

console.log('📝 Logger configured');

// Basic middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
}));

console.log('🔧 Basic middleware configured');

// Database connection
async function connectToDatabase() {
  try {
    console.log('🔗 Connecting to database...');
    const { connectDB } = require('../config/database');
    await connectDB();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Load routes with detailed error handling
function loadRoutes() {
  try {
    console.log('📁 Loading resume routes...');
    const resumeRoutes = require('../routes/resume');
    app.use('/api/resume', resumeRoutes);
    console.log('✅ Resume routes loaded and mounted');
    
    console.log('📁 Loading admin routes...');
    const adminRoutes = require('../routes/admin');
    app.use('/api/admin', adminRoutes);
    console.log('✅ Admin routes loaded and mounted');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to load routes:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'CV Slayer API is running'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Server is working!',
    environment: {
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasMongoUri: !!process.env.MONGODB_URI,
      port: PORT,
      nodeEnv: NODE_ENV
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❓ 404 for:', req.originalUrl);
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('🚨 Server error:', error.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
async function startServer() {
  try {
    console.log('🔄 Starting server initialization...');
    
    // Connect to database
    const dbConnected = await connectToDatabase();
    if (!dbConnected) {
      console.log('⚠️ Continuing without database connection');
    }
    
    // Load routes
    const routesLoaded = loadRoutes();
    if (!routesLoaded) {
      console.error('❌ Failed to load routes, exiting...');
      process.exit(1);
    }
    
    // Start listening
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('🎉 CV Slayer API Server started successfully!');
      console.log(`📍 Server running on: http://localhost:${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
      console.log(`📊 Resume analyze: http://localhost:${PORT}/api/resume/analyze`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error.message);
        process.exit(1);
      }
    });

    return server;

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

startServer();

module.exports = app;