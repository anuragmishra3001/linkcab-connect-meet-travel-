# Stripe Integration Setup for LinkCab

This document provides instructions for setting up Stripe payment processing for the LinkCab ride-sharing application.

## Prerequisites

1. A Stripe account (you can sign up at [stripe.com](https://stripe.com))
2. Your Stripe API keys (available in your Stripe Dashboard)

## Environment Variables

Add the following environment variables to your `.env` file in the backend directory:

```
STRIPE_SECRET_KEY=sk_test_your_test_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
FRONTEND_URL=http://localhost:3000
```

## Installing Dependencies

### Backend

Install the Stripe package in the backend directory:

```bash
cd backend
npm install stripe
```

### Frontend

Install the Stripe.js package in the root directory:

```bash
npm install @stripe/stripe-js
```

## Setting Up Stripe Webhooks

To handle payment confirmations, you need to set up a webhook in your Stripe Dashboard:

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers > Webhooks
3. Click "Add endpoint"
4. For the endpoint URL, enter: `https://your-backend-url.com/api/payment/webhook`
5. Select the event `checkout.session.completed`
6. Click "Add endpoint"
7. After creating the webhook, you'll see a signing secret. Copy this value and use it as your `STRIPE_WEBHOOK_SECRET` environment variable

### Local Development with Webhooks

For local development, you can use the Stripe CLI to forward webhook events to your local server:

1. [Install the Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Run the following command:

```bash
stripe listen --forward-to http://localhost:5000/api/payment/webhook
```

3. The CLI will output a webhook signing secret. Use this as your `STRIPE_WEBHOOK_SECRET` environment variable during development.

## Testing the Integration

To test the payment flow:

1. Use Stripe's test card numbers:
   - Card number: `4242 4242 4242 4242`
   - Expiration date: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

2. For testing different scenarios:
   - `4000 0000 0000 0002` - Card declined
   - `4000 0000 0000 9995` - Insufficient funds

## Flow Overview

1. User selects a ride and number of seats
2. User clicks "Book Now" button
3. Frontend calls `/api/payment/create-checkout-session` with ride ID and number of seats
4. Backend creates a Stripe checkout session and returns the session URL
5. Frontend redirects to the Stripe checkout page
6. User completes payment on Stripe's page
7. Stripe redirects to success or cancel page based on payment outcome
8. On success page, frontend verifies the payment with backend
9. Webhook handles updating the ride's passenger list and available seats

## Troubleshooting

- Check the server logs for any Stripe-related errors
- Verify that your Stripe API keys are correct
- Ensure the webhook is properly configured
- For webhook issues, check the Stripe Dashboard's webhook logs