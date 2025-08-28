import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup ES module dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/linkcab', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Create User Schema
const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
  age: Number,
  gender: String,
  rating: { type: Number, default: 0 },
  totalRides: { type: Number, default: 0 },
  isPhoneVerified: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: true },
  profilePicture: String,
  bio: String,
  preferences: {
    smoking: { type: Boolean, default: false },
    music: { type: Boolean, default: true },
    pets: { type: Boolean, default: false }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create dummy user
const createDummyUser = async () => {
  const connection = await connectDB();
  
  try {
    // Create User model
    const User = mongoose.model('User', userSchema);
    
    // Check if dummy user already exists
    const existingUser = await User.findOne({ email: 'demo@example.com' });
    
    if (existingUser) {
      console.log('Dummy user already exists:', existingUser.email);
      console.log('You can login with:');
      console.log('Phone: +1234567890');
      console.log('Password: password123');
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Create new dummy user
    const dummyUser = new User({
      name: 'Demo User',
      phone: '+1234567890',
      email: 'demo@example.com',
      password: hashedPassword,
      age: 25,
      gender: 'prefer-not-to-say',
      isPhoneVerified: true,
      isEmailVerified: true,
      bio: 'This is a demo account for testing purposes',
      preferences: {
        smoking: false,
        music: true,
        pets: true
      },
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '+1987654321',
        relationship: 'Friend'
      }
    });
    
    await dummyUser.save();
    
    console.log('Dummy user created successfully!');
    console.log('You can login with:');
    console.log('Phone: +1234567890');
    console.log('Password: password123');
  } catch (error) {
    console.error('Error creating dummy user:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the function
createDummyUser();