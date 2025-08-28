import express from 'express';
import { check, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Ride from '../models/Ride.js';
import User from '../models/User.js';
import { protect as auth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/review
 * @desc    Create a new review
 * @access  Private
 */
router.post('/', auth, [
  check('revieweeId', 'Reviewee ID is required').isMongoId(),
  check('rideId', 'Ride ID is required').isMongoId(),
  check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('comment', 'Comment cannot exceed 500 characters').optional().isLength({ max: 500 }),
  check('reviewType', 'Review type must be either passenger-to-host or host-to-passenger')
    .isIn(['passenger-to-host', 'host-to-passenger'])
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { revieweeId, rideId, rating, comment, reviewType } = req.body;
    const reviewerId = req.user.id;

    // Prevent self-review
    if (reviewerId === revieweeId) {
      return res.status(400).json({ success: false, message: 'You cannot review yourself' });
    }

    // Check if the ride exists and is completed
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    if (ride.status !== 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'You can only review completed rides' 
      });
    }

    // Verify that the reviewer was part of the ride
    const isHost = ride.hostId.toString() === reviewerId;
    const isPassenger = ride.passengers.some(p => p.user.toString() === reviewerId);

    if (!isHost && !isPassenger) {
      return res.status(403).json({ 
        success: false, 
        message: 'You must be a participant in the ride to leave a review' 
      });
    }

    // Verify that the reviewee was part of the ride
    const revieweeIsHost = ride.hostId.toString() === revieweeId;
    const revieweeIsPassenger = ride.passengers.some(p => p.user.toString() === revieweeId);

    if (!revieweeIsHost && !revieweeIsPassenger) {
      return res.status(400).json({ 
        success: false, 
        message: 'The person you are reviewing must be a participant in the ride' 
      });
    }

    // Verify correct review type
    if (reviewType === 'passenger-to-host' && !revieweeIsHost) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid review type: the reviewee is not the host' 
      });
    }

    if (reviewType === 'host-to-passenger' && !revieweeIsPassenger) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid review type: the reviewee is not a passenger' 
      });
    }

    // Check if a review already exists
    const existingReview = await Review.findOne({
      reviewerId,
      revieweeId,
      rideId
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this user for this ride' 
      });
    }

    // Create the review
    const review = new Review({
      reviewerId,
      revieweeId,
      rideId,
      rating,
      comment,
      reviewType
    });

    await review.save();

    // Update the reviewee's average rating
    const reviewee = await User.findById(revieweeId);
    const allReviews = await Review.find({ revieweeId });
    
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    reviewee.rating = Math.round(averageRating * 100) / 100; // Round to 2 decimal places
    await reviewee.save();

    res.status(201).json({ 
      success: true, 
      message: 'Review submitted successfully',
      data: { review } 
    });
  } catch (error) {
    console.error('Error creating review:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/review/user/:userId
 * @desc    Get reviews for a user
 * @access  Public
 */
router.get('/user/:userId', [
  check('userId', 'Valid user ID is required').isMongoId()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get reviews where the user is the reviewee
    const reviews = await Review.find({ revieweeId: userId })
      .populate('reviewerId', 'name avatar rating')
      .populate('rideId', 'startLocation endLocation dateTime')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count for pagination
    const total = await Review.countDocuments({ revieweeId: userId });

    res.json({ 
      success: true, 
      data: { 
        reviews,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      } 
    });
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/review/ride/:rideId
 * @desc    Get reviews for a ride
 * @access  Public
 */
router.get('/ride/:rideId', [
  check('rideId', 'Valid ride ID is required').isMongoId()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { rideId } = req.params;

    // Validate ride exists
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    // Get all reviews for this ride
    const reviews = await Review.find({ rideId })
      .populate('reviewerId', 'name avatar rating')
      .populate('revieweeId', 'name avatar rating')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { reviews } });
  } catch (error) {
    console.error('Error fetching ride reviews:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;