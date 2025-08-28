import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  // User who made the payment
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Order details
  orderId: {
    type: String,
    required: true,
    unique: true
  },

  // Razorpay payment details
  razorpayPaymentId: {
    type: String,
    sparse: true
  },

  razorpayOrderId: {
    type: String,
    required: true
  },

  razorpaySignature: {
    type: String
  },

  // Payment amount and currency
  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: 'INR'
  },

  // Payment status
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },

  // Payment method used
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'emi'],
    required: true
  },

  // Payment description
  description: {
    type: String,
    required: true
  },

  // Plan details (for subscription payments)
  planId: {
    type: String
  },

  planName: {
    type: String
  },

  // Ride details (for ride payments)
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  },

  seats: {
    type: Number
  },

  // Customer details
  customerName: {
    type: String,
    required: true
  },

  customerEmail: {
    type: String,
    required: true
  },

  customerPhone: {
    type: String
  },

  // Error details (if payment failed)
  errorCode: {
    type: String
  },

  errorDescription: {
    type: String
  },

  // Refund details
  refundId: {
    type: String
  },

  refundAmount: {
    type: Number
  },

  refundReason: {
    type: String
  },

  // Metadata
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount);
});

// Virtual for payment status display
paymentSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: { text: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    success: { text: 'Successful', color: 'text-green-600', bg: 'bg-green-50' },
    failed: { text: 'Failed', color: 'text-red-600', bg: 'bg-red-50' },
    cancelled: { text: 'Cancelled', color: 'text-gray-600', bg: 'bg-gray-50' },
    refunded: { text: 'Refunded', color: 'text-blue-600', bg: 'bg-blue-50' }
  };
  return statusMap[this.status] || statusMap.pending;
});

// Ensure virtuals are included in JSON output
paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

export default mongoose.model('Payment', paymentSchema);
