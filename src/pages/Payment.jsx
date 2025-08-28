import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import FlashCard from '../components/FlashCard'
import Button from '../components/Button'
import { 
  AnimatedCounter,
  FloatingShapes,
  AnimatedGradientText
} from '../components/ModernGraphics'
import { formatCurrency } from '../utils/currency'
import razorpayService from '../services/razorpayService'
import { PAYMENT_STATUS } from '../config/razorpay'

const Payment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, updateUser } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('gold')
  const [loading, setLoading] = useState(false)
  const [paymentStep, setPaymentStep] = useState('plan') // 'plan' or 'payment'
  const [paymentForm, setPaymentForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })

  const plans = [
    {
      id: 'silver',
      name: 'Silver',
      price: 9.99,
      period: 'month',
      icon: '🥈',
      gradient: 'from-gray-500 to-gray-600',
      features: [
        'Up to 10 rides per month',
        'Basic support',
        'Standard matching',
        'Email notifications'
      ],
      popular: false
    },
    {
      id: 'gold',
      name: 'Gold',
      price: 19.99,
      period: 'month',
      icon: '🥇',
      gradient: 'from-yellow-500 to-orange-500',
      features: [
        'Unlimited rides',
        'Priority support',
        'Advanced matching',
        'Real-time notifications',
        'Ride history',
        'Premium features'
      ],
      popular: true
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: 39.99,
      period: 'month',
      icon: '💎',
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'Everything in Gold',
        'VIP support',
        'Exclusive events',
        'Premium matching',
        'Advanced analytics',
        'Priority booking',
        'Dedicated account manager'
      ],
      popular: false
    }
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const planCardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    selected: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  }

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedPlanData = plans.find(plan => plan.id === selectedPlan)
      
      // Prepare order data for Razorpay
      const orderData = {
        amount: selectedPlanData.price,
        currency: 'INR',
        description: `${selectedPlanData.name} Plan Subscription`,
        customerName: paymentForm.name || user?.name || '',
        customerEmail: paymentForm.email || user?.email || '',
        customerPhone: user?.phone || '',
        planId: selectedPlan,
        planName: selectedPlanData.name,
        planPrice: selectedPlanData.price
      }

      // Initialize Razorpay payment
      await razorpayService.initializePayment(
        orderData,
        // Success callback
        async (paymentResult) => {
          try {
            // Update user with subscription info
            updateUser({
              ...user,
              subscription: {
                plan: selectedPlan,
                planName: selectedPlanData.name,
                price: selectedPlanData.price,
                status: 'active',
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
                paymentId: paymentResult.paymentId,
                orderId: paymentResult.orderId
              },
              isSubscribed: true
            })

            // Redirect to success page
            navigate('/payment-success', { 
              state: { 
                plan: selectedPlanData,
                amount: selectedPlanData.price,
                paymentId: paymentResult.paymentId,
                orderId: paymentResult.orderId
              }
            })
          } catch (error) {
            console.error('Error updating user subscription:', error)
            navigate('/payment-cancel', { 
              state: { error: 'Payment successful but subscription update failed' }
            })
          }
        },
        // Failure callback
        (error) => {
          console.error('Payment failed:', error)
          navigate('/payment-cancel', { 
            state: { error: error.error || 'Payment failed' }
          })
        }
      )
    } catch (error) {
      console.error('Payment initialization failed:', error)
      navigate('/payment-cancel', { 
        state: { error: error.message || 'Payment initialization failed' }
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <FloatingShapes count={8} />
      
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your <AnimatedGradientText>Premium Plan</AnimatedGradientText>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock premium features and connect with more travelers. Choose the plan that fits your needs.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {paymentStep === 'plan' ? (
            <motion.div
              key="plan"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Plan Selection */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
              >
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    variants={planCardVariants}
                    whileHover="hover"
                    animate={selectedPlan === plan.id ? "selected" : "visible"}
                    className="relative"
                  >
                    <FlashCard 
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedPlan === plan.id 
                          ? 'ring-2 ring-primary-500 shadow-xl' 
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => handlePlanSelect(plan.id)}
                      variant={selectedPlan === plan.id ? "premium" : "default"}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                        >
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                            Most Popular
                          </span>
                        </motion.div>
                      )}

                      {/* Plan Icon */}
                      <motion.div
                        className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {plan.icon}
                      </motion.div>

                      {/* Plan Name */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                        {plan.name}
                      </h3>

                      {/* Price */}
                      <div className="text-center mb-6">
                        <motion.div
                          className="text-4xl font-bold text-gray-900"
                          initial={{ scale: 1 }}
                          animate={{ scale: selectedPlan === plan.id ? 1.1 : 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {formatCurrency(plan.price)}
                        </motion.div>
                        <div className="text-gray-500">per {plan.period}</div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: featureIndex * 0.1 }}
                            className="flex items-center text-gray-700"
                          >
                            <motion.div
                              className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                              whileHover={{ scale: 1.2 }}
                              transition={{ duration: 0.2 }}
                            >
                              <span className="text-white text-xs">✓</span>
                            </motion.div>
                            {feature}
                          </motion.li>
                        ))}
                      </ul>

                      {/* Select Button */}
                      <motion.div
                        className={`w-full py-3 px-6 rounded-xl font-medium text-center transition-all duration-300 ${
                          selectedPlan === plan.id
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                      </motion.div>
                    </FlashCard>
                  </motion.div>
                ))}
              </motion.div>

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-center"
              >
                <Button
                  onClick={() => setPaymentStep('payment')}
                  size="xl"
                  className="px-12 py-4 text-lg"
                >
                  Continue to Payment
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Payment Form */}
              <FlashCard className="max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-center mb-8"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl mx-auto mb-4 border-2 border-white/20">
                    💳
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Complete Your Payment
                  </h2>
                  <p className="text-gray-600">
                    Secure payment powered by Razorpay
                  </p>
                </motion.div>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Customer Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={paymentForm.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={paymentForm.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Payment Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-gray-50 rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-medium">{selectedPlanData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">1 {selectedPlanData.period}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold text-lg">{formatCurrency(selectedPlanData.price)}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Razorpay Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-blue-50 rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Secure Payment with Razorpay</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-blue-800">PCI DSS Compliant</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-blue-800">256-bit SSL</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-blue-800">Multiple Payment Methods</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-blue-800">Instant Processing</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Payment Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <Button 
                      type="submit"
                      size="xl" 
                      disabled={loading}
                      loading={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Processing Payment...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>Pay {formatCurrency(selectedPlanData.price)}</span>
                          <span className="text-sm opacity-75">via Razorpay</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>

                  {/* Back Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setPaymentStep('plan')}
                      className="w-full"
                    >
                      ← Back to Plans
                    </Button>
                  </motion.div>
                </form>
              </FlashCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Payment
