import api from './api.js';

// Subscription service for handling subscription-related API calls
export const subscriptionService = {
  // Get user's subscription status
  async getSubscriptionStatus() {
    try {
      const response = await api.get('/subscription/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      throw error;
    }
  },

  // Get available subscription plans
  async getPlans() {
    try {
      const response = await api.get('/subscription/plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  },

  // Activate subscription
  async activateSubscription(plan, paymentMethod, amount) {
    try {
      const response = await api.post('/subscription/activate', {
        plan,
        paymentMethod,
        amount
      });
      return response.data;
    } catch (error) {
      console.error('Error activating subscription:', error);
      throw error;
    }
  },

  // Cancel subscription
  async cancelSubscription() {
    try {
      const response = await api.post('/subscription/cancel');
      return response.data;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  },

  // Upgrade subscription
  async upgradeSubscription(newPlan) {
    try {
      const response = await api.post('/subscription/upgrade', {
        newPlan
      });
      return response.data;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw error;
    }
  },

  // Create subscription checkout session
  async createSubscriptionCheckout(plan) {
    try {
      const response = await api.post('/payment/subscription/create-checkout-session', {
        plan
      });
      return response.data;
    } catch (error) {
      console.error('Error creating subscription checkout:', error);
      throw error;
    }
  },

  // Verify subscription payment
  async verifySubscriptionPayment(sessionId, plan) {
    try {
      const response = await api.post('/payment/subscription/verify', {
        sessionId,
        plan
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying subscription payment:', error);
      throw error;
    }
  }
};

// Helper function to check if user has access to premium features
export const checkPremiumAccess = (user) => {
  if (!user) return false;
  
  // Check if user is subscribed
  if (!user.isSubscribed || !user.subscription) {
    return false;
  }

  // Check if subscription is active
  if (user.subscription.status !== 'active') {
    return false;
  }

  // Check if subscription is not expired
  if (user.subscription.expiresAt && new Date() > new Date(user.subscription.expiresAt)) {
    return false;
  }

  return true;
};

// Helper function to get plan features
export const getPlanFeatures = (plan) => {
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

// Helper function to check if user has required plan level
export const hasRequiredPlan = (user, requiredPlan) => {
  if (!checkPremiumAccess(user)) return false;

  const planHierarchy = {
    'silver': 1,
    'gold': 2,
    'platinum': 3
  };

  const userPlanLevel = planHierarchy[user.subscription.plan] || 0;
  const requiredPlanLevel = planHierarchy[requiredPlan] || 0;

  return userPlanLevel >= requiredPlanLevel;
};

export default subscriptionService;
