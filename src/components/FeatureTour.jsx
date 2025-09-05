import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from './Button'
import { 
  AnimatedGradientText,
  ModernBadge
} from './ModernGraphics'

const FeatureTour = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [testMode, setTestMode] = useState(false)
  const [testResults, setTestResults] = useState({})

  const tourSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Premium Features Tour!',
      description: 'Let\'s explore what makes LinkCab Premium special. You\'ll see how our advanced features can enhance your ride-sharing experience. You can also test premium features in demo mode!',
      icon: '🚀',
      color: 'from-blue-500 to-indigo-600',
      action: 'Start Tour',
      testable: false
    },
    {
      id: 'advanced-matching',
      title: 'Advanced Ride Matching',
      description: 'Our AI-powered algorithm finds the perfect ride partners based on route compatibility, time preferences, and even music taste!',
      icon: '🤖',
      color: 'from-purple-500 to-pink-600',
      demo: {
        type: 'matching',
        data: {
          compatibility: 95,
          routeMatch: 'Perfect',
          timePreference: 'Aligned',
          musicTaste: 'Similar'
        }
      },
      action: 'See How It Works',
      testable: true,
      testAction: 'Test Matching Algorithm'
    },
    {
      id: 'real-time-chat',
      title: 'Real-time Chat',
      description: 'Stay connected with your ride partners through instant messaging. Share updates, coordinate pickup times, and build connections.',
      icon: '💬',
      color: 'from-green-500 to-emerald-600',
      demo: {
        type: 'chat',
        messages: [
          { sender: 'you', text: 'Hi! Are you still going to the airport?', time: '2:30 PM' },
          { sender: 'partner', text: 'Yes, leaving in 10 minutes!', time: '2:31 PM' },
          { sender: 'you', text: 'Perfect! See you soon 🚗', time: '2:32 PM' }
        ]
      },
      action: 'Try Chat Demo',
      testable: true,
      testAction: 'Test Live Chat'
    },
    {
      id: 'analytics',
      title: 'Ride Analytics',
      description: 'Track your ride history, earnings, and performance metrics. Get insights to optimize your ride-sharing experience.',
      icon: '📊',
      color: 'from-orange-500 to-red-600',
      demo: {
        type: 'analytics',
        data: {
          totalRides: 24,
          avgRating: 4.8,
          earnings: 480,
          monthlyGrowth: 15
        }
      },
      action: 'View Analytics',
      testable: true,
      testAction: 'Generate Report'
    },
    {
      id: 'priority-support',
      title: 'Priority Support',
      description: 'Get instant help with dedicated support agents. Average response time: under 2 minutes for premium users.',
      icon: '🎧',
      color: 'from-teal-500 to-cyan-600',
      demo: {
        type: 'support',
        data: {
          queuePosition: 1,
          agent: 'Sarah (Premium)',
          status: 'Connected',
          responseTime: '1.5 min'
        }
      },
      action: 'Experience Support',
      testable: true,
      testAction: 'Connect to Support'
    },
    {
      id: 'exclusive-events',
      title: 'Exclusive Events',
      description: 'Access to premium meetups, networking events, and exclusive LinkCab community gatherings.',
      icon: '🎉',
      color: 'from-yellow-500 to-orange-600',
      demo: {
        type: 'events',
        data: {
          upcoming: 'LinkCab Premium Meetup',
          date: 'Next Week',
          attendees: 150,
          location: 'Downtown Hub'
        }
      },
      action: 'See Events',
      testable: true,
      testAction: 'RSVP to Event'
    },
    {
      id: 'finale',
      title: 'Ready to Upgrade?',
      description: 'You\'ve seen what Premium has to offer. Join thousands of users who are already enjoying these amazing features!',
      icon: '⭐',
      color: 'from-pink-500 to-rose-600',
      action: 'Choose Your Plan',
      testable: false
    }
  ]

  const currentStepData = tourSteps[currentStep]

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const startAutoPlay = () => {
    setIsPlaying(true)
  }

  const stopAutoPlay = () => {
    setIsPlaying(false)
  }

  const testFeature = async (featureId) => {
    setTestMode(true)
    
    // Simulate testing different features
    const testSimulations = {
      'advanced-matching': {
        message: 'Testing AI matching algorithm...',
        duration: 2000,
        result: 'Found 3 compatible ride partners with 95% compatibility!'
      },
      'real-time-chat': {
        message: 'Connecting to chat server...',
        duration: 1500,
        result: 'Chat connected! You can now message ride partners instantly.'
      },
      'analytics': {
        message: 'Generating your ride analytics report...',
        duration: 2500,
        result: 'Report generated! You have 24 rides with 4.8★ average rating.'
      },
      'priority-support': {
        message: 'Connecting to priority support...',
        duration: 1000,
        result: 'Connected to Sarah (Premium Support Agent) in 1.2 seconds!'
      },
      'exclusive-events': {
        message: 'Checking available events...',
        duration: 1800,
        result: 'RSVP successful! You\'re now registered for the Premium Meetup.'
      }
    }

    const test = testSimulations[featureId]
    if (test) {
      // Show loading message
      setTestResults(prev => ({
        ...prev,
        [featureId]: { status: 'loading', message: test.message }
      }))

      // Simulate test duration
      setTimeout(() => {
        setTestResults(prev => ({
          ...prev,
          [featureId]: { 
            status: 'success', 
            message: test.result,
            timestamp: new Date().toLocaleTimeString()
          }
        }))
        setTestMode(false)
      }, test.duration)
    }
  }

  useEffect(() => {
    let interval
    if (isPlaying && currentStep < tourSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1)
      }, 4000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, tourSteps.length])

  useEffect(() => {
    if (currentStep === tourSteps.length - 1) {
      setIsPlaying(false)
    }
  }, [currentStep, tourSteps.length])

  const renderDemo = (demo, featureId) => {
    if (!demo) return null

    // Show test results if available
    const testResult = testResults[featureId]
    if (testResult) {
      return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mt-4">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">
              {testResult.status === 'loading' ? '⏳' : '✅'}
            </span>
            <div>
              <div className="font-medium">
                {testResult.status === 'loading' ? 'Testing Feature...' : 'Test Complete!'}
              </div>
              {testResult.timestamp && (
                <div className="text-sm text-gray-600">{testResult.timestamp}</div>
              )}
            </div>
          </div>
          <div className={`text-sm ${testResult.status === 'loading' ? 'text-blue-600' : 'text-green-600'}`}>
            {testResult.message}
          </div>
          {testResult.status === 'loading' && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          )}
        </div>
      )
    }

    switch (demo.type) {
      case 'matching':
        return (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Compatibility Score</span>
              <span className="text-2xl font-bold text-green-600">{demo.data.compatibility}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Route Match</span>
                <span className="text-green-600">✓ {demo.data.routeMatch}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Time Preference</span>
                <span className="text-green-600">✓ {demo.data.timePreference}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Music Taste</span>
                <span className="text-yellow-600">~ {demo.data.musicTaste}</span>
              </div>
            </div>
          </div>
        )

      case 'chat':
        return (
          <div className="bg-gray-50 rounded-lg p-4 mt-4 h-48 overflow-y-auto">
            <div className="space-y-3">
              {demo.messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'you' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg px-3 py-2 max-w-xs ${
                    message.sender === 'you' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-75 mt-1">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{demo.data.totalRides}</div>
              <div className="text-sm text-gray-600">Total Rides</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{demo.data.avgRating}★</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">${demo.data.earnings}</div>
              <div className="text-sm text-gray-600">Earnings</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">+{demo.data.monthlyGrowth}%</div>
              <div className="text-sm text-gray-600">Growth</div>
            </div>
          </div>
        )

      case 'support':
        return (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mt-4">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">🎧</span>
              <div>
                <div className="font-medium">Priority Support</div>
                <div className="text-sm text-green-600">Response: {demo.data.responseTime}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Queue Position</span>
                <span className="text-green-600 font-medium">#{demo.data.queuePosition}</span>
              </div>
              <div className="flex justify-between">
                <span>Agent</span>
                <span className="text-green-600 font-medium">{demo.data.agent}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-green-600 font-medium">{demo.data.status}</span>
              </div>
            </div>
          </div>
        )

      case 'events':
        return (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mt-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🎉</div>
              <div className="font-medium text-lg mb-1">{demo.data.upcoming}</div>
              <div className="text-sm text-gray-600 mb-3">{demo.data.date}</div>
              <div className="flex justify-between text-sm">
                <span>Attendees</span>
                <span className="font-medium">{demo.data.attendees}+</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Location</span>
                <span className="font-medium">{demo.data.location}</span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Premium Features Tour</h2>
                <p className="text-white/80">Step {currentStep + 1} of {tourSteps.length}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 h-1">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* Step Icon */}
              <div className={`w-20 h-20 bg-gradient-to-br ${currentStepData.color} rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg`}>
                {currentStepData.icon}
              </div>

              {/* Step Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                <AnimatedGradientText>{currentStepData.title}</AnimatedGradientText>
              </h3>

              {/* Step Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {currentStepData.description}
              </p>

              {/* Demo Content */}
              {renderDemo(currentStepData.demo, currentStepData.id)}

              {/* Auto-play Controls */}
              {currentStep < tourSteps.length - 1 && (
                <div className="mt-6 flex justify-center space-x-2">
                  <Button
                    size="sm"
                    variant={isPlaying ? "outline" : "default"}
                    onClick={isPlaying ? stopAutoPlay : startAutoPlay}
                  >
                    {isPlaying ? '⏸️ Pause' : '▶️ Auto-play'}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {tourSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep 
                        ? 'bg-primary-500' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <div className="flex space-x-3">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={prevStep}>
                    ← Previous
                  </Button>
                )}
                
                {/* Test Feature Button */}
                {currentStepData.testable && !testResults[currentStepData.id] && (
                  <Button 
                    variant="outline" 
                    onClick={() => testFeature(currentStepData.id)}
                    disabled={testMode}
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <span className="mr-2">🧪</span>
                    {currentStepData.testAction}
                  </Button>
                )}
                
                {currentStep === tourSteps.length - 1 ? (
                  <Link to="/payment">
                    <Button onClick={onClose}>
                      {currentStepData.action}
                    </Button>
                  </Link>
                ) : (
                  <Button onClick={nextStep}>
                    {currentStepData.action} →
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FeatureTour
