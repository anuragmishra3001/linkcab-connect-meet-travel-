import { sequelize } from '../config/database.js';
import User from '../models/User.js';
import Ride from '../models/Ride.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Ride.destroy({ where: {} });
    await User.destroy({ where: {} });
    
    // Create test users
    console.log('👥 Creating test users...');
    
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = await User.bulkCreate([
      {
        name: 'John Doe',
        phone: '+919876543210',
        email: 'john@example.com',
        password: hashedPassword,
        age: 25,
        gender: 'male',
        rating: 4.5,
        totalRides: 15,
        isPhoneVerified: true,
        isEmailVerified: true,
        bio: 'Friendly driver who loves music and good conversations!',
        preferences: {
          smoking: false,
          music: true,
          pets: false
        },
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+919876543211',
          relationship: 'Sister'
        },
        isSubscribed: true,
        subscriptionPlan: 'gold',
        subscriptionStatus: 'active',
        subscriptionStartDate: new Date(),
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      {
        name: 'Jane Smith',
        phone: '+919876543212',
        email: 'jane@example.com',
        password: hashedPassword,
        age: 28,
        gender: 'female',
        rating: 4.8,
        totalRides: 8,
        isPhoneVerified: true,
        isEmailVerified: true,
        bio: 'Passenger who enjoys quiet rides and punctuality.',
        preferences: {
          smoking: false,
          music: false,
          pets: true
        },
        emergencyContact: {
          name: 'John Smith',
          phone: '+919876543213',
          relationship: 'Brother'
        },
        isSubscribed: false
      },
      {
        name: 'Mike Johnson',
        phone: '+919876543214',
        email: 'mike@example.com',
        password: hashedPassword,
        age: 32,
        gender: 'male',
        rating: 4.2,
        totalRides: 25,
        isPhoneVerified: true,
        isEmailVerified: true,
        bio: 'Experienced driver with a clean car and great driving record.',
        preferences: {
          smoking: true,
          music: true,
          pets: false
        },
        emergencyContact: {
          name: 'Sarah Johnson',
          phone: '+919876543215',
          relationship: 'Wife'
        },
        isSubscribed: true,
        subscriptionPlan: 'platinum',
        subscriptionStatus: 'active',
        subscriptionStartDate: new Date(),
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    ]);
    
    console.log(`✅ Created ${users.length} test users`);
    
    // Create test rides
    console.log('🚗 Creating test rides...');
    
    const rides = await Ride.bulkCreate([
      {
        driverId: users[0].id,
        passengerId: users[1].id,
        pickupLocation: {
          lat: 28.6139,
          lng: 77.2090,
          address: 'Connaught Place, New Delhi'
        },
        dropoffLocation: {
          lat: 28.7041,
          lng: 77.1025,
          address: 'North Campus, Delhi University'
        },
        status: 'completed',
        fare: 150.00,
        distance: 12.5,
        duration: 25,
        scheduledTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        actualStartTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
        actualEndTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        paymentStatus: 'completed',
        paymentMethod: 'razorpay',
        notes: 'Great ride, punctual driver!'
      },
      {
        driverId: users[2].id,
        passengerId: users[0].id,
        pickupLocation: {
          lat: 19.0760,
          lng: 72.8777,
          address: 'Bandra West, Mumbai'
        },
        dropoffLocation: {
          lat: 19.2183,
          lng: 72.9781,
          address: 'Andheri West, Mumbai'
        },
        status: 'in-progress',
        fare: 200.00,
        distance: 8.2,
        duration: 20,
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        actualStartTime: new Date(),
        paymentStatus: 'pending',
        paymentMethod: 'razorpay',
        notes: 'On the way to pickup location'
      },
      {
        driverId: users[1].id,
        passengerId: users[2].id,
        pickupLocation: {
          lat: 12.9716,
          lng: 77.5946,
          address: 'MG Road, Bangalore'
        },
        dropoffLocation: {
          lat: 13.0827,
          lng: 77.5877,
          address: 'Indiranagar, Bangalore'
        },
        status: 'pending',
        fare: 120.00,
        distance: 6.8,
        duration: 15,
        scheduledTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        paymentStatus: 'pending',
        paymentMethod: 'razorpay',
        notes: 'Flexible pickup time'
      }
    ]);
    
    console.log(`✅ Created ${rides.length} test rides`);
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

seed();
