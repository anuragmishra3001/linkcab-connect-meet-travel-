import express from 'express';
import { check, validationResult } from 'express-validator';
import Message from '../models/Message.js';
import { protect as auth } from '../middleware/auth.js';
import { requireSubscription } from '../middleware/subscription.js';

const router = express.Router();

/**
 * @route   GET /api/chat/:rideId
 * @desc    Get all messages for a specific ride
 * @access  Private
 */
router.get('/:rideId', auth, requireSubscription, [
  check('rideId', 'Valid ride ID is required').isMongoId()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { rideId } = req.params;
    
    // Get messages for the ride
    const messages = await Message.find({ rideId })
      .sort({ timestamp: 1 })
      .populate('sender', 'name avatar');
    
    res.json({ success: true, data: { messages } });
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   POST /api/chat/:rideId
 * @desc    Send a new message in a ride chat
 * @access  Private
 */
router.post('/:rideId', auth, requireSubscription, [
  check('rideId', 'Valid ride ID is required').isMongoId(),
  check('content', 'Message content is required').notEmpty().trim()
    .isLength({ max: 500 }).withMessage('Message cannot be more than 500 characters')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { rideId } = req.params;
    const { content } = req.body;
    
    // Create a new message
    const newMessage = new Message({
      rideId,
      sender: req.user.id,
      content,
      timestamp: new Date()
    });
    
    // Save message to database
    await newMessage.save();
    
    // Populate sender information
    await newMessage.populate('sender', 'name avatar');
    
    res.json({ success: true, data: { message: newMessage } });
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;