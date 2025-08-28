import { getRazorpayOptions, PAYMENT_STATUS } from '../config/razorpay'
import { paymentAPI } from './api'

class RazorpayService {
  constructor() {
    this.razorpay = null
    this.loadRazorpay()
  }

  // Load Razorpay script
  loadRazorpay() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        this.razorpay = window.Razorpay
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        this.razorpay = window.Razorpay
        resolve()
      }
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay'))
      }
      document.body.appendChild(script)
    })
  }

  // Create order on backend
  async createOrder(orderData) {
    try {
      const response = await paymentAPI.createRazorpayOrder(orderData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create order')
    }
  }

  // Verify payment on backend
  async verifyPayment(paymentData) {
    try {
      const response = await paymentAPI.verifyRazorpayPayment(paymentData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment verification failed')
    }
  }

  // Initialize payment
  async initializePayment(orderData, onSuccess, onFailure) {
    try {
      // Ensure Razorpay is loaded
      await this.loadRazorpay()

      // Create order on backend
      const order = await this.createOrder(orderData)

      // Configure Razorpay options
      const options = getRazorpayOptions(
        {
          ...orderData,
          orderId: order.orderId,
          amount: order.amount
        },
        async (response) => {
          try {
            // Verify payment on backend
            const verification = await this.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order.orderId
            })

            if (verification.success) {
              onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: order.amount,
                status: PAYMENT_STATUS.SUCCESS,
                verification: verification
              })
            } else {
              onFailure({
                error: 'Payment verification failed',
                status: PAYMENT_STATUS.FAILED
              })
            }
          } catch (error) {
            onFailure({
              error: error.message,
              status: PAYMENT_STATUS.FAILED
            })
          }
        },
        () => {
          onFailure({
            error: 'Payment cancelled by user',
            status: PAYMENT_STATUS.CANCELLED
          })
        }
      )

      // Open Razorpay modal
      const rzp = new this.razorpay(options)
      rzp.open()

      return rzp
    } catch (error) {
      throw new Error(`Payment initialization failed: ${error.message}`)
    }
  }

  // Get payment status
  getPaymentStatus(status) {
    switch (status) {
      case PAYMENT_STATUS.SUCCESS:
        return { text: 'Payment Successful', color: 'text-green-600', bg: 'bg-green-50' }
      case PAYMENT_STATUS.FAILED:
        return { text: 'Payment Failed', color: 'text-red-600', bg: 'bg-red-50' }
      case PAYMENT_STATUS.CANCELLED:
        return { text: 'Payment Cancelled', color: 'text-yellow-600', bg: 'bg-yellow-50' }
      case PAYMENT_STATUS.PENDING:
        return { text: 'Payment Pending', color: 'text-blue-600', bg: 'bg-blue-50' }
      default:
        return { text: 'Unknown Status', color: 'text-gray-600', bg: 'bg-gray-50' }
    }
  }

  // Format amount for display
  formatAmount(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  // Get payment method icon
  getPaymentMethodIcon(method) {
    const icons = {
      card: '💳',
      upi: '📱',
      netbanking: '🏦',
      wallet: '👛',
      emi: '📅'
    }
    return icons[method] || '💳'
  }
}

// Create singleton instance
const razorpayService = new RazorpayService()

export default razorpayService
