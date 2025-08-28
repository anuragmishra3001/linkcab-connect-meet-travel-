import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Simple gradient backgrounds
export const SimpleGradient = ({ children, className = "", variant = "primary" }) => {
  const gradients = {
    primary: "from-blue-50 via-white to-indigo-50",
    secondary: "from-green-50 via-white to-emerald-50",
    accent: "from-purple-50 via-white to-pink-50",
    warm: "from-orange-50 via-white to-red-50"
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[variant]}`}></div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// Simple floating elements
export const SimpleFloating = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      animate={{
        y: [0, -10, 0],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute top-20 left-10 w-3 h-3 bg-blue-400 rounded-full"
    />
    <motion.div
      animate={{
        y: [0, 15, 0],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute top-40 right-20 w-2 h-2 bg-green-400 rounded-full"
    />
    <motion.div
      animate={{
        y: [0, -8, 0],
        opacity: [0.2, 0.5, 0.2],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute bottom-20 left-1/3 w-2 h-2 bg-purple-400 rounded-full"
    />
  </div>
)

// Simple icon with clean design
export const SimpleIcon = ({ icon, size = "md", className = "", color = "primary" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  }

  const colors = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-green-500 text-white",
    accent: "bg-purple-500 text-white",
    warm: "bg-orange-500 text-white"
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${sizes[size]} ${colors[color]} rounded-xl flex items-center justify-center shadow-sm ${className}`}
    >
      <span className="text-lg">{icon}</span>
    </motion.div>
  )
}

// Simple progress indicator
export const SimpleProgress = ({ progress, color = "primary", className = "" }) => {
  const colors = {
    primary: "bg-blue-500",
    secondary: "bg-green-500",
    accent: "bg-purple-500"
  }

  return (
    <div className={`w-full bg-gray-100 rounded-full h-2 overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-full ${colors[color]} rounded-full`}
      />
    </div>
  )
}

// Simple card with clean design
export const SimpleCard = ({ children, className = "", hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -2 } : {}}
    className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
)

// Simple counter with clean animation
export const SimpleCounter = ({ end, duration = 1.5, suffix = "", className = "" }) => {
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

// Simple badge with clean design
export const SimpleBadge = ({ children, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-blue-100 text-blue-700",
    secondary: "bg-green-100 text-green-700",
    accent: "bg-purple-100 text-purple-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700"
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

// Simple wave effect
export const SimpleWave = ({ className = "" }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <svg
      className="absolute bottom-0 left-0 w-full h-8"
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
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        fill="url(#simpleGradient)"
      />
      <defs>
        <linearGradient id="simpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#10b981" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
)

// Simple loading spinner
export const SimpleSpinner = ({ size = "md", color = "primary", className = "" }) => {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  }

  const colors = {
    primary: "border-blue-500",
    secondary: "border-green-500",
    accent: "border-purple-500"
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
        className={`w-full h-full border-2 border-gray-200 border-t-2 rounded-full ${colors[color]}`}
      />
    </div>
  )
}

// Simple dots pattern
export const SimpleDots = ({ count = 20, className = "" }) => {
  const dots = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 2
  }))

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute w-1 h-1 bg-gray-300 rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 3,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Simple divider with icon
export const SimpleDivider = ({ icon = "✨", text = "", className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="flex-1 h-px bg-gray-200"></div>
    {icon && <span className="mx-4 text-gray-400">{icon}</span>}
    {text && <span className="mx-4 text-sm text-gray-500 font-medium">{text}</span>}
    <div className="flex-1 h-px bg-gray-200"></div>
  </div>
)

export default {
  SimpleGradient,
  SimpleFloating,
  SimpleIcon,
  SimpleProgress,
  SimpleCard,
  SimpleCounter,
  SimpleBadge,
  SimpleWave,
  SimpleSpinner,
  SimpleDots,
  SimpleDivider
}
