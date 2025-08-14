# LinkCab Backend API

A Node.js/Express backend API for the LinkCab ride-sharing application with MongoDB, JWT authentication, and phone OTP verification.

## Features

- 🔐 JWT Authentication
- 📱 Phone OTP Verification (Mock)
- 👤 User Profile Management
- ⭐ User Rating System
- 🛡️ Security Middleware (Helmet, Rate Limiting)
- ✅ Input Validation
- 📊 MongoDB Integration
- 🔒 Password Hashing with bcrypt

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Environment**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/linkcab
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   OTP_SECRET=your-otp-secret-key
   OTP_EXPIRE=300000
   ```

4. **Start MongoDB** (if using local instance)
   ```bash
   # On Windows
   mongod
   
   # On macOS/Linux
   sudo systemctl start mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## Deployment

### Deploying to Vercel

The backend can be deployed to Vercel as a serverless Node.js application:

1. **Ensure your MongoDB is accessible from the internet**
   - Use MongoDB Atlas for cloud hosting
   - Update your connection string in environment variables

2. **Configure environment variables in Vercel**
   - Add all variables from your `.env` file to Vercel project settings

3. **Deploy using the Vercel CLI or GitHub integration**
   ```bash
   # Using Vercel CLI
   vercel
   ```

4. **Update CORS settings**
   - Make sure to update CORS settings to allow requests from your deployed frontend URL

### Deploying to Other Platforms

This backend can also be deployed to other platforms like Heroku, AWS, or DigitalOcean:

1. **Prepare for production**
   ```bash
   # Install PM2 globally for process management
   npm install -g pm2
   
   # Start with PM2
   pm2 start server.js --name linkcab-api
   ```

2. **Set up environment variables**
   - Configure all required environment variables on your hosting platform

3. **Configure reverse proxy (if needed)**
   - Set up Nginx or Apache as a reverse proxy to your Node.js application

## API Endpoints

### Authentication

#### POST `/api/auth/send-otp`
Send OTP to phone number for verification.

**Request Body:**
```json
{
  "phone": "+1234567890",
  "purpose": "signup" // or "login", "password-reset"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phone": "+1234567890",
    "purpose": "signup",
    "expiresIn": 300000
  }
}
```

#### POST `/api/auth/verify-otp`
Verify OTP code.

**Request Body:**
```json
{
  "phone": "+1234567890",
  "otp": "123456",
  "purpose": "signup"
}
```

#### POST `/api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "password": "password123",
  "age": 25,
  "gender": "male"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "phone": "+1234567890",
      "email": "john@example.com",
      "age": 25,
      "gender": "male",
      "rating": 0,
      "totalRides": 0,
      "isPhoneVerified": false,
      "isEmailVerified": false
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
Login user with phone and password.

**Request Body:**
```json
{
  "phone": "+1234567890",
  "password": "password123"
}
```

#### POST `/api/auth/verify`
Verify phone number with OTP (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "otp": "123456"
}
```

#### GET `/api/auth/me`
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Profile Management

#### GET `/api/profile`
Get current user's profile (requires authentication).

#### PUT `/api/profile`
Update current user's profile (requires authentication).

**Request Body:**
```json
{
  "name": "John Doe",
  "age": 26,
  "gender": "male",
  "bio": "Friendly driver who loves music",
  "preferences": {
    "smoking": false,
    "music": true,
    "pets": false
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+1987654321",
    "relationship": "Spouse"
  }
}
```

#### GET `/api/profile/:userId`
Get public profile of a user.

#### POST `/api/profile/rate`
Rate a user (requires authentication and phone verification).

**Request Body:**
```json
{
  "rating": 4.5,
  "userId": "user_id_to_rate"
}
```

#### GET `/api/profile/stats`
Get user statistics (requires authentication).

#### DELETE `/api/profile`
Delete current user's account (requires authentication).

### Health Check

#### GET `/api/health`
Check API health status.

**Response:**
```json
{
  "status": "OK",
  "message": "LinkCab API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Database Models

### User Model
- `name`: String (required)
- `phone`: String (required, unique)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `age`: Number (required, 18-100)
- `gender`: String (enum: male, female, other, prefer-not-to-say)
- `rating`: Number (default: 0, 0-5)
- `totalRides`: Number (default: 0)
- `isPhoneVerified`: Boolean (default: false)
- `isEmailVerified`: Boolean (default: false)
- `profilePicture`: String (optional)
- `bio`: String (max 200 chars)
- `preferences`: Object (smoking, music, pets)
- `emergencyContact`: Object (name, phone, relationship)
- `createdAt`: Date
- `updatedAt`: Date

### OTP Model
- `phone`: String (required)
- `otp`: String (required, 6 digits)
- `purpose`: String (enum: signup, login, password-reset)
- `isUsed`: Boolean (default: false)
- `expiresAt`: Date (required, auto-delete)
- `attempts`: Number (default: 0, max: 3)
- `createdAt`: Date

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: express-validator for all inputs
- **Rate Limiting**: Prevents abuse
- **CORS**: Configured for frontend domains
- **Helmet**: Security headers
- **Environment Variables**: Sensitive data protection

## Development

### Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests (not implemented yet)

### Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRE`: JWT expiration time
- `OTP_SECRET`: Secret key for OTP generation
- `OTP_EXPIRE`: OTP expiration time in milliseconds

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors (if any)
}
```

## Mock OTP Implementation

For development, OTP codes are logged to the console instead of being sent via SMS. Check the server logs to see the generated OTP codes.

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production MongoDB instance
4. Set up proper CORS origins
5. Use environment variables for all sensitive data
6. Implement real SMS service for OTP delivery

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License