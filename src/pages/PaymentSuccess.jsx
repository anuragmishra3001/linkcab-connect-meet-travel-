import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import FlashCard from '../components/FlashCard'
import { FloatingShapes } from '../components/ModernGraphics'

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { plan, amount } = location.state || {}

  useEffect(() => {
    // Redirect to dashboard if no payment data
    if (!plan || !amount) {
      navigate('/dashboard')
    }
  }, [plan, amount, navigate])

  if (!plan || !amount) {
    return null
  }

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
                Welcome to LinkCab Premium! Your subscription is now active.
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
          className="mb-12"
        >
          <FlashCard className="p-8 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center text-white text-6xl font-bold mx-auto mb-6 shadow-xl border-4 border-white/20">
              🎉
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thank you for subscribing!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Your {plan.name} plan is now active and you have access to all premium features.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center text-green-800">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-2">
                  ✓
                </div>
                <span className="font-medium">Payment of ${amount} processed successfully</span>
              </div>
            </div>
          </FlashCard>
        </motion.section>

        {/* Subscription Details */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <FlashCard className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your Subscription Details
              </h3>
              <p className="text-gray-600">
                Here's what you've unlocked with your {plan.name} plan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Plan Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">{plan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">${plan.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billing Cycle:</span>
                    <span className="font-medium">Monthly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Plan Features</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FlashCard>
        </motion.section>

        {/* Next Steps */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <FlashCard className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                What's Next?
              </h3>
              <p className="text-gray-600">
                Start exploring your premium features and connect with fellow travelers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-xl border-2 border-white/20">
                  🚗
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Create Your First Ride</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Start sharing rides and earning money with your premium features
                </p>
                <Link to="/create-ride">
                  <Button size="sm" className="w-full">
                    Create Ride
                  </Button>
                </Link>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-xl border-2 border-white/20">
                  🤝
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Connect with Others</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Build your network and find reliable travel partners
                </p>
                <Link to="/connect">
                  <Button size="sm" className="w-full">
                    Start Connecting
                  </Button>
                </Link>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-xl border-2 border-white/20">
                  📊
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">View Your Dashboard</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Track your rides, earnings, and subscription status
                </p>
                <Link to="/dashboard">
                  <Button size="sm" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </FlashCard>
        </motion.section>

        {/* Action Buttons */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default PaymentSuccess