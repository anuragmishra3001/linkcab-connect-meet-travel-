import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FlashCard = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = true,
  animation = true,
  delay = 0,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const baseClasses = 'bg-white rounded-2xl border border-gray-100 shadow-sm backdrop-blur-sm'
  const hoverClasses = hover ? 'hover:shadow-xl hover:border-gray-200 hover:scale-[1.02]' : ''
  const classes = `${baseClasses} ${padding} ${hoverClasses} ${className}`
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      rotateX: -5
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.4,
        delay: delay * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }

  if (!animation) {
    return (
      <div 
        className={classes} 
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
      className={classes}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 rounded-2xl pointer-events-none"
          />
        )}
      </AnimatePresence>
      {children}
    </motion.div>
  )
}

export default FlashCard
