import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import FlashCard from '../components/FlashCard'
import AnimatedGrid from '../components/AnimatedGrid'
import RideSearch from '../components/RideSearch'
import RideList from '../components/RideList'
import Testimonials from '../components/Testimonials'
import { 
  GradientBackground, 
  FloatingShapes, 
  ModernIcon, 
  AnimatedCounter,
  WaveEffect,
  ParticleBackground 
} from '../components/ModernGraphics'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [searchFilters, setSearchFilters] = useState({})
  const [hasSearched, setHasSearched] = useState(false)
  
  const handleSearch = (filters) => {
    setSearchFilters(filters)
    // Only set hasSearched to true if there are actual filters
    setHasSearched(Object.keys(filters).length > 0)
  }
  
  const features = [
    {
      icon: '🚗',
      title: 'Find Rides',
      description: 'Discover rides going your way from verified drivers in your area.',
      gradient: 'from-blue-500 to-cyan-500',
      modernIcon: '🎯'
    },
    {
      icon: '💰',
      title: 'Save Money',
      description: 'Split travel costs and save money on your daily commute.',
      gradient: 'from-green-500 to-emerald-500',
      modernIcon: '💎'
    },
    {
      icon: '🌱',
      title: 'Go Green',
      description: 'Reduce your carbon footprint by sharing rides with others.',
      gradient: 'from-emerald-500 to-teal-500',
      modernIcon: '🌿'
    },
    {
      icon: '🤝',
      title: 'Build Community',
      description: 'Connect with fellow travelers and make new friends.',
      gradient: 'from-purple-500 to-pink-500',
      modernIcon: '🌟'
    }
  ]

  const stats = [
    { number: 10000, label: 'Active Users', icon: '👥', suffix: '+', gradient: 'from-blue-500 to-cyan-500' },
    { number: 50000, label: 'Rides Shared', icon: '🚗', suffix: '+', gradient: 'from-green-500 to-emerald-500' },
    { number: 95, label: 'Satisfaction', icon: '⭐', suffix: '%', gradient: 'from-yellow-500 to-orange-500' },
    { number: 24, label: 'Support', icon: '🛟', suffix: '/7', gradient: 'from-purple-500 to-pink-500' }
  ]

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-20">
      {/* Hero Section with Modern Graphics */}
      <GradientBackground className="relative">
        <FloatingShapes />
        <ParticleBackground count={30} />
        <motion.section 
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="text-center py-16 md:py-24 relative z-10"
        >
          <div className="max-w-5xl mx-auto px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto mb-8"
            >
              <div className="text-center">
                <span className="text-8xl md:text-9xl animate-bounce">🚀</span>
              </div>
            </motion.div>
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                Connect & Ride
              </span>
              <br />
              <span className="text-gray-800">with LinkCab</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Join thousands of people who are already sharing rides, saving money, and making new connections on their daily journeys.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link to="/signup">
                <Button size="xl" className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/create-ride">
                <Button variant="outline" size="xl" className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl">
                  📢 Make Announcement
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
        <WaveEffect />
      </GradientBackground>

      {/* Stats Section with Animated Counters */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-16 bg-gradient-to-r from-gray-50 to-gray-100"
      >
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedGrid columns={{ sm: 2, md: 4 }} gap={8}>
            {stats.map((stat, index) => (
              <FlashCard key={index} delay={index} className="text-center py-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-5 rounded-2xl" 
                     style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                     data-gradient={stat.gradient}></div>
                <div className="relative z-10">
                  <div className="relative mx-auto mb-6 text-center">
                    <span className="text-5xl md:text-6xl animate-pulse">{stat.icon}</span>
                    {/* Add floating sparkles */}
                    <div className="absolute -top-2 -right-2 animate-ping">
                      <span className="text-xs">✨</span>
                    </div>
                    <div className="absolute -bottom-2 -left-2 animate-ping" style={{ animationDelay: '0.5s' }}>
                      <span className="text-xs">✨</span>
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </FlashCard>
            ))}
          </AnimatedGrid>
        </div>
      </motion.section>

      {/* Features Section with Modern Icons */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-16"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose LinkCab?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of ride-sharing with our innovative platform designed for modern travelers.
            </p>
          </div>
          
          <AnimatedGrid columns={{ sm: 1, md: 2, lg: 4 }} gap={8}>
            {features.map((feature, index) => (
              <FlashCard key={index} delay={index} className="text-center py-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity duration-300" 
                     style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                     data-gradient={feature.gradient}></div>
                <div className="relative z-10">
                  <div className="mx-auto mb-6 text-center">
                    <span className="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300 block">{feature.modernIcon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </FlashCard>
            ))}
          </AnimatedGrid>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Ride Search Section with Enhanced Graphics */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50"></div>
        <FloatingShapes />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 inline-block">
              <span className="text-6xl md:text-7xl animate-pulse">🎯</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Ride
            </h2>
            <p className="text-xl text-gray-600">
              Search for available rides or create your own journey.
            </p>
          </div>
          <RideSearch onSearch={handleSearch} />
          
          {/* Only show RideList if user has performed a search */}
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <RideList filters={searchFilters} />
            </motion.div>
          )}
          
          {/* Show initial state when no search has been performed */}
          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <FlashCard className="p-12 max-w-2xl mx-auto">
                <div className="mx-auto mb-6 inline-block">
                  <span className="text-7xl md:text-8xl animate-pulse">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Find Your Ride?
                </h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Use the search form above to find available rides matching your criteria. 
                  You can search by location, destination, and date to find the perfect ride for your journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/create-ride">
                    <Button size="lg" className="w-full sm:w-auto">
                      <span className="mr-2 text-lg">📢</span>
                      Make Announcement
                    </Button>
                  </Link>
                  <Link to="/rides">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      <span className="mr-2 text-lg">📋</span>
                      Browse All Rides
                    </Button>
                  </Link>
                </div>
              </FlashCard>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* CTA Section with Enhanced Graphics */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-16"
      >
        <div className="max-w-4xl mx-auto px-4">
          <FlashCard className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white text-center py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
            <FloatingShapes />
            <div className="relative z-10">
              <div className="mx-auto mb-6 inline-block">
                <span className="text-8xl md:text-9xl animate-bounce">🚀</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Join LinkCab today and discover a better way to travel. Connect with fellow travelers, save money, and make every journey memorable.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="secondary" size="xl" className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl">
                        <span className="mr-2 text-lg">📊</span>
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link to="/create-ride">
                      <Button variant="outline" size="xl" className="w-full sm:w-auto text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600 shadow-xl">
                        <span className="mr-2 text-lg">📢</span>
                        Make Announcement
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button variant="secondary" size="xl" className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl">
                        Sign Up Now
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="xl" className="w-full sm:w-auto text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600 shadow-xl">
                        Log In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </FlashCard>
        </div>
      </motion.section>
    </div>
  )
}

export default Home