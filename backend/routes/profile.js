import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, requireVerification } from '../middleware/auth.js';

const router = express.Router();

// Development mode check
const isDevMode = process.env.NODE_ENV !== 'production' && !process.env.DB_HOST;

// Conditional imports for production
let User;
if (!isDevMode) {
  try {
    User = (await import('../models/User.js')).default;
  } catch (error) {
    console.log('⚠️ Could not import User model:', error.message);
  }
}

// Validation middleware
const validateProfileUpdate = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('age').optional().isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender selection'),
  body('bio').optional().trim().isLength({ max: 200 }).withMessage('Bio cannot be more than 200 characters'),
  body('preferences.smoking').optional().isBoolean().withMessage('Smoking preference must be boolean'),
  body('preferences.music').optional().isBoolean().withMessage('Music preference must be boolean'),
  body('preferences.pets').optional().isBoolean().withMessage('Pets preference must be boolean'),
  body('emergencyContact.name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Emergency contact name must be between 2 and 50 characters'),
  body('emergencyContact.phone').optional().matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please enter a valid emergency contact phone number'),
  body('emergencyContact.relationship').optional().trim().isLength({ min: 2, max: 30 }).withMessage('Relationship must be between 2 and 30 characters')
];

const validateRating = [
  body('rating').isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  body('userId').isMongoId().withMessage('Invalid user ID')
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

// @route   GET /api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Development mode: Mock profile
    if (isDevMode) {
      const mockUser = {
        _id: req.user._id || 'dev-user-123',
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
      
      return res.json({
        success: true,
        data: {
          user: mockUser
        }
      });
    }

    // Production mode
    if (!User) {
      return res.status(500).json({
        success: false,
        message: 'Database model not available'
      });
    }

    const user = await User.findById(req.user._id).select('-password');
    
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
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving profile'
    });
  }
});

// @route   PUT /api/profile
// @desc    Update current user's profile
// @access  Private
router.put('/', protect, validateProfileUpdate, handleValidationErrors, async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      bio,
      preferences,
      emergencyContact
    } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (bio !== undefined) user.bio = bio;
    if (preferences) {
      if (preferences.smoking !== undefined) user.preferences.smoking = preferences.smoking;
      if (preferences.music !== undefined) user.preferences.music = preferences.music;
      if (preferences.pets !== undefined) user.preferences.pets = preferences.pets;
    }
    if (emergencyContact) {
      if (emergencyContact.name) user.emergencyContact.name = emergencyContact.name;
      if (emergencyContact.phone) user.emergencyContact.phone = emergencyContact.phone;
      if (emergencyContact.relationship) user.emergencyContact.relationship = emergencyContact.relationship;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// @route   GET /api/profile/:userId
// @desc    Get public profile of a user
// @access  Public
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password -email -phone -emergencyContact');
    
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
    console.error('Error getting public profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving profile'
    });
  }
});

// @route   POST /api/profile/rate
// @desc    Rate a user
// @access  Private
router.post('/rate', protect, requireVerification, validateRating, handleValidationErrors, async (req, res) => {
  try {
    const { rating, userId } = req.body;
    const raterId = req.user._id;

    // Prevent self-rating
    if (raterId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rate yourself'
      });
    }

    const userToRate = await User.findById(userId);
    
    if (!userToRate) {
      return res.status(404).json({
        success: false,
        message: 'User to rate not found'
      });
    }

    // In a real application, you would store individual ratings in a separate collection
    // For now, we'll update the average rating directly
    const currentTotalRating = userToRate.rating * userToRate.totalRides;
    const newTotalRating = currentTotalRating + rating;
    const newTotalRides = userToRate.totalRides + 1;
    const newAverageRating = newTotalRating / newTotalRides;

    userToRate.rating = Math.round(newAverageRating * 100) / 100; // Round to 2 decimal places
    userToRate.totalRides = newTotalRides;

    await userToRate.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        user: userToRate.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Error rating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting rating'
    });
  }
});

// @route   DELETE /api/profile
// @desc    Delete current user's account
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account'
    });
  }
});

// @route   GET /api/profile/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('rating totalRides createdAt');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const stats = {
      rating: user.rating,
      totalRides: user.totalRides,
      memberSince: user.createdAt,
      verificationStatus: {
        phone: user.isPhoneVerified,
        email: user.isEmailVerified
      }
    };

    res.json({
      success: true,
      data: {
        stats
      }
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving statistics'
    });
  }
});

export default router; 