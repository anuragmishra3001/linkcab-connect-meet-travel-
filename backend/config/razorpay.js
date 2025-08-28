import Razorpay from 'razorpay';

// Razorpay configuration
const razorpayConfig = {
  // Sandbox keys for testing
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_51H5jK2K2K2K2K',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret_key',
  
  // Production keys (uncomment when going live)
  // key_id: process.env.RAZORPAY_LIVE_KEY_ID,
  // key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET,
};

// Create Razorpay instance
const razorpay = new Razorpay({
  key_id: razorpayConfig.key_id,
  key_secret: razorpayConfig.key_secret,
});

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Payment methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NETBANKING: 'netbanking',
  WALLET: 'wallet',
  EMI: 'emi'
};

// Currency configuration
export const CURRENCY_CONFIG = {
  currency: 'INR',
  currency_name: 'Indian Rupee'
};

export default razorpay;
