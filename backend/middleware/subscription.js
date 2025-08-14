import User from '../models/User.js';

// Middleware to check if user has an active subscription
export const requireSubscription = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user has an active subscription
    if (!req.user.isSubscribed || !req.user.subscription) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription required',
        code: 'SUBSCRIPTION_REQUIRED',
        redirectTo: '/payment'
      });
    }

    // Check if subscription is expired
    if (req.user.subscription.expiresAt && new Date() > new Date(req.user.subscription.expiresAt)) {
      return res.status(403).json({
        success: false,
        message: 'Subscription has expired',
        code: 'SUBSCRIPTION_EXPIRED',
        redirectTo: '/payment'
      });
    }

    next();
  } catch (error) {
    console.error('Subscription middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in subscription check'
    });
  }
};

// Middleware to check specific subscription plan
export const requirePlan = (requiredPlan) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user has an active subscription
      if (!req.user.isSubscribed || !req.user.subscription) {
        return res.status(403).json({
          success: false,
          message: 'Premium subscription required',
          code: 'SUBSCRIPTION_REQUIRED',
          redirectTo: '/payment'
        });
      }

      // Check if subscription is expired
      if (req.user.subscription.expiresAt && new Date() > new Date(req.user.subscription.expiresAt)) {
        return res.status(403).json({
          success: false,
          message: 'Subscription has expired',
          code: 'SUBSCRIPTION_EXPIRED',
          redirectTo: '/payment'
        });
      }

      // Check if user has the required plan
      const planHierarchy = {
        'silver': 1,
        'gold': 2,
        'platinum': 3
      };

      const userPlanLevel = planHierarchy[req.user.subscription.plan] || 0;
      const requiredPlanLevel = planHierarchy[requiredPlan] || 0;

      if (userPlanLevel < requiredPlanLevel) {
        return res.status(403).json({
          success: false,
          message: `${requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} plan or higher required`,
          code: 'INSUFFICIENT_PLAN',
          redirectTo: '/payment',
          currentPlan: req.user.subscription.plan,
          requiredPlan: requiredPlan
        });
      }

      next();
    } catch (error) {
      console.error('Plan check middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error in plan check'
      });
    }
  };
};

// Middleware to check subscription status without blocking (for analytics)
export const checkSubscriptionStatus = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id).select('isSubscribed subscription');
      req.userSubscription = {
        isSubscribed: user.isSubscribed,
        plan: user.subscription?.plan || null,
        expiresAt: user.subscription?.expiresAt || null
      };
    }
    next();
  } catch (error) {
    console.error('Subscription status check error:', error);
    req.userSubscription = { isSubscribed: false, plan: null, expiresAt: null };
    next();
  }
};

// Helper function to get subscription features
export const getSubscriptionFeatures = (plan) => {
  const features = {
    silver: {
      name: 'Silver',
      price: 9.99,
      features: [
        'Access to Connect feature',
        'Access to Messages feature',
        'Basic ride sharing',
        'User reviews'
      ]
    },
    gold: {
      name: 'Gold',
      price: 19.99,
      features: [
        'All Silver features',
        'Priority customer support',
        'Advanced ride matching',
        'Ride history analytics'
      ]
    },
    platinum: {
      name: 'Platinum',
      price: 29.99,
      features: [
        'All Gold features',
        'Premium ride matching',
        'Exclusive events access',
        'Dedicated support line'
      ]
    }
  };

  return features[plan] || features.silver;
};
