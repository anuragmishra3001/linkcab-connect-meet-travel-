const connectDB = async () => {
  try {
    // MongoDB connection
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is required');
      process.exit(1);
    }

    const mongoose = await import('mongoose');
    
    // Enhanced connection options for Railway stability (removed deprecated options)
    const conn = await mongoose.default.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Limit connection pool size
      minPoolSize: 2,  // Keep minimum connections
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      retryWrites: true,
      w: 'majority'
    });

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events with reconnection logic
    mongoose.default.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      
      // Don't crash on connection errors, try to reconnect
      if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
        console.log('🔄 Attempting to reconnect to MongoDB...');
        setTimeout(() => {
          connectDB().catch(console.error);
        }, 5000); // Wait 5 seconds before reconnecting
      }
    });

    mongoose.default.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
      
      // Auto-reconnect on disconnect
      setTimeout(() => {
        if (mongoose.default.connection.readyState === 0) {
          console.log('🔄 Auto-reconnecting to MongoDB...');
          connectDB().catch(console.error);
        }
      }, 5000);
    });

    mongoose.default.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Monitor connection health
    setInterval(() => {
      const state = mongoose.default.connection.readyState;
      const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
      
      if (state !== 1) { // Not connected
        console.warn(`⚠️ MongoDB connection state: ${states[state]}`);
      }
    }, 30000); // Check every 30 seconds

    // Graceful shutdown
    const gracefulShutdown = async () => {
      try {
        await mongoose.default.connection.close();
        console.log('📦 MongoDB connection closed through app termination');
      } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
      }
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGUSR2', gracefulShutdown); // For nodemon

  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    
    // Don't crash on initial connection failure, retry
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      console.log('🔄 Retrying database connection in 10 seconds...');
      setTimeout(() => {
        connectDB().catch(console.error);
      }, 10000);
    } else {
      // For other errors, exit after a few retries
      console.error('❌ Fatal database connection error, exiting...');
      process.exit(1);
    }
  }
};

export default connectDB; 