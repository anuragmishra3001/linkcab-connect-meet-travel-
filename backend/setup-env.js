const fs = require('fs');
const path = require('path');

// MongoDB Atlas connection string template
const envContent = `# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://anuragmishra3002:YOUR_ACTUAL_PASSWORD@cluster0.kkzllaj.mongodb.net/linkcab?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=LinkCab_Super_Secret_JWT_Key_2024!
JWT_EXPIRE=7d

# OTP Configuration
OTP_SECRET=LinkCab_OTP_Secret_Key_12345
OTP_EXPIRE=300000

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Razorpay Configuration (add your keys when ready)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
`;

// Create .env file
const envPath = path.join(__dirname, '.env');
fs.writeFileSync(envPath, envContent);

console.log('✅ .env file created successfully!');
console.log('');
console.log('🔐 IMPORTANT: You need to replace YOUR_ACTUAL_PASSWORD with your real MongoDB Atlas password');
console.log('');
console.log('📋 To get your password:');
console.log('1. Go to https://cloud.mongodb.com/');
console.log('2. Sign in to your account');
console.log('3. Go to Database Access');
console.log('4. Find user "anuragmishra3002"');
console.log('5. Click Edit → Edit Password');
console.log('6. Set a new password and copy it');
console.log('7. Replace YOUR_ACTUAL_PASSWORD in the .env file');
console.log('');
console.log('🚀 After updating the password, run: npm start');
