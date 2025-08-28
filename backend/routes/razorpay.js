import express from 'express';
import { check, validationResult } from 'express-validator';
import { protect as auth } from '../middleware/auth.js';
import razorpay, { PAYMENT_STATUS, CURRENCY_CONFIG } from '../config/razorpay.js';
import Payment from '../models/Payment.js';
import crypto from 'crypto';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route   POST /api/payment/razorpay/create-order
 * @desc    Create a Razorpay order
 * @access  Private
 */
router.post('/create-order', auth, [
  check('amount', 'Amount is required and must be a positive number').isFloat({ min: 1 }),
  check('currency', 'Currency is required').isString(),
  check('description', 'Description is required').isString(),
  check('customerName', 'Customer name is required').isString(),
  check('customerEmail', 'Customer email is required').isEmail()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const {
      amount,
      currency = 'INR',
      description,
      customerName,
      customerEmail,
      customerPhone,
      planId,
      planName,
      rideId,
      seats,
      metadata = {}
    } = req.body;

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      receipt: orderId,
      notes: {
        userId: req.user.id,
        planId: planId,
        rideId: rideId,
        ...metadata
      }
    });

    // Create payment record in database
    const payment = new Payment({
      userId: req.user.id,
      orderId: orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: amount,
      currency: currency,
      status: PAYMENT_STATUS.PENDING,
      description: description,
      planId: planId,
      planName: planName,
      rideId: rideId,
      seats: seats,
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      metadata: metadata
    });

    await payment.save();

    res.json({
      success: true,
      data: {
        orderId: orderId,
        razorpayOrderId: razorpayOrder.id,
        amount: amount,
        currency: currency,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_51H5jK2K2K2K2K'
      },
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order' 
    });
  }
});

/**
 * @route   POST /api/payment/razorpay/verify
 * @desc    Verify Razorpay payment signature
 * @access  Private
 */
router.post('/verify', auth, [
  check('razorpay_payment_id', 'Payment ID is required').isString(),
  check('razorpay_order_id', 'Order ID is required').isString(),
  check('razorpay_signature', 'Signature is required').isString(),
  check('orderId', 'Order ID is required').isString()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Find payment record
    const payment = await Payment.findOne({ 
      orderId: orderId,
      userId: req.user.id 
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret_key')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Update payment status to failed
      payment.status = PAYMENT_STATUS.FAILED;
      payment.errorDescription = 'Signature verification failed';
      await payment.save();

      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Verify payment with Razorpay
    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

    if (razorpayPayment.status === 'captured') {
      // Update payment record
      payment.status = PAYMENT_STATUS.SUCCESS;
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      payment.paymentMethod = razorpayPayment.method;
      await payment.save();

      // Handle successful payment based on type
      if (payment.planId) {
        // Subscription payment - update user subscription
        await handleSubscriptionPayment(payment, req.user.id);
      } else if (payment.rideId) {
        // Ride payment - book the ride
        await handleRidePayment(payment, req.user.id);
      }

      res.json({
        success: true,
        data: {
          paymentId: razorpay_payment_id,
          orderId: orderId,
          amount: payment.amount,
          status: PAYMENT_STATUS.SUCCESS,
          payment: payment
        },
        message: 'Payment verified successfully'
      });
    } else {
      // Payment failed
      payment.status = PAYMENT_STATUS.FAILED;
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.errorDescription = `Payment status: ${razorpayPayment.status}`;
      await payment.save();

      res.json({
        success: false,
        data: {
          paymentId: razorpay_payment_id,
          orderId: orderId,
          status: PAYMENT_STATUS.FAILED
        },
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

/**
 * @route   GET /api/payment/history
 * @desc    Get user's payment history
 * @access  Private
 */
router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('rideId', 'startLocation endLocation dateTime');

    const total = await Payment.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      data: {
        payments: payments,
        pagination: {
          page: page,
          limit: limit,
          total: total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history'
    });
  }
});

/**
 * @route   GET /api/payment/:paymentId
 * @desc    Get payment details
 * @access  Private
 */
router.get('/:paymentId', auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.paymentId,
      userId: req.user.id
    }).populate('rideId', 'startLocation endLocation dateTime');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: {
        payment: payment
      }
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details'
    });
  }
});

// Helper functions
async function handleSubscriptionPayment(payment, userId) {
  try {
    // Update user subscription in User model
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(userId, {
      subscription: {
        plan: payment.planId,
        planName: payment.planName,
        price: payment.amount,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        paymentId: payment.razorpayPaymentId,
        orderId: payment.orderId
      },
      isSubscribed: true
    });
  } catch (error) {
    console.error('Error updating user subscription:', error);
  }
}

async function handleRidePayment(payment, userId) {
  try {
    // Book the ride in Ride model
    const Ride = mongoose.model('Ride');
    await Ride.findByIdAndUpdate(payment.rideId, {
      $push: {
        passengers: {
          userId: userId,
          seats: payment.seats,
          paymentId: payment.razorpayPaymentId,
          orderId: payment.orderId,
          bookedAt: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error booking ride:', error);
  }
}

export default router;
