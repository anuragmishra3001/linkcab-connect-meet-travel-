import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import connectDB from './config/database.js';
import configureSocket from './config/socket.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.IO
const io = configureSocket(httpServer);

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL ? 
  process.env.FRONTEND_URL.split(',') : 
  ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware with limits
app.use(express.json({ 
  limit: '5mb', // Reduced from 10mb to prevent memory issues
  strict: true 
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '5mb' 
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LinkCab API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  });
});

// Load all API routes
try {
  const chatRoutes = await import('./routes/chat.js');
  const rideRoutes = await import('./routes/ride.js');
  const paymentRoutes = await import('./routes/payment.js');
  const razorpayRoutes = await import('./routes/razorpay.js');
  const reviewRoutes = await import('./routes/review.js');
  const matchRoutes = await import('./routes/match.js');
  const subscriptionRoutes = await import('./routes/subscription.js');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/chat', chatRoutes.default);
  app.use('/api/ride', rideRoutes.default);
  app.use('/api/payment', paymentRoutes.default);
  app.use('/api/payment/razorpay', razorpayRoutes.default);
  app.use('/api/review', reviewRoutes.default);
  app.use('/api/match', matchRoutes.default);
  app.use('/api/subscription', subscriptionRoutes.default);
  
  console.log('✅ All API routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  process.exit(1);
}

// Make io accessible to route handlers
app.set('io', io);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Global error handler with crash prevention
app.use((err, req, res, next) => {
  console.error('🚨 Global error handler:', err.stack);
  
  // Don't crash on client errors
  if (err.status === 400 || err.status === 401 || err.status === 403 || err.status === 404) {
    return res.status(err.status).json({
      success: false,
      message: err.message || 'Client error',
      timestamp: new Date().toISOString()
    });
  }
  
  // Log critical errors but don't crash
  console.error('🚨 Critical error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
  
  try {
    // Close HTTP server
    httpServer.close(() => {
      console.log('🔌 HTTP server closed');
    });
    
    // Close Socket.IO
    if (io) {
      io.close(() => {
        console.log('🔌 Socket.IO server closed');
      });
    }
    
    // Close database connection
    const mongoose = await import('mongoose');
    if (mongoose.default.connection.readyState === 1) {
      await mongoose.default.connection.close();
      console.log('📦 MongoDB connection closed');
    }
    
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle various shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // For nodemon

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err);
  console.error('Stack:', err.stack);
  // Don't exit immediately, let the app try to recover
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  // Don't exit immediately, let the app try to recover
});

// Memory monitoring
setInterval(() => {
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024)
  };
  
  // Log if memory usage is high
  if (memUsageMB.heapUsed > 100) { // 100MB threshold
    console.warn('⚠️ High memory usage:', memUsageMB);
  }
}, 60000); // Check every minute

httpServer.listen(PORT, () => {
  console.log(`🚀 LinkCab API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔌 Socket.IO initialized`);
  console.log(`📡 CORS enabled for: ${allowedOrigins.join(', ')}`);
  console.log(`🛡️ Crash prevention enabled`);
});