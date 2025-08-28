import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  animation = true,
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg 
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    will-change-transform
    relative overflow-hidden
  `
  
  const variants = {
    primary: `
      btn-primary
      hover:scale-105 hover:shadow-lg
      active:scale-95
      transform-gpu
    `,
    secondary: `
      btn-secondary
      hover:scale-105 hover:shadow-lg
      active:scale-95
      transform-gpu
    `,
    outline: `
      btn-outline
      hover:scale-105 hover:shadow-md
      active:scale-95
      transform-gpu
    `,
    ghost: `
      text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-md
      hover:scale-105
      active:scale-95
      transform-gpu
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 
      hover:from-red-600 hover:to-red-700 
      text-white shadow-md hover:shadow-lg 
      focus:ring-red-500
      hover:scale-105
      active:scale-95
      transform-gpu
    `,
    success: `
      bg-gradient-to-r from-green-500 to-green-600 
      hover:from-green-600 hover:to-green-700 
      text-white shadow-md hover:shadow-lg 
      focus:ring-green-500
      hover:scale-105
      active:scale-95
      transform-gpu
    `,
    premium: `
      bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
      hover:from-purple-600 hover:via-pink-600 hover:to-red-600 
      text-white shadow-lg hover:shadow-xl 
      focus:ring-purple-500
      hover:scale-105
      active:scale-95
      transform-gpu
    `
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 gap-2',
    lg: 'px-6 py-3 text-lg gap-2',
    xl: 'px-8 py-4 text-xl gap-3'
  }
  
  const classes = `
    ${baseClasses} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${className}
  `.trim()
  
  // Animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    loading: {
      scale: [1, 0.98, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const content = (
    <>
      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: loading ? 0 : 1 }}
        className="flex items-center gap-2"
      >
        {icon && iconPosition === 'left' && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {icon}
          </motion.span>
        )}
        
        <span>{children}</span>
        
        {icon && iconPosition === 'right' && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {icon}
          </motion.span>
        )}
      </motion.div>
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-lg"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </>
  )

  if (!animation) {
    return (
      <button 
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    )
  }

  return (
    <motion.button 
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      animate={loading ? "loading" : "initial"}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </motion.button>
  )
}

export default Button 