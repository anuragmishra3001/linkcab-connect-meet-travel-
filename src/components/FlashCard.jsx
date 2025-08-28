import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FlashCard = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = true,
  animation = true,
  delay = 0,
  variant = 'default',
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Enhanced base classes with better transitions
  const baseClasses = 'bg-white rounded-2xl border border-gray-100 shadow-sm backdrop-blur-sm'
  
  // Improved hover effects with Tailwind transitions
  const hoverClasses = hover ? `
    hover:shadow-xl hover:border-gray-200 hover:scale-[1.02] 
    transition-all duration-300 ease-out
    hover:bg-gradient-to-br hover:from-white hover:to-gray-50/50
  ` : ''
  
  // Variant-specific styling
  const variantClasses = {
    default: '',
    elevated: 'shadow-lg hover:shadow-2xl',
    glass: 'bg-white/80 backdrop-blur-md border-white/20',
    gradient: 'bg-gradient-to-br from-white to-gray-50/30',
    premium: 'bg-gradient-to-br from-white via-gray-50/50 to-white shadow-lg'
  }
  
  const classes = `
    ${baseClasses} 
    ${padding} 
    ${hoverClasses} 
    ${variantClasses[variant]}
    ${className}
  `.trim()
  
  // Enhanced animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      scale: 0.95,
      rotateX: -2,
      filter: 'blur(2px)'
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        delay: delay * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
        filter: { duration: 0.3 }
      }
    },
    hover: {
      y: -6,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  }

  // Stagger animation for children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay * 0.1
      }
    }
  }

  if (!animation) {
    return (
      <div 
        className={`${classes} relative z-30 will-change-transform`} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className={`${classes} relative z-30 will-change-transform`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
      {...props}
    >
      {/* Enhanced hover overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-secondary-50/30 rounded-2xl pointer-events-none"
          />
        )}
      </AnimatePresence>
      
      {/* Subtle border glow on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-primary-200/50"
          />
        )}
      </AnimatePresence>
      
      <motion.div variants={containerVariants}>
        {children}
      </motion.div>
    </motion.div>
  )
}

export default FlashCard
