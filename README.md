# LinkCab - Full-Stack Ride-Sharing Platform

A complete ride-sharing platform built with React frontend and Node.js backend, featuring mobile OTP authentication, JWT tokens, MongoDB integration, modern animated UI components, and **enterprise-grade crash prevention**.

## 🚀 Features

### Frontend (React + Vite + Tailwind + Framer Motion)
- 📱 **Mobile-First Design** - Responsive UI that works on all devices
- 🔐 **JWT Authentication** - Secure token-based authentication
- 📞 **Phone OTP Verification** - Mock OTP system for phone verification
- 👤 **User Profiles** - Complete profile management with ratings
- 🛣️ **Client-Side Routing** - React Router for seamless navigation
- 🎨 **Modern Animated UI** - Advanced animations with Framer Motion
- 🌟 **Modern Graphics Components** - Reusable animated UI components
- 🗺️ **Google Maps Integration** - Location services and mapping
- 💬 **Real-time Chat** - Socket.io based messaging system
- 📊 **Advanced Analytics** - User statistics and ride tracking
- 🎯 **Smart Matching** - AI-powered ride matching system
- 💳 **Payment Integration** - Razorpay payment processing
- ⭐ **Review System** - User ratings and testimonials
- 🔔 **Real-time Notifications** - Live updates and alerts

### Backend (Node.js + Express + MongoDB)
- 🔒 **JWT Authentication** - Secure token generation and validation
- 📱 **OTP System** - Mock phone verification with expiration
- 👤 **User Management** - Complete user CRUD operations
- ⭐ **Rating System** - User rating and review functionality
- 🛡️ **Security** - Input validation, rate limiting, and CORS
- 📊 **MongoDB Integration** - NoSQL database with Mongoose ODM
- 💳 **Payment Processing** - Razorpay integration
- 🤖 **AI Integration** - OpenAI API for smart features
- 📧 **Email Services** - SMTP email functionality
- 📱 **SMS Services** - OTP delivery system

### 🛡️ **Enterprise Stability & Crash Prevention**
- 🚨 **Graceful Shutdown** - Proper cleanup on Railway restarts
- 🔄 **Auto-Reconnection** - MongoDB connection recovery
- 💾 **Memory Management** - Optimized upload limits and monitoring
- 🛡️ **Error Handling** - Global error handlers that prevent crashes
- 📊 **Health Monitoring** - Real-time memory and connection monitoring
- 🔌 **Connection Pooling** - Optimized database connections
- ⚡ **Rate Limiting** - Production-ready API throttling
- 🚀 **Railway Optimized** - Built for cloud deployment stability

## 🛠️ Tech Stack

### Frontend
- **React 18** - Latest React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Advanced animations and transitions
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management
- **Socket.io Client** - Real-time communication
- **Razorpay** - Payment processing

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
- **Razorpay** - Payment gateway integration
- **OpenAI** - AI-powered features

## 📁 Project Structure

```
linkcab/
├── src/                    # React frontend
│   ├── components/        # Reusable UI components
│   │   ├── ModernGraphics.jsx    # Advanced animated components
│   │   ├── Header.jsx           # Navigation header
│   │   ├── Footer.jsx           # Site footer
│   │   ├── Button.jsx           # Reusable buttons
│   │   ├── Card.jsx             # Content containers
│   │   ├── Chat.jsx             # Real-time chat
│   │   ├── MapPicker.jsx        # Google Maps integration
│   │   ├── RideSearch.jsx       # Ride search functionality
│   │   ├── ReviewForm.jsx       # User reviews
│   │   ├── Testimonials.jsx     # User testimonials
│   │   └── ...                  # Other components
│   ├── pages/            # Page components
│   ├── context/          # React context (AuthContext)
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   └── config/           # Configuration files
├── backend/               # Node.js backend
│   ├── config/           # Database configuration with crash prevention
│   ├── middleware/       # Express middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── server.js        # Enhanced server with stability features
│   ├── env.railway      # Railway production environment
│   ├── deploy-railway.bat # Automated Railway deployment
│   ├── test-connection.js # Database connection testing
│   └── package.json
└── package.json
```

## 🛡️ Stability & Monitoring

### Health Check Endpoint
```bash
GET /api/health
```
Returns comprehensive system status including:
- Server uptime
- Memory usage
- Database connection status
- Environment information

### Memory Management
- **Upload Limits**: Reduced to 5MB to prevent memory issues
- **Connection Pooling**: Limited to 10 concurrent database connections
- **Auto-Cleanup**: Automatic cleanup of idle connections
- **Monitoring**: Real-time memory usage alerts

### Database Stability
- **Auto-Reconnection**: Automatic MongoDB reconnection on failures
- **Connection Pooling**: Optimized connection management
- **Timeout Handling**: Configurable connection timeouts
- **Health Monitoring**: Continuous connection state monitoring

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/yourusername/linkcab-connect-meet-travel--master.git
cd linkcab-connect-meet-travel--master
npm install
cd backend && npm install
```

### 2. Environment Setup
```bash
# Backend environment
cd backend
cp env.example .env
# Edit .env with your MongoDB connection string
```

### 3. Test Database Connection
```bash
cd backend
node test-connection.js
```

### 4. Start Development
```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
npm run dev
```

### 5. Deploy to Railway
```bash
cd backend
.\deploy-railway.bat
```

## 🔧 Configuration

### MongoDB Atlas Setup
1. Create MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in environment variables
4. Test connection with `node test-connection.js`

### Railway Deployment
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Link project: `railway link`
4. Set environment variables
5. Deploy: `railway up`

## 📊 Performance & Monitoring

### Production Metrics
- **Memory Usage**: Optimized for Railway's 512MB limit
- **Connection Pool**: 10 concurrent database connections
- **Rate Limiting**: 50 requests per 15 minutes per IP
- **Health Checks**: Every 30 seconds for database, every minute for memory

### Stability Features
- **Graceful Shutdown**: Proper cleanup on SIGTERM/SIGINT
- **Error Recovery**: Automatic recovery from most errors
- **Connection Resilience**: MongoDB connection failover
- **Memory Protection**: Upload limits and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including crash scenarios)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the deployment guides in the project
- Review Railway-specific documentation

---

**Built with ❤️ for stable, production-ready ride-sharing applications**