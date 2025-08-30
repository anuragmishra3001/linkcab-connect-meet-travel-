import { sequelize } from '../config/database.js';
import User from '../models/User.js';
import Ride from '../models/Ride.js';
import Message from '../models/Message.js';
import Review from '../models/Review.js';
import Payment from '../models/Payment.js';
import OTP from '../models/OTP.js';

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models (create tables)
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database tables synchronized');
    
    // Create indexes
    console.log('📊 Creating database indexes...');
    
    // User indexes
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(isSubscribed, subscriptionPlan)');
    
    // Ride indexes
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_rides_driver ON rides(driverId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_rides_passenger ON rides(passengerId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_rides_scheduled ON rides(scheduledTime)');
    
    // Message indexes
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(senderId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiverId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(createdAt)');
    
    // Review indexes
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewerId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_reviews_reviewed ON reviews(reviewedUserId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_reviews_ride ON reviews(rideId)');
    
    // Payment indexes
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(userId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(paymentStatus)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_payments_transaction ON payments(transactionId)');
    
    // OTP indexes
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone, type, purpose)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email, type, purpose)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_otps_expires ON otps(expiresAt)');
    
    console.log('✅ Database indexes created');
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

migrate();
