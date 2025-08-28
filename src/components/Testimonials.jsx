import { motion } from 'framer-motion'
import FlashCard from './FlashCard'
import { formatCurrency } from '../utils/currency'
import AnimatedGrid from './AnimatedGrid'
import { AnimatedCounter, FloatingShapes } from './ModernGraphics'

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Daily Commuter",
      avatar: "👩‍💼",
      rating: 5,
      text: `LinkCab has completely transformed my daily commute! I've saved over ${formatCurrency(200)} this month and met some amazing people. The app is so easy to use and the drivers are always punctual.`,
      location: "New York, NY",
      modernIcon: "💼"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Business Traveler",
      avatar: "👨‍💻",
      rating: 5,
      text: "As a frequent business traveler, LinkCab has been a game-changer. Reliable rides, professional drivers, and great conversation. Highly recommend for anyone looking to save money and reduce their carbon footprint.",
      location: "San Francisco, CA",
      modernIcon: "💻"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Student",
      avatar: "👩‍🎓",
      rating: 5,
      text: "Being a student on a budget, LinkCab has been perfect for me. I can get to campus affordably while meeting fellow students. The community aspect is what makes it special!",
      location: "Austin, TX",
      modernIcon: "🎓"
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Environmental Advocate",
      avatar: "👨‍🌾",
      rating: 5,
      text: "I love how LinkCab promotes sustainable transportation. Every ride shared means one less car on the road. The platform makes it so easy to make eco-friendly choices.",
      location: "Portland, OR",
      modernIcon: "🌱"
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "Remote Worker",
      avatar: "👩‍💻",
      rating: 5,
      text: "Working remotely means I need flexible transportation. LinkCab has been perfect for my occasional office visits and client meetings. The drivers are always professional and the app is intuitive.",
      location: "Seattle, WA",
      modernIcon: "🏠"
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Weekend Traveler",
      avatar: "👨‍🎨",
      rating: 5,
      text: "I use LinkCab for weekend trips and it's been fantastic! I've discovered new places and made friends along the way. The community features and safety measures give me peace of mind.",
      location: "Denver, CO",
      modernIcon: "🎨"
    }
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.span 
        key={i} 
        className={i < rating ? "star-filled" : "star-empty"}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: i * 0.1 }}
      >
        ★
      </motion.span>
    ))
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <FloatingShapes />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center text-white text-5xl font-bold shadow-xl mx-auto mb-6 border-2 border-white/20">
            💬
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied users who have transformed their travel experience with LinkCab
          </p>
        </motion.div>

        <AnimatedGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={8}>
          {testimonials.map((testimonial, index) => (
            <FlashCard key={testimonial.id} delay={index} className="p-8 relative group">
              {/* Quote icon with animation */}
              <motion.div 
                className="absolute top-6 right-6 text-4xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                "
              </motion.div>
              
              {/* Rating with animated stars */}
              <div className="flex items-center mb-4">
                <div className="flex mr-3">
                  {renderStars(testimonial.rating)}
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {testimonial.rating}.0
                </span>
              </div>

              {/* Testimonial text */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed italic text-lg">
                "{testimonial.text}"
              </blockquote>

              {/* Author info with modern avatar */}
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4 shadow-xl border-2 border-white/20">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 flex items-center">
                    <span className="text-lg mr-2">{testimonial.modernIcon}</span>
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {testimonial.location}
                  </p>
                </div>
              </div>
            </FlashCard>
          ))}
        </AnimatedGrid>

        {/* Stats section with animated counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <FlashCard className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-8 relative overflow-hidden">
            <FloatingShapes />
            <div className="relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    <AnimatedCounter end={4.9} suffix="★" />
                  </div>
                  <div className="text-primary-100 font-medium">Average Rating</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    <AnimatedCounter end={50} suffix="K+" />
                  </div>
                  <div className="text-primary-100 font-medium">Happy Users</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    <AnimatedCounter end={95} suffix="%" />
                  </div>
                  <div className="text-primary-100 font-medium">Satisfaction Rate</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    <AnimatedCounter end={24} suffix="/7" />
                  </div>
                  <div className="text-primary-100 font-medium">Support Available</div>
                </div>
              </div>
            </div>
          </FlashCard>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
