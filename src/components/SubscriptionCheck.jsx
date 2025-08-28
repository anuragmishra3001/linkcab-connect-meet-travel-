import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FlashCard from './FlashCard'
import Button from './Button'
import { FloatingShapes } from './ModernGraphics'
import { formatCurrency } from '../utils/currency'

const SubscriptionCheck = ({ children, feature = 'this feature' }) => {
  const { user } = useAuth()

  // If user is subscribed, show the children
  if (user?.isSubscribed) {
    return children
  }

  // If user is not subscribed, show the subscription prompt
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <FloatingShapes />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Premium Feature
              </h1>
              <p className="text-xl opacity-90">
                Subscribe to unlock {feature} and all premium features
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="text-6xl">🔒</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Subscription Prompt */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <FlashCard className="p-8 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center text-white text-6xl font-bold mx-auto mb-6 shadow-xl border-4 border-white/20">
              🔒
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Unlock Premium Features
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {feature} is available exclusively to our premium subscribers. 
              Choose a plan that fits your needs and start enjoying all the benefits.
            </p>
            
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What you'll get with premium:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Unlimited rides</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Priority support</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Advanced matching</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Real-time notifications</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Ride history</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Premium features</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/payment">
                <Button size="lg" className="w-full sm:w-auto">
                  Choose a Plan
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </FlashCard>
        </motion.section>

        {/* Plan Preview */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FlashCard className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Our Premium Plans
              </h3>
              <p className="text-gray-600">
                Start with our most popular Gold plan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border border-gray-200 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-xl border-2 border-white/20">
                  🥈
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Silver</h4>
                <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(9.99)}</div>
                <div className="text-gray-600 mb-4">per month</div>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Up to 10 rides per month</li>
                  <li>• Basic support</li>
                  <li>• Standard matching</li>
                </ul>
              </div>

              <div className="text-center p-6 border-2 border-primary-500 rounded-xl bg-primary-50 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Most Popular
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-xl border-2 border-white/20">
                  🥇
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Gold</h4>
                <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(19.99)}</div>
                <div className="text-gray-600 mb-4">per month</div>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Unlimited rides</li>
                  <li>• Priority support</li>
                  <li>• Advanced matching</li>
                  <li>• Premium features</li>
                </ul>
              </div>

              <div className="text-center p-6 border border-gray-200 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-xl border-2 border-white/20">
                  💎
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Platinum</h4>
                <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(39.99)}</div>
                <div className="text-gray-600 mb-4">per month</div>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Everything in Gold</li>
                  <li>• VIP support</li>
                  <li>• Exclusive events</li>
                  <li>• Dedicated manager</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link to="/payment">
                <Button size="lg">
                  Start Your Free Trial
                </Button>
              </Link>
            </div>
          </FlashCard>
        </motion.section>
      </div>
    </div>
  )
}

export default SubscriptionCheck
