import express from 'express';
import { body, validationResult } from 'express-validator';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Import models
import User from '../models/User.js';
import OTP from '../models/OTP.js';

// Validation middleware
const validateSignup = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please enter a valid phone number'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
  body('gender').isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender selection')
];

const validateLogin = [
  body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please enter a valid phone number'),
  body('password').notEmpty().withMessage('Password is required')
];

const validateOTP = [
  body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please enter a valid phone number'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// @route   POST /api/auth/send-otp
// @desc    Send OTP to phone number
// @access  Public
router.post('/send-otp', 
  body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please enter a valid phone number'),
  body('purpose').optional().isIn(['signup', 'login', 'password-reset']).withMessage('Invalid purpose'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { phone, purpose = 'signup' } = req.body;

      // Check if user exists for signup
      if (purpose === 'signup') {
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'User with this phone number already exists'
          });
        }
      }

      // Check if user exists for login
      if (purpose === 'login') {
        const existingUser = await User.findOne({ phone });
        if (!existingUser) {
          return res.status(400).json({
            success: false,
            message: 'User with this phone number does not exist'
          });
        }
      }

      // Generate and save OTP
      const otpDoc = await OTP.createOTP(phone, purpose);

      // In a real application, you would send this OTP via SMS
      // For now, we'll return it in the response (mock implementation)
      console.log(`📱 OTP for ${phone}: ${otpDoc.otp}`);

      res.json({
        success: true,
        message: 'OTP sent successfully',
        data: {
          phone,
          purpose,
          expiresIn: parseInt(process.env.OTP_EXPIRE) || 300000 // 5 minutes
        }
      });

    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending OTP'
      });
    }
  }
);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP
// @access  Public
router.post('/verify-otp', validateOTP, handleValidationErrors, async (req, res) => {
  try {
    const { phone, otp, purpose = 'signup' } = req.body;

    // Verify OTP
    await OTP.verifyOTP(phone, otp, purpose);

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', validateSignup, handleValidationErrors, async (req, res) => {
  try {
    const { name, phone, email, password, age, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'User with this email already exists' 
          : 'User with this phone number already exists'
      });
    }

    // Create new user
    const user = new User({
      name,
      phone,
      email,
      password,
      age,
      gender
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });

  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find user by phone
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });

  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login'
    });
  }
});

// @route   POST /api/auth/verify
// @desc    Verify phone number with OTP
// @access  Private
router.post('/verify', 
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { otp } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify OTP
      await OTP.verifyOTP(user.phone, otp, 'signup');

      // Mark phone as verified
      user.isPhoneVerified = true;
      await user.save();

      res.json({
        success: true,
        message: 'Phone number verified successfully',
        data: {
          user: user.getPublicProfile()
        }
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user data'
    });
  }
});

export default router; 