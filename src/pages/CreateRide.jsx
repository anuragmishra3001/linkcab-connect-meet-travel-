import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import MapPicker from '../components/MapPicker'
import { rideAPI } from '../services/api'
import { CURRENCY_CONFIG } from '../utils/currency'

const CreateRide = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    startLocation: {
      lat: '',
      lng: '',
      address: ''
    },
    endLocation: {
      lat: '',
      lng: '',
      address: ''
    },
    date: '',
    time: '',
    seats: 1,
    pricePerSeat: '',
    description: '',
    vehicleType: 'car',
    genderPreference: 'any',
    allowSmoking: false,
    allowPets: false,
    allowMusic: true
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleStartLocationSelect = (location) => {
    if (location) {
      setFormData(prev => ({
        ...prev,
        startLocation: {
          lat: location.lat.toString(),
          lng: location.lng.toString(),
          address: location.address
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        startLocation: {
          lat: '',
          lng: '',
          address: ''
        }
      }))
    }
  }

  const handleEndLocationSelect = (location) => {
    if (location) {
      setFormData(prev => ({
        ...prev,
        endLocation: {
          lat: location.lat.toString(),
          lng: location.lng.toString(),
          address: location.address
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        endLocation: {
          lat: '',
          lng: '',
          address: ''
        }
      }))
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Handle nested location objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      // Handle regular fields
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Format the data according to the backend model
      // Convert string coordinates to numbers
      const startLocation = {
        lat: parseFloat(formData.startLocation.lat),
        lng: parseFloat(formData.startLocation.lng),
        address: formData.startLocation.address
      }
      
      const endLocation = {
        lat: parseFloat(formData.endLocation.lat),
        lng: parseFloat(formData.endLocation.lng),
        address: formData.endLocation.address
      }
      
      // Combine date and time into a single dateTime
      const dateTime = new Date(`${formData.date}T${formData.time}`)
      
      const rideData = {
        startLocation,
        endLocation,
        dateTime: dateTime.toISOString(),
        seats: parseInt(formData.seats),
        pricePerSeat: parseFloat(formData.pricePerSeat),
        description: formData.description,
        vehicle: {
          type: formData.vehicleType
        },
        preferences: {
          genderPreference: formData.genderPreference,
          smoking: formData.allowSmoking,
          pets: formData.allowPets,
          music: formData.allowMusic
        }
      }
      
      // Call the API to make the announcement
      const response = await rideAPI.createRide(rideData)
      
      // Redirect to the ride detail page
      navigate(`/ride/${response.data.data.ride._id}`)
    } catch (err) {
      console.error('Error making announcement:', err)
      setError(err.response?.data?.message || 'Failed to make announcement. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Make an Announcement
        </h1>
        <p className="text-gray-600">
          Share your journey and help others travel sustainably
        </p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Start Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Location *
            </label>
            <MapPicker
              onLocationSelect={handleStartLocationSelect}
              placeholder="Enter your starting location..."
              className="mb-4"
            />
          </div>
          
          {/* End Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Location *
            </label>
            <MapPicker
              onLocationSelect={handleEndLocationSelect}
              placeholder="Enter your destination..."
              className="mb-4"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          </div>

          {/* Seats and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-2">
                Available Seats *
              </label>
              <select
                id="seats"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="1">1 seat</option>
                <option value="2">2 seats</option>
                <option value="3">3 seats</option>
                <option value="4">4 seats</option>
                <option value="5">5 seats</option>
                <option value="6">6 seats</option>
              </select>
            </div>
            <div>
              <label htmlFor="pricePerSeat" className="block text-sm font-medium text-gray-700 mb-2">
                Price per Seat *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">{CURRENCY_CONFIG.symbol}</span>
                <input
                  type="number"
                  id="pricePerSeat"
                  name="pricePerSeat"
                  value={formData.pricePerSeat}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="input-field pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="input-field"
            >
              <option value="car">Car</option>
              <option value="suv">SUV</option>
              <option value="van">Van</option>
              <option value="truck">Truck</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input-field"
              placeholder="Tell passengers about your ride, any special requirements, or additional information..."
            />
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ride Preferences</h3>
            
            {/* Gender Preference */}
            <div className="mb-4">
              <label htmlFor="genderPreference" className="block text-sm font-medium text-gray-700 mb-2">
                Gender Preference
              </label>
              <select
                id="genderPreference"
                name="genderPreference"
                value={formData.genderPreference}
                onChange={handleChange}
                className="input-field"
              >
                <option value="any">Any gender</option>
                <option value="male">Male only</option>
                <option value="female">Female only</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="allowSmoking"
                  name="allowSmoking"
                  type="checkbox"
                  checked={formData.allowSmoking}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="allowSmoking" className="ml-2 block text-sm text-gray-700">
                  Smoking allowed
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="allowPets"
                  name="allowPets"
                  type="checkbox"
                  checked={formData.allowPets}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="allowPets" className="ml-2 block text-sm text-gray-700">
                  Pets allowed
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="allowMusic"
                  name="allowMusic"
                  type="checkbox"
                  checked={formData.allowMusic}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="allowMusic" className="ml-2 block text-sm text-gray-700">
                  Music allowed
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}
          
          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Make Announcement'}
            </Button>
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full" disabled={loading}>
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default CreateRide