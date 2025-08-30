import jwt from 'jsonwebtoken';

// Development mode check
const isDevMode = process.env.NODE_ENV !== 'production' && !process.env.DB_HOST;

// Conditional imports for production
let User;
if (!isDevMode) {
  try {
    User = (await import('../models/User.js')).default;
  } catch (error) {
    console.log('⚠️ Could not import User model for auth middleware:', error.message);
  }
}

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Development mode: Accept any token
      if (isDevMode) {
        req.user = {
          _id: 'dev-user-123',
          name: 'John Doe',
          phone: '+1234567890',
          email: 'john.doe@example.com',
          age: 28,
          gender: 'male',
          isPhoneVerified: true,
          rating: 4.8,
          totalRides: 15,
          isSubscribed: false,
          subscription: null,
          bio: 'I love traveling and meeting new people!',
          preferences: {
            smoking: false,
            music: true,
            pets: false
          },
          emergencyContact: {
            name: 'Jane Doe',
            phone: '+1987654321',
            relationship: 'Sister'
          },
          createdAt: new Date().toISOString()
        };
        return next();
      }
      
      // Production mode: Verify token
      if (!User) {
        return res.status(500).json({
          success: false,
          message: 'User model not available'
        });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is not valid. User not found.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication middleware.'
    });
  }
};

// Middleware to check if user is verified
export const requireVerification = async (req, res, next) => {
  try {
    if (!req.user.isPhoneVerified) {
      return res.status(403).json({
        success: false,
        message: 'Phone number must be verified to access this resource.'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in verification middleware.'
    });
  }
};

// Optional auth middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        // Development mode: Create mock user
        if (isDevMode) {
          req.user = {
            _id: 'dev-user-123',
            name: 'John Doe',
            phone: '+1234567890',
            email: 'john.doe@example.com',
            age: 28,
            gender: 'male',
            isPhoneVerified: true,
            rating: 4.8,
            totalRides: 15,
            isSubscribed: false,
            subscription: null,
            bio: 'I love traveling and meeting new people!',
            preferences: {
              smoking: false,
              music: true,
              pets: false
            },
            emergencyContact: {
              name: 'Jane Doe',
              phone: '+1987654321',
              relationship: 'Sister'
            },
            createdAt: new Date().toISOString()
          };
        } else {
          // Production mode
          if (!User) {
            req.user = null;
          } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            req.user = user;
          }
        }
      } catch (error) {
        // Token is invalid, but we don't fail the request
        req.user = null;
      }
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
}; 