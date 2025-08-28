import express from 'express';
import { check, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Ride from '../models/Ride.js';
import { protect as auth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/ride
 * @desc    Create a new ride
 * @access  Private
 */
router.post('/', auth, [
  check('startLocation', 'Start location is required').isObject(),
  check('startLocation.lat', 'Start location latitude is required').isFloat(),
  check('startLocation.lng', 'Start location longitude is required').isFloat(),
  check('startLocation.address', 'Start location address is required').notEmpty(),
  check('endLocation', 'End location is required').isObject(),
  check('endLocation.lat', 'End location latitude is required').isFloat(),
  check('endLocation.lng', 'End location longitude is required').isFloat(),
  check('endLocation.address', 'End location address is required').notEmpty(),
  check('dateTime', 'Date and time are required').isISO8601(),
  check('seats', 'Seats must be a number between 1 and 10').isInt({ min: 1, max: 10 }),
  check('pricePerSeat', 'Price per seat must be a positive number').isFloat({ min: 0 }),
  check('vehicle.type', 'Vehicle type is required').notEmpty()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const {
      startLocation,
      endLocation,
      dateTime,
      seats,
      pricePerSeat,
      description,
      vehicle,
      preferences
    } = req.body;

    // Create new ride
    const ride = new Ride({
      hostId: req.user.id,
      startLocation,
      endLocation,
      dateTime,
      seats,
      pricePerSeat,
      description,
      vehicle,
      preferences
    });

    // Save ride to database
    await ride.save();

    res.status(201).json({ success: true, data: { ride } });
  } catch (error) {
    console.error('Error creating ride:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/ride
 * @desc    Get all rides
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    const query = {};

    // Add filters if provided
    if (origin) query['startLocation.address'] = new RegExp(origin, 'i');
    if (destination) query['endLocation.address'] = new RegExp(destination, 'i');
    if (date) {
      const searchDate = new Date(date);
      // Set time to beginning of the day
      searchDate.setHours(0, 0, 0, 0);
      
      // Find rides on or after the specified date
      query.dateTime = { $gte: searchDate };
    }

    // Only show active rides
    query.status = 'active';

    // Get rides
    const rides = await Ride.find(query)
      .populate('hostId', 'name rating avatar')
      .sort({ dateTime: 1 })
      .limit(20);

    res.json({ success: true, data: { rides } });
  } catch (error) {
    console.error('Error fetching rides:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/ride/:id
 * @desc    Get ride by ID
 * @access  Public
 */
router.get('/:id', [
  check('id', 'Valid ride ID is required').isMongoId()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const ride = await Ride.findById(req.params.id)
      .populate('hostId', 'name rating totalRides avatar')
      .populate('passengers.user', 'name avatar');

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    res.json({ success: true, data: { ride } });
  } catch (error) {
    console.error('Error fetching ride:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   POST /api/ride/:id/book
 * @desc    Book a ride
 * @access  Private
 */
router.post('/:id/book', auth, [
  check('id', 'Valid ride ID is required').isMongoId(),
  check('seats', 'Seats must be a number between 1 and 10').isInt({ min: 1, max: 10 })
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { seats } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    // Check if ride is active
    if (ride.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Ride is not active' });
    }

    // Check if user is trying to book their own ride
    if (ride.hostId.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot book your own ride' });
    }

    // Check if user has already booked this ride
    const existingBooking = ride.passengers.find(
      passenger => passenger.user.toString() === req.user.id
    );

    if (existingBooking) {
      return res.status(400).json({ success: false, message: 'You have already booked this ride' });
    }

    // Check if there are enough seats available
    const bookedSeats = ride.passengers.reduce((total, passenger) => total + passenger.seats, 0);
    const availableSeats = ride.seats - bookedSeats;

    if (seats > availableSeats) {
      return res.status(400).json({
        success: false,
        message: `Not enough seats available. Only ${availableSeats} seats left`
      });
    }

    // Check gender preference if applicable
    if (ride.preferences.genderPreference !== 'any') {
      const user = await mongoose.model('User').findById(req.user.id);
      if (user.gender && user.gender !== ride.preferences.genderPreference) {
        return res.status(400).json({
          success: false,
          message: `This ride is only available for ${ride.preferences.genderPreference} passengers`
        });
      }
    }

    // Add passenger to ride
    ride.passengers.push({
      user: req.user.id,
      seats,
      status: 'pending'
    });

    // Save ride
    await ride.save();

    // Populate passenger info
    await ride.populate('passengers.user', 'name avatar');

    res.json({ success: true, data: { ride } });
  } catch (error) {
    console.error('Error booking ride:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   PATCH /api/ride/:id/complete
 * @desc    Mark a ride as completed
 * @access  Private (host only)
 */
router.patch('/:id/complete', auth, [
  check('id', 'Valid ride ID is required').isMongoId()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    // Check if user is the host of the ride
    if (ride.hostId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the host can complete this ride' });
    }

    // Check if ride is already completed or cancelled
    if (ride.status !== 'active') {
      return res.status(400).json({ success: false, message: `Ride is already ${ride.status}` });
    }

    // Update ride status to completed
    ride.status = 'completed';
    await ride.save();

    // Populate passenger info
    await ride.populate('passengers.user', 'name avatar');

    res.json({ 
      success: true, 
      message: 'Ride marked as completed',
      data: { ride } 
    });
  } catch (error) {
    console.error('Error completing ride:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;