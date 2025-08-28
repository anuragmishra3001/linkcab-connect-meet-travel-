import express from 'express';
import { check, validationResult } from 'express-validator';
import { protect as auth } from '../middleware/auth.js';
import { getSubscriptionFeatures } from '../middleware/subscription.js';

const router = express.Router();

/**
 * @route   POST /api/payment/create-checkout-session
 * @desc    Create a Stripe checkout session for ride booking
 * @access  Private
 */
router.post('/create-checkout-session', auth, [
  check('rideId', 'Ride ID is required').isMongoId(),
  check('seats', 'Number of seats is required').isInt({ min: 1, max: 10 })
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { rideId, seats } = req.body;

    // Import Stripe dynamically to avoid issues if the package is not installed
    let stripe;
    try {
      stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
    } catch (error) {
      console.error('Stripe package not installed or configured:', error.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Payment processing is not available at this time.'
      });
    }

    // Get ride details from database
    const ride = await mongoose.model('Ride').findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    // Check if ride is active
    if (ride.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Ride is not active' });
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

    // Calculate total price
    const totalPrice = ride.pricePerSeat * seats;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Ride from ${ride.startLocation.address} to ${ride.endLocation.address}`,
              description: `${seats} seat(s) for ride on ${new Date(ride.dateTime).toLocaleDateString()}`
            },
            unit_amount: Math.round(ride.pricePerSeat * 100), // Stripe uses paise
          },
          quantity: seats,
        },
      ],
      metadata: {
        rideId: rideId,
        userId: req.user.id,
        seats: seats
      },
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/ride/${rideId}?payment_cancelled=true`,
    });

    res.json({ success: true, data: { sessionId: session.id, url: session.url } });
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/payment/verify-session/:sessionId
 * @desc    Verify a checkout session and return ride details
 * @access  Private
 */
router.get('/verify-session/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Import Stripe dynamically
    let stripe;
    try {
      stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
    } catch (error) {
      console.error('Stripe package not installed or configured:', error.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Payment verification is not available at this time.'
      });
    }
    
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }
    
    // Get the ride details from the metadata
    const { rideId, seats } = session.metadata;
    
    // Get ride from database
    const ride = await mongoose.model('Ride').findById(rideId).populate('host', 'name avatar rating');
    
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    // Return ride details and payment information
    res.json({
      success: true,
      data: {
        ride,
        seats: parseInt(seats),
        totalPaid: session.amount_total / 100, // Convert from paise to rupees
        paymentId: session.payment_intent
      }
    });
  } catch (error) {
    console.error('Session verification error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   POST /api/payment/webhook
 * @desc    Handle Stripe webhook events
 * @access  Public
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;
  
  try {
    // Import Stripe dynamically
    let stripe;
    try {
      stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
    } catch (error) {
      console.error('Stripe package not installed or configured:', error.message);
      return res.status(500).end();
    }

    // Get the signature from the header
    const signature = req.headers['stripe-signature'];

    // Verify the event
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Extract metadata
      const { rideId, userId, seats } = session.metadata;
      
      // Update the ride with the new passenger
      const ride = await mongoose.model('Ride').findById(rideId);
      
      if (ride) {
        // Add passenger to ride
        ride.passengers.push({
          user: userId,
          seats: parseInt(seats),
          status: 'confirmed' // Payment confirmed
        });

        // Save ride
        await ride.save();

        // Notify the ride host via socket.io (if implemented)
        const io = req.app.get('io');
        if (io) {
          io.to(`ride_${rideId}`).emit('booking_confirmed', { rideId, userId, seats });
        }
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

/**
 * @route   POST /api/payment/subscription/create-checkout-session
 * @desc    Create a Stripe checkout session for subscription
 * @access  Private
 */
router.post('/subscription/create-checkout-session', auth, [
  check('plan', 'Subscription plan is required').isIn(['silver', 'gold', 'platinum'])
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { plan } = req.body;
    const planFeatures = getSubscriptionFeatures(plan);

    // Import Stripe dynamically
    let stripe;
    try {
      stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
    } catch (error) {
      console.error('Stripe package not installed or configured:', error.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Payment processing is not available at this time.'
      });
    }

    // Create Stripe checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${planFeatures.name} Subscription`,
              description: planFeatures.features.join(', ')
            },
            unit_amount: Math.round(planFeatures.price * 100), // Stripe uses paise
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: req.user.id,
        plan: plan,
        type: 'subscription'
      },
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&type=subscription`,
      cancel_url: `${process.env.FRONTEND_URL}/payment?cancelled=true`,
    });

    res.json({ success: true, data: { sessionId: session.id, url: session.url } });
  } catch (error) {
    console.error('Error creating subscription checkout session:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   POST /api/payment/subscription/verify
 * @desc    Verify subscription payment and activate subscription
 * @access  Private
 */
router.post('/subscription/verify', auth, [
  check('sessionId', 'Session ID is required').notEmpty(),
  check('plan', 'Subscription plan is required').isIn(['silver', 'gold', 'platinum'])
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { sessionId, plan } = req.body;

    // Import Stripe dynamically
    let stripe;
    try {
      stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
    } catch (error) {
      console.error('Stripe package not installed or configured:', error.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Payment verification is not available at this time.'
      });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    // Verify the session belongs to the user
    if (session.metadata.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Verify the plan matches
    if (session.metadata.plan !== plan) {
      return res.status(400).json({ success: false, message: 'Plan mismatch' });
    }

    // Call subscription activation endpoint
    const activationResponse = await fetch(`${req.protocol}://${req.get('host')}/api/subscription/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization
      },
      body: JSON.stringify({
        plan: plan,
        paymentMethod: 'card',
        amount: session.amount_total / 100
      })
    });

    if (!activationResponse.ok) {
      throw new Error('Failed to activate subscription');
    }

    const activationData = await activationResponse.json();

    res.json({
      success: true,
      message: 'Subscription activated successfully',
      data: activationData.data
    });
  } catch (error) {
    console.error('Subscription verification error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;