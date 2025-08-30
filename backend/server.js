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

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LinkCab API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
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

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 LinkCab API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔌 Socket.IO initialized`);
  console.log(`📡 CORS enabled for: ${allowedOrigins.join(', ')}`);
});