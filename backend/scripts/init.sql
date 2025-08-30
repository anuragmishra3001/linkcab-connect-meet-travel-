-- LinkCab Database Initialization Script
-- This script sets up the initial database structure

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS linkcab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE linkcab;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT NOT NULL CHECK (age >= 18 AND age <= 100),
    gender ENUM('male', 'female', 'other', 'prefer-not-to-say') NOT NULL DEFAULT 'prefer-not-to-say',
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    totalRides INT DEFAULT 0,
    isPhoneVerified BOOLEAN DEFAULT FALSE,
    isEmailVerified BOOLEAN DEFAULT FALSE,
    profilePicture TEXT,
    bio VARCHAR(200) DEFAULT '',
    preferences JSON DEFAULT '{"smoking": false, "music": true, "pets": false}',
    emergencyContact JSON,
    isSubscribed BOOLEAN DEFAULT FALSE,
    subscriptionPlan ENUM('silver', 'gold', 'platinum'),
    subscriptionStatus ENUM('active', 'inactive', 'expired', 'cancelled') DEFAULT 'inactive',
    subscriptionStartDate DATETIME,
    subscriptionExpiresAt DATETIME,
    paymentMethod VARCHAR(255),
    lastBillingDate DATETIME,
    nextBillingDate DATETIME,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_phone (phone),
    INDEX idx_users_email (email),
    INDEX idx_users_subscription (isSubscribed, subscriptionPlan)
);

-- Create rides table
CREATE TABLE IF NOT EXISTS rides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driverId INT NOT NULL,
    passengerId INT NOT NULL,
    pickupLocation JSON NOT NULL,
    dropoffLocation JSON NOT NULL,
    status ENUM('pending', 'accepted', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
    fare DECIMAL(10,2) NOT NULL,
    distance DECIMAL(8,2) NOT NULL,
    duration INT NOT NULL COMMENT 'in minutes',
    scheduledTime DATETIME,
    actualStartTime DATETIME,
    actualEndTime DATETIME,
    paymentStatus ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    paymentMethod VARCHAR(255),
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driverId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (passengerId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_rides_driver (driverId),
    INDEX idx_rides_passenger (passengerId),
    INDEX idx_rides_status (status),
    INDEX idx_rides_scheduled (scheduledTime)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    senderId INT NOT NULL,
    receiverId INT NOT NULL,
    content TEXT NOT NULL,
    messageType ENUM('text', 'image', 'file', 'location') DEFAULT 'text',
    isRead BOOLEAN DEFAULT FALSE,
    readAt DATETIME,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_messages_sender (senderId),
    INDEX idx_messages_receiver (receiverId),
    INDEX idx_messages_created (createdAt)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reviewerId INT NOT NULL,
    reviewedUserId INT NOT NULL,
    rideId INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    reviewType ENUM('driver', 'passenger') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewerId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewedUserId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (rideId) REFERENCES rides(id) ON DELETE CASCADE,
    INDEX idx_reviews_reviewer (reviewerId),
    INDEX idx_reviews_reviewed (reviewedUserId),
    INDEX idx_reviews_ride (rideId)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    rideId INT,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    paymentMethod ENUM('razorpay', 'stripe', 'cash', 'wallet') NOT NULL,
    paymentStatus ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transactionId VARCHAR(255) UNIQUE,
    gatewayResponse JSON,
    paymentType ENUM('ride', 'subscription', 'wallet') NOT NULL,
    description TEXT,
    refundAmount DECIMAL(10,2) DEFAULT 0,
    refundReason TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (rideId) REFERENCES rides(id) ON DELETE SET NULL,
    INDEX idx_payments_user (userId),
    INDEX idx_payments_status (paymentStatus),
    INDEX idx_payments_transaction (transactionId)
);

-- Create otps table
CREATE TABLE IF NOT EXISTS otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    otp VARCHAR(6) NOT NULL,
    type ENUM('phone', 'email', 'both') NOT NULL,
    purpose ENUM('verification', 'reset-password', 'login') NOT NULL,
    isUsed BOOLEAN DEFAULT FALSE,
    expiresAt DATETIME NOT NULL,
    attempts INT DEFAULT 0,
    maxAttempts INT DEFAULT 3,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_otps_phone (phone, type, purpose),
    INDEX idx_otps_email (email, type, purpose),
    INDEX idx_otps_expires (expiresAt)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_rating ON users(rating);
CREATE INDEX IF NOT EXISTS idx_rides_fare ON rides(fare);
CREATE INDEX IF NOT EXISTS idx_payments_amount ON payments(amount);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(isRead, receiverId);

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (name, phone, email, password, age, gender, isPhoneVerified, isEmailVerified, isSubscribed, subscriptionPlan, subscriptionStatus) 
VALUES (
    'Admin User',
    '+919876543210',
    'admin@linkcab.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O',
    25,
    'male',
    TRUE,
    TRUE,
    TRUE,
    'platinum',
    'active'
);

-- Show table creation status
SHOW TABLES;

-- Show database status
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'linkcab';
