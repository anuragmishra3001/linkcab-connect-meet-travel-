# 🚧 Development Mode Setup

This project now includes a comprehensive development mode that allows you to test all features without requiring a backend server.

## 🎯 Features

### ✅ What's Included
- **Mock Authentication**: Auto-login with test user data
- **Mock API Responses**: All API calls return realistic mock data
- **Mock Socket Connections**: Real-time features work with simulated connections
- **Sample Data**: Pre-populated rides, messages, users, and reviews
- **Mock Payments**: Razorpay integration works with test data
- **Development Indicator**: Visual banner showing development mode is active

### 🧪 Test Data Available
- **3 Mock Users**: John Doe, Sarah Wilson, Mike Johnson
- **3 Sample Rides**: Various routes with different preferences
- **Sample Messages**: Chat history for testing messaging features
- **Mock Reviews**: User ratings and feedback
- **Payment History**: Sample transactions

## 🚀 Quick Start

### Option 1: Development Mode is Already Enabled
The project is currently configured with development mode enabled. Simply run:

```bash
npm run dev
```

Visit `http://localhost:5173` and you'll see:
- Yellow development mode banner at the top
- Auto-logged in as "John Doe" (test user)
- All features working with mock data

### Option 2: Toggle Development Mode
Use the provided scripts to enable/disable development mode:

```bash
# Enable development mode
node enable-dev-mode.js

# Disable development mode (use real backend)
node disable-dev-mode.js
```

## 🧪 Testing Features

### 1. Authentication
- **Login**: Use any phone number and password - it will work
- **Signup**: Create new users with any data
- **OTP Verification**: Any OTP code will be accepted

### 2. Rides
- **Browse Rides**: See 3 sample rides with different routes
- **Create Ride**: Add new rides (stored in memory)
- **Book Rides**: Book available seats
- **Search/Filter**: Test ride filtering functionality

### 3. Messaging
- **Chat**: Send messages in ride chat rooms
- **Real-time**: Messages appear instantly (simulated)
- **Message History**: See sample conversation history

### 4. Payments
- **Razorpay Integration**: Test payment flow
- **Order Creation**: Generate test payment orders
- **Payment Verification**: Simulate successful payments

### 5. Profile & Reviews
- **User Profiles**: View and edit user information
- **Ratings**: Submit and view user reviews
- **Statistics**: See mock user stats

## 🔧 Development Test Page

Visit `/dev-test` to see:
- Current user information
- API test results
- Mock data display
- Development mode status

## 📁 Files Modified/Created

### New Files:
- `src/services/mockData.js` - Sample data for all features
- `src/services/mockAPI.js` - Mock API responses
- `src/components/DevModeIndicator.jsx` - Development mode banner
- `src/pages/DevTest.jsx` - Test page for development features
- `enable-dev-mode.js` - Script to enable development mode
- `disable-dev-mode.js` - Script to disable development mode

### Modified Files:
- `src/context/AuthContext.jsx` - Added development mode support
- `src/services/api.js` - Routes API calls to mock services
- `src/context/SocketContext.jsx` - Mock socket connections
- `src/App.jsx` - Added development mode indicator and test route

## 🎮 How to Use

### 1. Start the Application
```bash
npm run dev
```

### 2. You're Automatically Logged In
- User: John Doe
- Email: john.doe@example.com
- Phone: +1234567890
- Rating: 4.8/5

### 3. Test All Features
- **Dashboard**: View your profile and stats
- **Create Ride**: Add a new ride offer
- **Browse Rides**: See available rides
- **Messages**: Chat with other users
- **Profile**: Edit your information
- **Payments**: Test payment flows

### 4. Development Test Page
Visit `http://localhost:5173/dev-test` to:
- See API test results
- View mock data
- Verify development mode is working

## 🔄 Switching Between Modes

### Development Mode (Current)
- ✅ No backend required
- ✅ Mock data and responses
- ✅ All features work
- ✅ Perfect for frontend testing

### Production Mode
- 🔗 Requires backend server
- 🔗 Real API calls
- 🔗 Real database
- 🔗 Real authentication

## 🐛 Troubleshooting

### Development Mode Not Working?
1. Check the yellow banner is visible at the top
2. Visit `/dev-test` to see status
3. Check browser console for `[DEV MODE]` logs
4. Run `node enable-dev-mode.js` to ensure it's enabled

### Want to Test with Real Backend?
1. Run `node disable-dev-mode.js`
2. Start your backend server
3. Update environment variables
4. Restart the frontend

## 📝 Notes

- Development mode is currently **ENABLED**
- All mock data is stored in memory (resets on page refresh)
- Socket connections are simulated (no real-time updates)
- Payments use test Razorpay keys
- Perfect for UI/UX testing and development

## 🎉 Ready to Test!

Your LinkCab application is now ready for development and testing without any backend setup. All features work with realistic mock data, allowing you to focus on frontend development and user experience.
