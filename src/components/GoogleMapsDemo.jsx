import { useState } from 'react'
import { motion } from 'framer-motion'
import MapPicker from './MapPicker'
import LocationAutocomplete from './LocationAutocomplete'
import FlashCard from './FlashCard'
import Button from './Button'

const GoogleMapsDemo = () => {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [autocompleteLocation, setAutocompleteLocation] = useState(null)

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Google Maps Integration Demo
        </h1>
        <p className="text-gray-600">
          Test the Google Maps API integration with address autocomplete and map picker functionality
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MapPicker Demo */}
        <FlashCard className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🗺️ MapPicker Component
          </h2>
          <p className="text-gray-600 mb-4">
            Interactive map with address autocomplete and click-to-select functionality
          </p>
          
          <MapPicker
            onLocationSelect={setSelectedLocation}
            placeholder="Search for a location..."
          />

          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <h3 className="font-semibold text-blue-800 mb-2">Selected Location:</h3>
              <p className="text-sm text-blue-700">{selectedLocation.address}</p>
              <p className="text-xs text-blue-600 mt-1">
                Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
              </p>
            </motion.div>
          )}
        </FlashCard>

        {/* LocationAutocomplete Demo */}
        <FlashCard className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🔍 LocationAutocomplete Component
          </h2>
          <p className="text-gray-600 mb-4">
            Simple address autocomplete without map interface
          </p>
          
          <LocationAutocomplete
            onLocationSelect={setAutocompleteLocation}
            placeholder="Enter a location..."
          />

          {autocompleteLocation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <h3 className="font-semibold text-green-800 mb-2">Selected Location:</h3>
              <p className="text-sm text-green-700">{autocompleteLocation.address}</p>
              <p className="text-xs text-green-600 mt-1">
                Lat: {autocompleteLocation.lat.toFixed(6)}, Lng: {autocompleteLocation.lng.toFixed(6)}
              </p>
            </motion.div>
          )}
        </FlashCard>
      </div>

      {/* Instructions */}
      <FlashCard className="p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          📋 How to Use
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">MapPicker Features:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Address autocomplete with suggestions</li>
              <li>• Interactive map with click-to-select</li>
              <li>• Reverse geocoding for map clicks</li>
              <li>• Draggable markers</li>
              <li>• Location validation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">LocationAutocomplete Features:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Address autocomplete without map</li>
              <li>• Place suggestions as you type</li>
              <li>• Location validation</li>
              <li>• Clear functionality</li>
              <li>• Lightweight and fast</li>
            </ul>
          </div>
        </div>
      </FlashCard>

      {/* API Status */}
      <FlashCard className="p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🔧 API Status
        </h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm text-gray-700">Google Maps JavaScript API</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm text-gray-700">Google Places API</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm text-gray-700">Google Geocoding API</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          💡 Make sure you have a valid Google Maps API key configured in index.html
        </p>
      </FlashCard>
    </div>
  )
}

export default GoogleMapsDemo
