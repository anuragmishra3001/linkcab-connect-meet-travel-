import { useState } from 'react'
import { motion } from 'framer-motion'
import FlashCard from '../components/FlashCard'
import Button from '../components/Button'
import { formatCurrency } from '../utils/currency'
import razorpayService from '../services/razorpayService'
import { PAYMENT_STATUS } from '../config/razorpay'

const RazorpayTest = () => {
  const [loading, setLoading] = useState(false)
  const [testAmount, setTestAmount] = useState(1)
  const [paymentResult, setPaymentResult] = useState(null)

  const handleTestPayment = async () => {
    setLoading(true)
    setPaymentResult(null)

    try {
      const orderData = {
        amount: testAmount,
        currency: 'INR',
        description: 'Razorpay Integration Test Payment',
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '+91 98765 43210',
        planId: 'test',
        planName: 'Test Plan',
        planPrice: testAmount
      }

      await razorpayService.initializePayment(
        orderData,
        // Success callback
        (result) => {
          setPaymentResult({
            status: 'success',
            data: result,
            message: 'Payment completed successfully!'
          })
          setLoading(false)
        },
        // Failure callback
        (error) => {
          setPaymentResult({
            status: 'failed',
            data: error,
            message: error.error || 'Payment failed'
          })
          setLoading(false)
        }
      )
    } catch (error) {
      setPaymentResult({
        status: 'error',
        data: error,
        message: error.message || 'Payment initialization failed'
      })
      setLoading(false)
    }
  }

  const getStatusDisplay = (status) => {
    const statusConfig = razorpayService.getPaymentStatus(status)
    return statusConfig
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Razorpay Integration Test
          </h1>
          <p className="text-xl text-gray-600">
            Test the Razorpay payment gateway with sandbox credentials
          </p>
        </motion.div>

        {/* Test Configuration */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <FlashCard className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Test Configuration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={testAmount}
                  onChange={(e) => setTestAmount(parseFloat(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Display
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl">
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(testAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Sandbox Test Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-blue-800">Success Card:</p>
                  <p className="text-blue-700 font-mono">4111 1111 1111 1111</p>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Failure Card:</p>
                  <p className="text-blue-700 font-mono">4000 0000 0000 0002</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleTestPayment}
              disabled={loading}
              size="xl"
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing Payment...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Test Payment of {formatCurrency(testAmount)}</span>
                  <span className="text-sm opacity-75">via Razorpay</span>
                </div>
              )}
            </Button>
          </FlashCard>
        </motion.section>

        {/* Payment Result */}
        {paymentResult && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <FlashCard className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Payment Result
              </h2>
              
              <div className={`p-4 rounded-xl mb-6 ${
                paymentResult.status === 'success' ? 'bg-green-50 border border-green-200' :
                paymentResult.status === 'failed' ? 'bg-red-50 border border-red-200' :
                'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    paymentResult.status === 'success' ? 'bg-green-500' :
                    paymentResult.status === 'failed' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}>
                    <span className="text-white text-sm font-bold">
                      {paymentResult.status === 'success' ? '✓' :
                       paymentResult.status === 'failed' ? '✕' : '!'}
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold ${
                    paymentResult.status === 'success' ? 'text-green-800' :
                    paymentResult.status === 'failed' ? 'text-red-800' :
                    'text-yellow-800'
                  }`}>
                    {paymentResult.message}
                  </h3>
                </div>
                
                {paymentResult.data && (
                  <div className="space-y-2 text-sm">
                    {paymentResult.data.paymentId && (
                      <p><strong>Payment ID:</strong> {paymentResult.data.paymentId}</p>
                    )}
                    {paymentResult.data.orderId && (
                      <p><strong>Order ID:</strong> {paymentResult.data.orderId}</p>
                    )}
                    {paymentResult.data.amount && (
                      <p><strong>Amount:</strong> {formatCurrency(paymentResult.data.amount)}</p>
                    )}
                    {paymentResult.data.status && (
                      <p><strong>Status:</strong> {paymentResult.data.status}</p>
                    )}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setPaymentResult(null)}
                variant="outline"
                className="w-full"
              >
                Clear Result
              </Button>
            </FlashCard>
          </motion.section>
        )}

        {/* Integration Info */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FlashCard className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Integration Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Frontend Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Razorpay script loading</li>
                  <li>• Payment modal integration</li>
                  <li>• Success/failure handling</li>
                  <li>• Payment verification</li>
                  <li>• Error handling</li>
                  <li>• Currency formatting (INR)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Backend Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Order creation</li>
                  <li>• Payment verification</li>
                  <li>• Signature validation</li>
                  <li>• Database storage</li>
                  <li>• Subscription handling</li>
                  <li>• Payment history</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Test Instructions</h3>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Enter a test amount (₹1-₹1000)</li>
                <li>2. Click "Test Payment" button</li>
                <li>3. Use sandbox test cards in Razorpay modal</li>
                <li>4. Complete or cancel the payment</li>
                <li>5. View the payment result</li>
              </ol>
            </div>
          </FlashCard>
        </motion.section>
      </div>
    </div>
  )
}

export default RazorpayTest
