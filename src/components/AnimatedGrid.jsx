import { motion } from 'framer-motion'

const AnimatedGrid = ({ 
  children, 
  className = '',
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 6,
  staggerDelay = 0.1,
  ...props 
}) => {
  const gridCols = {
    'grid-cols-1': true,
    'md:grid-cols-2': columns.md >= 2,
    'lg:grid-cols-3': columns.lg >= 3,
    'xl:grid-cols-4': columns.xl >= 4,
    '2xl:grid-cols-5': columns['2xl'] >= 5,
  }

  const gridClasses = Object.entries(gridCols)
    .filter(([_, shouldApply]) => shouldApply)
    .map(([className]) => className)
    .join(' ')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid ${gridClasses} gap-${gap} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedGrid
