import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { createAutocomplete } from '../utils/googleMaps'

const LocationAutocomplete = ({ 
  onLocationSelect, 
  placeholder = "Search for a location...",
  className = "",
  required = false,
  value = "",
  onChange = null
}) => {
  const [address, setAddress] = useState(value)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const inputRef = useRef(null)
  const autocompleteRef = useRef(null)

  // Initialize autocomplete
  useEffect(() => {
    if (inputRef.current) {
      setIsLoading(true)
      createAutocomplete(inputRef.current)
        .then((autocomplete) => {
          autocompleteRef.current = autocomplete
          
          // Listen for place selection
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace()
            
            if (place.geometry && place.geometry.location) {
              const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address || place.name,
                placeId: place.place_id
              }
              
              setAddress(location.address)
              setError(null)
              
              // Call parent callback
              onLocationSelect(location)
              
              // Call onChange if provided
              if (onChange) {
                onChange(location.address)
              }
            } else {
              setError('Please select a valid location from the suggestions')
            }
          })
        })
        .catch((error) => {
          console.error('Error initializing autocomplete:', error)
          setError('Failed to initialize location search')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [onLocationSelect, onChange])

  // Update local state when value prop changes
  useEffect(() => {
    setAddress(value)
  }, [value])

  const handleAddressChange = (e) => {
    const newValue = e.target.value
    setAddress(newValue)
    setError(null)
    
    // Call onChange if provided
    if (onChange) {
      onChange(newValue)
    }
  }

  const clearLocation = () => {
    setAddress('')
    setError(null)
    onLocationSelect(null)
    
    if (onChange) {
      onChange('')
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Address Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">📍</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
        />
        {address && (
          <button
            type="button"
            onClick={clearLocation}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        💡 Start typing to see location suggestions
      </p>
    </div>
  )
}

export default LocationAutocomplete
