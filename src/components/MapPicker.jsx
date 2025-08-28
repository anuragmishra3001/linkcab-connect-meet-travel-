import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { createAutocomplete, createMap, addMarker, reverseGeocode } from '../utils/googleMaps'
import Button from './Button'

const MapPicker = ({ 
  onLocationSelect, 
  initialLocation = null, 
  placeholder = "Search for a location...",
  className = "" 
}) => {
  const [address, setAddress] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)
  const [isMapVisible, setIsMapVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mapRef = useRef(null)
  const inputRef = useRef(null)
  const autocompleteRef = useRef(null)

  // Initialize autocomplete
  useEffect(() => {
    if (inputRef.current) {
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
              
              setSelectedLocation(location)
              setAddress(location.address)
              
              // Update map if visible
              if (map) {
                map.setCenter(place.geometry.location)
                map.setZoom(15)
                
                // Update or create marker
                if (marker) {
                  marker.setPosition(place.geometry.location)
                } else {
                  addMarker(map, place.geometry.location).then(setMarker)
                }
              }
              
              // Call parent callback
              onLocationSelect(location)
            }
          })
        })
        .catch((error) => {
          console.error('Error initializing autocomplete:', error)
          setError('Failed to initialize location search')
        })
    }
  }, [map, marker, onLocationSelect])

  // Initialize map
  useEffect(() => {
    if (mapRef.current && isMapVisible) {
      const center = selectedLocation 
        ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
        : { lat: 20.5937, lng: 78.9629 } // Center of India

      createMap(mapRef.current, { center, zoom: selectedLocation ? 15 : 10 })
        .then((mapInstance) => {
          setMap(mapInstance)
          
          // Add marker if location is selected
          if (selectedLocation) {
            addMarker(mapInstance, { lat: selectedLocation.lat, lng: selectedLocation.lng })
              .then(setMarker)
          }
          
          // Add click listener to map
          mapInstance.addListener('click', async (event) => {
            const lat = event.latLng.lat()
            const lng = event.latLng.lng()
            
            try {
              setLoading(true)
              const result = await reverseGeocode(lat, lng)
              
              const location = {
                lat,
                lng,
                address: result.address,
                placeId: result.placeId
              }
              
              setSelectedLocation(location)
              setAddress(location.address)
              
              // Update marker
              if (marker) {
                marker.setPosition(event.latLng)
              } else {
                addMarker(mapInstance, event.latLng).then(setMarker)
              }
              
              // Call parent callback
              onLocationSelect(location)
            } catch (error) {
              console.error('Error reverse geocoding:', error)
              setError('Failed to get address for selected location')
            } finally {
              setLoading(false)
            }
          })
        })
        .catch((error) => {
          console.error('Error creating map:', error)
          setError('Failed to load map')
        })
    }
  }, [isMapVisible, selectedLocation, onLocationSelect])

  const handleAddressChange = (e) => {
    setAddress(e.target.value)
    setError(null)
  }

  const toggleMap = () => {
    setIsMapVisible(!isMapVisible)
  }

  const clearLocation = () => {
    setSelectedLocation(null)
    setAddress('')
    if (marker) {
      marker.setMap(null)
      setMarker(null)
    }
    onLocationSelect(null)
  }

  return (
    <div className={`space-y-4 ${className}`}>
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
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
        />
        {selectedLocation && (
          <button
            onClick={clearLocation}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
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

      {/* Map Toggle Button */}
      <Button
        type="button"
        variant="outline"
        onClick={toggleMap}
        className="w-full"
      >
        {isMapVisible ? 'Hide Map' : 'Show Map'} 📍
      </Button>

      {/* Map Container */}
      {isMapVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          <div 
            ref={mapRef} 
            className="w-full h-64 md:h-80"
          />
          
          {/* Map Instructions */}
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              💡 Click on the map to select a location, or search for an address above
            </p>
          </div>
        </motion.div>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Selected Location:</p>
              <p className="text-sm text-green-700 mt-1">{selectedLocation.address}</p>
              <p className="text-xs text-green-600 mt-1">
                Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
            {loading && (
              <div className="ml-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default MapPicker
