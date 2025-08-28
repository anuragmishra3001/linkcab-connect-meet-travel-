# Razorpay Integration for LinkCab

This document outlines the complete Razorpay payment gateway integration for the LinkCab application.

## Overview

The integration replaces the previous Stripe payment system with Razorpay, providing:
- Secure payment processing
- Multiple payment methods (Cards, UPI, Net Banking, Wallets)
- Indian Rupee (INR) support
- Sandbox testing environment
- Production-ready implementation

## Features

### Frontend Features
- ✅ Razorpay script loading and initialization
- ✅ Payment modal integration
- ✅ Success/failure handling
- ✅ Payment verification
- ✅ Error handling and user feedback
- ✅ Currency formatting (INR)
- ✅ Payment history display
- ✅ Test page for sandbox testing

### Backend Features
- ✅ Order creation API
- ✅ Payment verification with signature validation
- ✅ Database storage for payment records
- ✅ Subscription handling
- ✅ Payment history API
- ✅ Error handling and logging

## Installation

### Frontend Dependencies
```bash
npm install razorpay
```

### Backend Dependencies
```bash
cd backend
npm install razorpay
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Razorpay Configuration (Sandbox)
RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_TEST_KEY_SECRET

# Razorpay Configuration (Production)
# RAZORPAY_LIVE_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
# RAZORPAY_LIVE_KEY_SECRET=YOUR_LIVE_KEY_SECRET

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration

The Razorpay configuration is in `src/config/razorpay.js`:

```javascript
export const RAZORPAY_CONFIG = {
  key_id: 'rzp_test_YOUR_TEST_KEY_ID',
  currency: 'INR',
  company_name: 'LinkCab',
  theme: {
    color: '#3B82F6'
  }
}
```

### Backend Configuration

The backend configuration is in `backend/config/razorpay.js`:

```javascript
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
```

## API Endpoints

### Create Order
```
POST /api/payment/razorpay/create-order
```

**Request Body:**
```json
{
  "amount": 100,
  "currency": "INR",
  "description": "Subscription Payment",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+91 98765 43210",
  "planId": "gold",
  "planName": "Gold Plan"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_1234567890",
    "razorpayOrderId": "order_ABC123",
    "amount": 100,
    "currency": "INR",
    "key": "rzp_test_..."
  }
}
```

### Verify Payment
```
POST /api/payment/razorpay/verify
```

**Request Body:**
```json
{
  "razorpay_payment_id": "pay_ABC123",
  "razorpay_order_id": "order_ABC123",
  "razorpay_signature": "signature_hash",
  "orderId": "order_1234567890"
}
```

### Get Payment History
```
GET /api/payment/history?page=1&limit=10
```

### Get Payment Details
```
GET /api/payment/:paymentId
```

## Database Schema

### Payment Model
```javascript
{
  userId: ObjectId,
  orderId: String,
  razorpayPaymentId: String,
  razorpayOrderId: String,
  razorpaySignature: String,
  amount: Number,
  currency: String,
  status: String,
  paymentMethod: String,
  description: String,
  planId: String,
  planName: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Examples

### Frontend Payment Integration

```javascript
import razorpayService from '../services/razorpayService'

const handlePayment = async () => {
  const orderData = {
    amount: 100,
    currency: 'INR',
    description: 'Gold Plan Subscription',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    planId: 'gold',
    planName: 'Gold Plan'
  }

  try {
    await razorpayService.initializePayment(
      orderData,
      // Success callback
      (result) => {
        console.log('Payment successful:', result)
        // Handle success
      },
      // Failure callback
      (error) => {
        console.log('Payment failed:', error)
        // Handle failure
      }
    )
  } catch (error) {
    console.error('Payment initialization failed:', error)
  }
}
```

### Backend Payment Handling

```javascript
// Create order
const order = await razorpay.orders.create({
  amount: amount * 100, // Convert to paise
  currency: 'INR',
  receipt: orderId
})

// Verify payment
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  .digest('hex')

if (expectedSignature === razorpay_signature) {
  // Payment verified successfully
}
```

## Testing

### Sandbox Test Cards

**Success Cards:**
- `4111 1111 1111 1111` - Visa
- `5555 5555 5555 4444` - Mastercard

**Failure Cards:**
- `4000 0000 0000 0002` - Declined
- `4000 0000 0000 9995` - Insufficient funds

### Test UPI IDs
- `success@razorpay` - Success
- `failure@razorpay` - Failure

### Test Page
Visit `/razorpay-test` to test the integration with sandbox credentials.

## Security Considerations

1. **Signature Verification**: Always verify payment signatures on the backend
2. **HTTPS**: Use HTTPS in production
3. **Environment Variables**: Keep API keys secure
4. **Input Validation**: Validate all payment data
5. **Error Handling**: Handle payment failures gracefully

## Error Handling

### Common Errors

1. **Signature Verification Failed**
   - Check if the signature is correct
   - Verify the order ID and payment ID

2. **Payment Failed**
   - Check payment status with Razorpay
   - Verify customer details

3. **Order Creation Failed**
   - Check Razorpay credentials
   - Verify amount and currency

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Production Deployment

1. **Update Environment Variables**
   - Replace test keys with live keys
   - Update frontend URL

2. **SSL Certificate**
   - Ensure HTTPS is enabled
   - Valid SSL certificate required

3. **Webhook Configuration**
   - Set up webhooks for payment notifications
   - Handle webhook verification

4. **Monitoring**
   - Monitor payment success rates
   - Set up error alerts

## Migration from Stripe

The integration maintains backward compatibility with existing Stripe endpoints:

- `POST /api/payment/create-checkout-session` (Legacy)
- `GET /api/payment/verify-session/:sessionId` (Legacy)

These endpoints are still available but deprecated in favor of the new Razorpay endpoints.

## Support

For issues related to:
- **Razorpay Integration**: Check this documentation
- **Razorpay API**: Refer to [Razorpay Documentation](https://razorpay.com/docs/)
- **Payment Issues**: Contact Razorpay Support

## Changelog

### v1.0.0
- Initial Razorpay integration
- Replaced Stripe payment system
- Added sandbox testing support
- Implemented payment verification
- Added payment history tracking
