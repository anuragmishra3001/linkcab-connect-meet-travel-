import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import FlashCard from '../components/FlashCard'
import Button from '../components/Button'
import { 
  AnimatedCounter,
  FloatingShapes 
} from '../components/ModernGraphics'
import { formatCurrency } from '../utils/currency'
import razorpayService from '../services/razorpayService'

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (location.state) {
      setPaymentDetails(location.state)
      setLoading(false)
    } else {
      // If no state, redirect to home
      navigate('/')
    }
  }, [location.state, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!paymentDetails) {
    return null
  }

  const { plan, amount, paymentId, orderId } = paymentDetails

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <FloatingShapes />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Payment Successful! 🎉
              </h1>
              <p className="text-xl opacity-90">
                Thank you for subscribing to LinkCab Premium
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="text-6xl">✅</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <FlashCard className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl mx-auto mb-6">
              ✓
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Completed Successfully
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Your {plan.name} subscription has been activated. You now have access to all premium features!
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-green-800 font-medium">
                Amount Paid: {formatCurrency(amount)}
              </p>
            </div>
          </FlashCard>
        </motion.section>

        {/* Payment Details */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <FlashCard className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Plan Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900">{plan.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Amount Paid
                  </label>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(amount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Payment Method
                  </label>
                  <p className="text-lg font-semibold text-gray-900">Razorpay</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Payment ID
                  </label>
                  <p className="text-sm font-mono text-gray-700 bg-gray-50 p-2 rounded">
                    {paymentId || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Order ID
                  </label>
                  <p className="text-sm font-mono text-gray-700 bg-gray-50 p-2 rounded">
                    {orderId || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Date & Time
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date().toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </FlashCard>
        </motion.section>

        {/* Subscription Benefits */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <FlashCard className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Your {plan.name} Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
          </FlashCard>
        </motion.section>

        {/* Next Steps */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <FlashCard className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              What's Next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚗</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Create Rides</h4>
                <p className="text-sm text-gray-600">
                  Start creating rides and connect with fellow travelers
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Find Rides</h4>
                <p className="text-sm text-gray-600">
                  Search and book rides to your destination
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Connect</h4>
                <p className="text-sm text-gray-600">
                  Chat with ride hosts and passengers
                </p>
              </div>
            </div>
          </FlashCard>
        </motion.section>

        {/* Action Buttons */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/create-ride')}
              className="w-full sm:w-auto"
            >
              Create Your First Ride
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/rides')}
              className="w-full sm:w-auto"
            >
              Browse Available Rides
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/profile')}
              className="w-full sm:w-auto"
            >
              View Profile
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default PaymentSuccess