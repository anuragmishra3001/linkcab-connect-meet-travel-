import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Modern gradient backgrounds
export const GradientBackground = ({ children, className = "" }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.1),transparent_50%)]"></div>
    <div className="relative z-10">{children}</div>
  </div>
)

// Floating geometric shapes
export const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-primary-400/20 to-primary-600/20 rounded-full blur-xl"
    />
    <motion.div
      animate={{
        y: [0, 30, 0],
        x: [0, 10, 0],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-secondary-400/20 to-secondary-600/20 rounded-full blur-xl"
    />
    <motion.div
      animate={{
        y: [0, -15, 0],
        rotate: [0, -180, -360],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-br from-accent-400/20 to-accent-600/20 rounded-full blur-xl"
    />
  </div>
)

// Modern icon with gradient
export const ModernIcon = ({ icon, size = "md", className = "" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`${sizes[size]} bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg ${className}`}
    >
      <span className="text-white text-lg">{icon}</span>
    </motion.div>
  )
}

// Animated progress bar
export const AnimatedProgressBar = ({ progress, color = "primary", className = "" }) => {
  const colors = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    accent: "from-accent-500 to-accent-600"
  }

  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full bg-gradient-to-r ${colors[color]} rounded-full shadow-sm`}
      />
    </div>
  )
}

// Modern card with glass effect
export const GlassCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-xl ${className}`}>
    {children}
  </div>
)

// Animated stats counter
export const AnimatedCounter = ({ end, duration = 2, suffix = "", className = "" }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
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
  }, [end, duration])

  return (
    <span className={`font-bold ${className}`}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// Modern badge
export const ModernBadge = ({ children, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white"
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

// Animated wave effect
export const WaveEffect = ({ className = "" }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <svg
      className="absolute bottom-0 left-0 w-full h-16"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <motion.path
        initial={{ d: "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" }}
        animate={{
          d: [
            "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",
            "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z",
            "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
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

// Modern loading spinner
export const ModernSpinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
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
        className="w-full h-full border-2 border-gray-200 border-t-primary-500 rounded-full"
      />
    </div>
  )
}

// Particle effect background
export const ParticleBackground = ({ count = 50, className = "" }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10
  }))

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
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

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
  ParticleBackground
}
