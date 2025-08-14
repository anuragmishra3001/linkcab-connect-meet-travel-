const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = true,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-xl border border-gray-200 transition-all duration-200'
  const hoverClasses = hover ? 'hover:shadow-md hover:border-gray-300' : ''
  const classes = `${baseClasses} ${padding} ${hoverClasses} ${className}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export default Card 