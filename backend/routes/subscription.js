import express from 'express';
import { protect } from '../middleware/auth.js';
import { requireSubscription, checkSubscriptionStatus, getSubscriptionFeatures } from '../middleware/subscription.js';
import User from '../models/User.js';

const router = express.Router();

// Get user's subscription status
router.get('/status', protect, checkSubscriptionStatus, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('isSubscribed subscription');
    
    res.json({
      success: true,
      data: {
        isSubscribed: user.isSubscribed,
        subscription: user.subscription,
        features: user.subscription?.plan ? getSubscriptionFeatures(user.subscription.plan) : null
      }
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription status'
    });
  }
});

// Get available subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = {
      silver: getSubscriptionFeatures('silver'),
      gold: getSubscriptionFeatures('gold'),
      platinum: getSubscriptionFeatures('platinum')
    };

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription plans'
    });
  }
});

// Activate subscription (called after successful payment)
router.post('/activate', protect, async (req, res) => {
  try {
    const { plan, paymentMethod, amount } = req.body;

    if (!plan || !['silver', 'gold', 'platinum'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan'
      });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        isSubscribed: true,
        subscription: {
          plan: plan,
          status: 'active',
          startDate: now,
          expiresAt: expiresAt,
          paymentMethod: paymentMethod || 'card',
          lastBillingDate: now,
          nextBillingDate: expiresAt
        }
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Subscription activated successfully',
      data: {
        user: user,
        subscription: user.subscription,
        features: getSubscriptionFeatures(plan)
      }
    });
  } catch (error) {
    console.error('Activate subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error activating subscription'
    });
  }
});

// Cancel subscription
router.post('/cancel', protect, requireSubscription, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'subscription.status': 'cancelled'
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: {
        user: user,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription'
    });
  }
});

// Upgrade subscription
router.post('/upgrade', protect, requireSubscription, async (req, res) => {
  try {
    const { newPlan } = req.body;

    if (!newPlan || !['silver', 'gold', 'platinum'].includes(newPlan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan'
      });
    }

    const planHierarchy = {
      'silver': 1,
      'gold': 2,
      'platinum': 3
    };

    const currentPlanLevel = planHierarchy[req.user.subscription.plan] || 0;
    const newPlanLevel = planHierarchy[newPlan];

    if (newPlanLevel <= currentPlanLevel) {
      return res.status(400).json({
        success: false,
        message: 'New plan must be higher than current plan'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'subscription.plan': newPlan,
        'subscription.lastBillingDate': new Date()
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Subscription upgraded successfully',
      data: {
        user: user,
        subscription: user.subscription,
        features: getSubscriptionFeatures(newPlan)
      }
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error upgrading subscription'
    });
  }
});

// Get subscription analytics (for admin)
router.get('/analytics', protect, requireSubscription, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const subscribedUsers = await User.countDocuments({ isSubscribed: true });
    const planStats = await User.aggregate([
      { $match: { isSubscribed: true } },
      { $group: { _id: '$subscription.plan', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        subscribedUsers,
        subscriptionRate: (subscribedUsers / totalUsers * 100).toFixed(2),
        planStats
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
    });
  }
});

export default router;
