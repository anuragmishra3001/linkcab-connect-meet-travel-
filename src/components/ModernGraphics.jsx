import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Modern gradient backgrounds with enhanced animations
export const GradientBackground = ({ children, className = "", animated = true }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50"></div>
    
    {animated && (
      <>
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.1),transparent_50%)]"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </>
    )}
    
    <div className="relative z-10">{children}</div>
  </div>
)

// Enhanced floating geometric shapes with better performance
export const FloatingShapes = ({ count = 6, className = "" }) => {
  const shapes = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
    color: ['primary', 'secondary', 'accent'][Math.floor(Math.random() * 3)]
  }))

  const colorClasses = {
    primary: 'from-primary-400/20 to-primary-600/20',
    secondary: 'from-secondary-400/20 to-secondary-600/20',
    accent: 'from-accent-400/20 to-accent-600/20'
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute w-${Math.floor(shape.size / 4)} h-${Math.floor(shape.size / 4)} bg-gradient-to-br ${colorClasses[shape.color]} rounded-full blur-xl`}
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay
          }}
        />
      ))}
    </div>
  )
}

// Enhanced modern icon with better animations
export const ModernIcon = ({ icon, size = "md", className = "", animated = true }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  }

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  }

  return (
    <motion.div
      variants={animated ? iconVariants : {}}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={`${sizes[size]} bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      <motion.span 
        className="text-white text-lg"
        animate={animated ? {
          y: [0, -2, 0]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {icon}
      </motion.span>
    </motion.div>
  )
}

// Enhanced animated progress bar
export const AnimatedProgressBar = ({ progress, color = "primary", className = "", animated = true }) => {
  const colors = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    accent: "from-accent-500 to-accent-600",
    success: "from-green-500 to-green-600",
    warning: "from-yellow-500 to-yellow-600",
    danger: "from-red-500 to-red-600"
  }

  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ 
          width: `${progress}%`,
          opacity: 1
        }}
        transition={{ 
          duration: animated ? 1.5 : 0.5, 
          ease: "easeOut",
          opacity: { duration: 0.3 }
        }}
        className={`h-full bg-gradient-to-r ${colors[color]} rounded-full shadow-sm relative overflow-hidden`}
      >
        {animated && (
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
      </motion.div>
    </div>
  )
}

// Enhanced glass card with better effects
export const GlassCard = ({ children, className = "", animated = true }) => (
  <motion.div 
    className={`bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}
    whileHover={animated ? { 
      scale: 1.02,
      y: -5
    } : {}}
    initial={animated ? { opacity: 0, y: 20 } : {}}
    animate={animated ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
)

// Enhanced animated stats counter with better performance
export const AnimatedCounter = ({ end, duration = 2, suffix = "", className = "", formatter = null, animated = true }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!animated) {
      setCount(end)
      return
    }

    let startTime = null
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration, animated])

  const displayValue = formatter ? formatter(count) : count.toLocaleString()

  return (
    <motion.span 
      className={`font-bold ${className}`}
      initial={animated ? { opacity: 0, scale: 0.8 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {displayValue}{suffix}
    </motion.span>
  )
}

// Enhanced modern badge with animations
export const ModernBadge = ({ children, variant = "primary", className = "", animated = true }) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white"
  }

  return (
    <motion.span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 ${variants[variant]} ${className}`}
      whileHover={animated ? { scale: 1.05 } : {}}
      whileTap={animated ? { scale: 0.95 } : {}}
      initial={animated ? { opacity: 0, y: 10 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.span>
  )
}

// Enhanced wave effect with smoother animations
export const WaveEffect = ({ className = "", animated = true }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <svg
      className="absolute bottom-0 left-0 w-full h-16"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <motion.path
        initial={animated ? { d: "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" } : {}}
        animate={animated ? {
          d: [
            "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",
            "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z",
            "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          ]
        } : {}}
        transition={animated ? {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
        fill="url(#gradient)"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#22c55e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f3771e" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  </div>
)

// Enhanced modern loading spinner
export const ModernSpinner = ({ size = "md", className = "", color = "primary" }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  }

  const colors = {
    primary: "border-t-primary-500",
    secondary: "border-t-secondary-500",
    accent: "border-t-accent-500",
    white: "border-t-white"
  }

  return (
    <div className={`${sizes[size]} ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`w-full h-full border-2 border-gray-200 ${colors[color]} rounded-full`}
      />
    </div>
  )
}

// Enhanced particle effect background with better performance
export const ParticleBackground = ({ count = 30, className = "", animated = true }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }))

  if (!animated) return null

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary-400/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay
          }}
        />
      ))}
    </div>
  )
}

// New: Animated gradient text
export const AnimatedGradientText = ({ children, className = "", animated = true }) => (
  <motion.span
    className={`bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent ${className}`}
    animate={animated ? {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
    } : {}}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{
      backgroundSize: '200% 200%'
    }}
  >
    {children}
  </motion.span>
)

// New: Smooth scroll indicator
export const SmoothScrollIndicator = ({ className = "" }) => (
  <motion.div
    className={`fixed bottom-8 right-8 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center cursor-pointer z-50 ${className}`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  >
    <motion.div
      animate={{ y: [0, -2, 0] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="text-gray-600"
    >
      ↑
    </motion.div>
  </motion.div>
)

export default {
  GradientBackground,
  FloatingShapes,
  ModernIcon,
  AnimatedProgressBar,
  GlassCard,
  AnimatedCounter,
  ModernBadge,
  WaveEffect,
  ModernSpinner,
  ParticleBackground,
  AnimatedGradientText,
  SmoothScrollIndicator
}
