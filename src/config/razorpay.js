// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  // Sandbox keys for testing
  key_id: 'rzp_test_51H5jK2K2K2K2K', // Replace with your actual test key
  key_secret: 'test_secret_key', // This will be used in backend only
  
  // Production keys (uncomment when going live)
  // key_id: 'rzp_live_YOUR_LIVE_KEY_ID',
  // key_secret: 'YOUR_LIVE_KEY_SECRET',
  
  // Currency configuration
  currency: 'INR',
  currency_name: 'Indian Rupee',
  
  // Company details
  company_name: 'LinkCab',
  company_description: 'Connect, Meet, Travel',
  
  // Theme colors
  theme: {
    color: '#3B82F6' // Primary blue color
  }
}

// Razorpay options for payment
export const getRazorpayOptions = (orderData, onSuccess, onFailure) => {
  return {
    key: RAZORPAY_CONFIG.key_id,
    amount: orderData.amount * 100, // Razorpay expects amount in paise
    currency: RAZORPAY_CONFIG.currency,
    name: RAZORPAY_CONFIG.company_name,
    description: orderData.description || 'LinkCab Payment',
    image: 'https://linkcab.com/logo.png', // Replace with your logo URL
    order_id: orderData.orderId,
    handler: onSuccess,
    prefill: {
      name: orderData.customerName || '',
      email: orderData.customerEmail || '',
      contact: orderData.customerPhone || ''
    },
    notes: {
      address: 'LinkCab Corporate Office'
    },
    theme: RAZORPAY_CONFIG.theme,
    modal: {
      ondismiss: onFailure
    }
  }
}

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
}

// Payment methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NETBANKING: 'netbanking',
  WALLET: 'wallet',
  EMI: 'emi'
}
