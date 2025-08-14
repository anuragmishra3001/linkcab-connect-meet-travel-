# LinkCab - Full-Stack Ride-Sharing Platform

A complete ride-sharing platform built with React frontend and Node.js backend, featuring mobile OTP authentication, JWT tokens, and MongoDB integration.

## 🚀 Features

### Frontend (React + Vite + Tailwind)
- 📱 **Mobile-First Design** - Responsive UI that works on all devices
- 🔐 **JWT Authentication** - Secure token-based authentication
- 📞 **Phone OTP Verification** - Mock OTP system for phone verification
- 👤 **User Profiles** - Complete profile management with ratings
- 🛣️ **Client-Side Routing** - React Router for seamless navigation
- 🎨 **Modern UI** - Clean design with Tailwind CSS and gradients

### Backend (Node.js + Express + MongoDB)
- 🔒 **JWT Authentication** - Secure token generation and validation
- 📱 **OTP System** - Mock phone verification with expiration
- 👤 **User Management** - Complete user CRUD operations
- ⭐ **Rating System** - User rating and review functionality
- 🛡️ **Security** - Input validation, rate limiting, and CORS
- 📊 **MongoDB Integration** - NoSQL database with Mongoose ODM

## 🛠️ Tech Stack

### Frontend
- **React 18** - Latest React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Socket.io** - Real-time communication
- **express-rate-limit** - API rate limiting
- **axios** - HTTP client for API requests
- **dotenv** - Environment variable management

## 📁 Project Structure

```
linkcab/
├── src/                    # React frontend
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── context/          # React context (AuthContext)
│   ├── services/         # API services
│   └── ...
├── backend/               # Node.js backend
│   ├── config/           # Database configuration
│   ├── middleware/       # Express middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── package.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn
- Git (for version control and deployment)

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   Navigate to `http://localhost:5173`

### Backend Setup

1. **Navigate to backend directory**
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
   
   Edit `.env` file:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/linkcab

   # JWT Secret
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=30d

   # Rate Limiting
   RATE_LIMIT_WINDOW=900000  # 15 minutes in milliseconds
   RATE_LIMIT_MAX=100        # Maximum 100 requests per window

   # Stripe Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
   FRONTEND_URL=http://localhost:5173

   # OpenAI API Configuration
   OPENAI_API_KEY=your_openai_api_key_here

   # SMS Service (for OTP)
   SMS_API_KEY=your_sms_api_key_here

   # Email Service
   EMAIL_SERVICE=smtp
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email_username
   EMAIL_PASS=your_email_password
   EMAIL_FROM=noreply@linkcab.com
   ```

4. **MongoDB Setup**
   - **Verify MongoDB Installation**
     ```bash
     # Check MongoDB version
     mongod --version
     ```
   
   - **Start MongoDB Service** (if using local instance)
     ```bash
     # Windows
     # Check if MongoDB service is running
     Get-Service -Name MongoDB* | Select-Object Name, Status
     
     # Start MongoDB service if not running
     Start-Service -Name MongoDB
     
     # macOS/Linux
     sudo systemctl start mongod
     ```
   
   - **Verify MongoDB Connection**
     ```bash
     # Connect to MongoDB shell
     mongosh
     
     # Test connection
     db.runCommand({ ping: 1 })
     
     # Create and use linkcab database
     use linkcab
     db.test.insertOne({name: 'test', value: 'test'})
     
     # Verify database creation
     show dbs
     ```

5. **Start backend server**
   ```bash
   npm run dev
   ```

6. **Verify API is running**
   Navigate to `http://localhost:5000/api/health`

## 📱 Authentication Flow

### Signup Process
1. User fills out registration form
2. System sends OTP to phone number
3. User verifies OTP
4. Account is created with JWT token
5. User is redirected to home page

### Login Process
1. User enters phone and password
2. System validates credentials
3. JWT token is generated
4. User is authenticated and redirected

## 🚀 Deployment

For detailed deployment instructions, please refer to the [DEPLOYMENT.md](./DEPLOYMENT.md) file.

### GitHub Deployment

```bash
# Initialize git repository
git init

# Add all files to git
git add .

# Commit the changes
git commit -m "Initial commit"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/linkcab.git

# Push to GitHub
git push -u origin main
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
3. Add environment variables
4. Deploy

### Phone Verification
- OTP codes are logged to console (mock implementation)
- 6-digit codes expire after 5 minutes
- Maximum 3 attempts per OTP
- Auto-deletion of expired OTPs

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify phone (requires auth)
- `GET /api/auth/me` - Get current user

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `GET /api/profile/:userId` - Get public profile
- `POST /api/profile/rate` - Rate a user
- `GET /api/profile/stats` - Get user statistics
- `DELETE /api/profile` - Delete account

### Health Check
- `GET /api/health` - API health status

## 👤 User Model

```javascript
{
  name: String,           // Required
  phone: String,          // Required, unique
  email: String,          // Required, unique
  password: String,       // Required, hashed
  age: Number,           // Required, 18-100
  gender: String,        // male, female, other, prefer-not-to-say
  rating: Number,        // 0-5, default 0
  totalRides: Number,    // Default 0
  isPhoneVerified: Boolean, // Default false
  isEmailVerified: Boolean, // Default false
  bio: String,           // Max 200 chars
  preferences: {
    smoking: Boolean,
    music: Boolean,
    pets: Boolean
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
}
```

## 🎨 Frontend Components

### Pages
- **Home** - Landing page with hero section
- **Login** - Phone-based authentication
- **Signup** - Multi-step registration with OTP
- **Profile** - User profile management
- **CreateRide** - Ride creation form
- **RideDetail** - Ride information display

### Components
- **Header** - Navigation with auth status
- **Button** - Reusable button with variants
- **Card** - Content container component
- **AuthContext** - Authentication state management

## 🔒 Security Features

- **Password Hashing** - bcryptjs with salt rounds
- **JWT Tokens** - Secure authentication
- **Input Validation** - express-validator
- **Rate Limiting** - Prevents abuse
- **CORS** - Cross-origin protection
- **Helmet** - Security headers
- **Environment Variables** - Sensitive data protection

## 🧪 Testing the Application

### MongoDB Connection Troubleshooting

1. **Verify MongoDB Service**
   ```bash
   # Windows
   Get-Service -Name MongoDB* | Select-Object Name, Status
   
   # macOS/Linux
   sudo systemctl status mongod
   ```

2. **Test MongoDB Connection**
   ```bash
   # Connect to MongoDB shell
   mongosh
   
   # Test connection with ping command
   db.runCommand({ ping: 1 })
   ```

3. **Create and Verify Database**
   ```bash
   # Switch to linkcab database
   use linkcab
   
   # Insert test document to create database
   db.test.insertOne({name: 'test', value: 'test'})
   
   # List all databases to verify creation
   show dbs
   
   # Find documents in test collection
   db.test.find()
   ```

4. **Common Issues**
   - **Connection Refused**: Ensure MongoDB service is running
   - **Authentication Failed**: Check credentials in connection string
   - **Database Not Listed**: MongoDB only shows databases with data
   - **Permission Denied**: Check user permissions

### Mock OTP Testing
1. Start the backend server
2. Try to signup with a phone number
3. Check the console logs for the OTP code
4. Use the displayed OTP to verify

### Sample User Data
```javascript
{
  name: "John Doe",
  phone: "+1234567890",
  email: "john@example.com",
  password: "password123",
  age: 25,
  gender: "male"
}
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables for API URL

### Backend (Heroku/Railway)
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy to your preferred platform

### Environment Variables for Production
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Connection
# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkcab
# For local MongoDB
# MONGODB_URI=mongodb://localhost:27017/linkcab

# JWT Secret
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRE=30d

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
FRONTEND_URL=https://yourdomain.com

# Additional services
# Configure as needed for production
```

## 🔧 Development Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

## 🛠️ Development Environment Tips

### Using Git Bash on Windows

If you encounter PowerShell execution policy restrictions when running npm commands, Git Bash provides a Unix-like environment that can help bypass these issues:

1. **Install Git Bash** if not already installed (comes with Git for Windows)

2. **Open Git Bash** in your project directory

3. **Navigate to backend directory**
   ```bash
   cd backend
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start the server**
   ```bash
   npm run dev
   # or
   node server.js
   ```

6. **MongoDB commands in Git Bash**
   ```bash
   # Connect to MongoDB
   mongosh
   
   # Test connection
   db.runCommand({ ping: 1 })
   
   # Create database
   use linkcab
   db.test.insertOne({name: 'test', value: 'test'})
   ```

Git Bash is particularly useful for Node.js development on Windows as it provides a consistent command-line experience across operating systems and avoids PowerShell's execution policy restrictions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation in `backend/README.md`
- Review the frontend setup in this README
- Open an issue for bugs or feature requests

## 🔮 Future Enhancements

- Real SMS integration for OTP
- Email verification
- Push notifications
- Real-time chat
- Payment integration
- Ride tracking
- Driver verification
- Advanced search and filters