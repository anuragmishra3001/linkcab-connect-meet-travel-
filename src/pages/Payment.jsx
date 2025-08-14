import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import FlashCard from '../components/FlashCard'
import Button from '../components/Button'
import { 
  AnimatedCounter,
  FloatingShapes 
} from '../components/ModernGraphics'

const Payment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, updateUser } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('gold')
  const [loading, setLoading] = useState(false)
  const [paymentStep, setPaymentStep] = useState('plan') // 'plan' or 'payment'
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
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

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId)
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update user with subscription info
      const selectedPlanData = plans.find(plan => plan.id === selectedPlan)
      updateUser({
        ...user,
        subscription: {
          plan: selectedPlan,
          planName: selectedPlanData.name,
          price: selectedPlanData.price,
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        },
        isSubscribed: true
      })

      // Redirect to success page
      navigate('/payment-success', { 
        state: { 
          plan: selectedPlanData,
          amount: selectedPlanData.price
        }
      })
    } catch (error) {
      console.error('Payment failed:', error)
      navigate('/payment-cancel')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan)

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
                Choose Your Plan
              </h1>
              <p className="text-xl opacity-90">
                Unlock the full potential of LinkCab with our premium plans
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="text-6xl">💳</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {paymentStep === 'plan' ? (
          <>
            {/* Plans Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Select Your Subscription Plan
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Choose the plan that best fits your travel needs and unlock premium features
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <FlashCard 
                      className={`p-8 relative cursor-pointer transition-all duration-300 ${
                        selectedPlan === plan.id 
                          ? 'ring-4 ring-primary-500 scale-105' 
                          : 'hover:scale-102'
                      }`}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                            Most Popular
                          </div>
                        </div>
                      )}

                      <div className="text-center mb-6">
                        <div className={`w-20 h-20 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl mx-auto mb-4 border-2 border-white/20`}>
                          {plan.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <div className="text-4xl font-bold text-gray-900 mb-1">
                          ${plan.price}
                        </div>
                        <div className="text-gray-600">per {plan.period}</div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-gray-700">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Button 
                        className={`w-full ${
                          selectedPlan === plan.id 
                            ? 'bg-primary-600 hover:bg-primary-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => handlePlanSelect(plan.id)}
                      >
                        {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                      </Button>
                    </FlashCard>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Continue Button */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <FlashCard className="p-8 max-w-2xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Selected Plan: {selectedPlanData.name}
                  </h3>
                  <p className="text-gray-600">
                    You'll be charged ${selectedPlanData.price} per {selectedPlanData.period}
                  </p>
                </div>
                <Button 
                  size="xl" 
                  onClick={() => setPaymentStep('payment')}
                  className="w-full md:w-auto"
                >
                  Continue to Payment
                </Button>
              </FlashCard>
            </motion.section>
          </>
        ) : (
          <>
            {/* Payment Form */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <FlashCard className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl mx-auto mb-4 border-2 border-white/20">
                    💳
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Complete Your Payment
                  </h2>
                  <p className="text-gray-600">
                    {selectedPlanData.name} Plan - ${selectedPlanData.price} per {selectedPlanData.period}
                  </p>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentForm.cardNumber}
                      onChange={(e) => setPaymentForm(prev => ({
                        ...prev,
                        cardNumber: formatCardNumber(e.target.value)
                      }))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      maxLength="19"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentForm.expiryDate}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          expiryDate: formatExpiryDate(e.target.value)
                        }))}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        maxLength="5"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentForm.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={paymentForm.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={paymentForm.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">{selectedPlanData.name}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${selectedPlanData.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary-600">${selectedPlanData.price}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setPaymentStep('plan')}
                      className="flex-1"
                    >
                      Back to Plans
                    </Button>
                    <Button 
                      type="submit" 
                      loading={loading}
                      className="flex-1"
                    >
                      {loading ? 'Processing...' : `Pay $${selectedPlanData.price}`}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center text-yellow-800 text-sm">
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-2">
                      🔧
                    </div>
                    <span className="font-medium">Development Mode</span>
                  </div>
                  <p className="text-yellow-700 text-xs mt-1">
                    This is a dummy payment gateway. Any card details will work for testing.
                  </p>
                </div>
              </FlashCard>
            </motion.section>
          </>
        )}
      </div>
    </div>
  )
}

export default Payment
