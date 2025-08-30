const connectDB = async () => {
  try {
    // MongoDB connection
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is required');
      process.exit(1);
    }

    const mongoose = await import('mongoose');
    const conn = await mongoose.default.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.default.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.default.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.default.connection.close();
      console.log('📦 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    process.exit(1);
  }
};

export default connectDB; 