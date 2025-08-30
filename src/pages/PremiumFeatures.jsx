import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import FlashCard from '../components/FlashCard'
import Button from '../components/Button'
import FeatureTour from '../components/FeatureTour'
import { 
  AnimatedGradientText,
  ModernBadge,
  FloatingShapes
} from '../components/ModernGraphics'

const PremiumFeatures = () => {
  const [currentPlan, setCurrentPlan] = useState(null)
  const [hasPremium, setHasPremium] = useState(false)
  const [isTourOpen, setIsTourOpen] = useState(false)

  useEffect(() => {
    // Check subscription status
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setHasPremium(user?.isSubscribed || false)
    setCurrentPlan(user?.subscription?.plan || null)
  }, [])

  const premiumFeatures = [
    {
      id: 'advanced-matching',
      name: 'Advanced Ride Matching',
      description: 'AI-powered matching algorithm for better ride connections',
      icon: '🤖',
      plan: 'gold'
    },
    {
      id: 'real-time-chat',
      name: 'Real-time Chat',
      description: 'Instant messaging with ride partners',
      icon: '💬',
      plan: 'silver'
    },
    {
      id: 'priority-support',
      name: 'Priority Support',
      description: '24/7 dedicated customer support',
      icon: '🎧',
      plan: 'gold'
    },
    {
      id: 'ride-analytics',
      name: 'Ride Analytics',
      description: 'Detailed insights about your ride patterns',
      icon: '📊',
      plan: 'gold'
    },
    {
      id: 'exclusive-events',
      name: 'Exclusive Events',
      description: 'Access to premium events and meetups',
      icon: '🎉',
      plan: 'platinum'
    },
    {
      id: 'dedicated-manager',
      name: 'Dedicated Account Manager',
      description: 'Personal account manager for VIP support',
      icon: '👨‍💼',
      plan: 'platinum'
    }
  ]

  const getPlanColor = (plan) => {
    const colors = {
      silver: 'from-gray-500 to-gray-600',
      gold: 'from-yellow-500 to-orange-500',
      platinum: 'from-purple-500 to-pink-500'
    }
    return colors[plan] || colors.silver
  }

  const getPlanName = (plan) => {
    const names = {
      silver: 'Silver',
      gold: 'Gold',
      platinum: 'Platinum'
    }
    return names[plan] || 'Free'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <FloatingShapes count={6} />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Premium <AnimatedGradientText>Features</AnimatedGradientText>
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Discover all the amazing features available to our premium subscribers
            </p>
            
            {/* Tour Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                size="lg"
                onClick={() => setIsTourOpen(true)}
                className="px-8 py-4 text-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
              >
                <span className="mr-2">🎬</span>
                Take a Tour of Premium Features
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <FlashCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Your Current Plan
                </h2>
                <p className="text-gray-600">
                  {hasPremium ? `You have access to ${getPlanName(currentPlan)} features` : 'You are on the free plan'}
                </p>
              </div>
              <div className="text-right">
                {hasPremium ? (
                  <ModernBadge variant="success" className="text-lg px-4 py-2">
                    {getPlanName(currentPlan)} Plan
                  </ModernBadge>
                ) : (
                  <ModernBadge variant="warning" className="text-lg px-4 py-2">
                    Free Plan
                  </ModernBadge>
                )}
              </div>
            </div>
          </FlashCard>
        </motion.div>

        {/* Quick Tour CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <FlashCard className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                  🎬
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Want to see Premium Features in action?
                  </h3>
                  <p className="text-gray-600">
                    Take an interactive tour and see how our premium features work
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsTourOpen(true)}
                className="ml-4"
              >
                Start Tour
              </Button>
            </div>
          </FlashCard>
        </motion.div>

        {/* Premium Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {premiumFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <FlashCard className="p-6 h-full">
                {/* Feature Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${getPlanColor(feature.plan)} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                  {feature.icon}
                </div>

                {/* Plan Badge */}
                <div className="mb-4">
                  <ModernBadge variant={feature.plan === 'platinum' ? 'danger' : feature.plan === 'gold' ? 'warning' : 'primary'}>
                    {getPlanName(feature.plan)} Plan
                  </ModernBadge>
                </div>

                {/* Feature Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>

                {/* Access Status */}
                {hasPremium && currentPlan && (
                  <div className="text-sm">
                    {(() => {
                      const planHierarchy = { 'silver': 1, 'gold': 2, 'platinum': 3 }
                      const userPlanLevel = planHierarchy[currentPlan] || 0
                      const requiredPlanLevel = planHierarchy[feature.plan] || 0
                      const hasAccess = userPlanLevel >= requiredPlanLevel

                      return hasAccess ? (
                        <div className="flex items-center text-green-600">
                          <span className="mr-2">✓</span>
                          <span>Available</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center text-red-600">
                            <span className="mr-2">✗</span>
                            <span>Upgrade Required</span>
                          </div>
                          <Link to="/payment">
                            <Button size="sm" className="w-full">
                              <span className="mr-2">⭐</span>
                              Upgrade to {getPlanName(feature.plan)}
                            </Button>
                          </Link>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* Upgrade Button for Non-Premium Users */}
                {!hasPremium && (
                  <div className="space-y-3">
                    <div className="flex items-center text-red-600">
                      <span className="mr-2">🔒</span>
                      <span>Premium Required</span>
                    </div>
                    <Link to="/payment">
                      <Button size="sm" className="w-full">
                        <span className="mr-2">⭐</span>
                        Upgrade to {getPlanName(feature.plan)}
                      </Button>
                    </Link>
                  </div>
                )}
              </FlashCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Upgrade CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <FlashCard className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Upgrade?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already enjoying premium features and better ride experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/payment">
                <Button size="lg" className="px-8">
                  <span className="mr-2">⭐</span>
                  Choose Your Plan
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setIsTourOpen(true)}
              >
                <span className="mr-2">🎬</span>
                Take Another Tour
              </Button>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </FlashCard>
        </motion.div>
      </div>

      {/* Feature Tour Modal */}
      <FeatureTour 
        isOpen={isTourOpen} 
        onClose={() => setIsTourOpen(false)} 
      />
    </div>
  )
}

export default PremiumFeatures
