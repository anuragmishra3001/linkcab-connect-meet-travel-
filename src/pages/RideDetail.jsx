import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Chat from '../components/Chat'
import ReviewList from '../components/ReviewList'
import PassengerMatches from '../components/PassengerMatches'
import { useAuth } from '../context/AuthContext'
import { paymentAPI, rideAPI } from '../services/api'
import { formatCurrency } from '../utils/currency'

const RideDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [selectedSeats, setSelectedSeats] = useState(1)
  const [completingRide, setCompletingRide] = useState(false)
  const [completeError, setCompleteError] = useState(null)

  // Mock ride data - in a real app, this would come from an API
  const ride = {
    id: id,
    driver: {
      name: 'Sarah Johnson',
      rating: 4.8,
      trips: 127,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    origin: 'San Francisco, CA',
    destination: 'Los Angeles, CA',
    date: '2024-01-15',
    time: '09:00',
    seats: 3,
    price: 45.00,
    vehicle: {
      type: 'Toyota Camry',
      color: 'Silver',
      year: '2022'
    },
    description: 'Heading to LA for a business meeting. I prefer quiet passengers who don\'t mind some light music. No smoking please.',
    preferences: {
      smoking: false,
      pets: false,
      music: true
    },
    passengers: [
      { name: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
      { name: 'Emma Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' }
    ]
  }

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleBooking = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Create a checkout session with Stripe
      const response = await paymentAPI.createCheckoutSession(id, selectedSeats)
      
      // Redirect to Stripe Checkout
      window.location.href = response.data.url
    } catch (err) {
      console.error('Error creating checkout session:', err)
      setError(err.response?.data?.message || 'Failed to create checkout session')
      setLoading(false)
    }
  }
  
  const handleCompleteRide = async () => {
    try {
      setCompletingRide(true)
      setCompleteError(null)
      
      await rideAPI.completeRide(id)
      
      // Refresh the page to show updated status
      window.location.reload()
    } catch (err) {
      console.error('Error completing ride:', err)
      setCompleteError(err.response?.data?.message || 'Failed to complete ride')
      setCompletingRide(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="text-primary-600 hover:text-primary-500 mb-4 inline-flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to rides
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Ride Details
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Information */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Route</h2>
              <div className="flex items-center space-x-4">
                {user && ride.hostId._id === user.id && ride.status === 'active' && (
                  <div>
                    {completeError && (
                      <div className="text-red-500 text-sm mb-2">
                        {completeError}
                      </div>
                    )}
                    <Button 
                      onClick={handleCompleteRide} 
                      variant="success" 
                      size="sm"
                      disabled={completingRide}
                    >
                      {completingRide ? 'Completing...' : 'Complete Ride'}
                    </Button>
                  </div>
                )}
                <span className="text-2xl font-bold text-primary-600">{formatCurrency(ride.price)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">{ride.origin}</p>
                  <p className="text-sm text-gray-500">Pickup location</p>
                </div>
              </div>
              
              <div className="border-l-2 border-gray-200 ml-1.5 h-8"></div>
              
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">{ride.destination}</p>
                  <p className="text-sm text-gray-500">Destination</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{new Date(ride.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Time</p>
                  <p className="font-medium">{ride.time}</p>
                </div>
                <div>
                  <p className="text-gray-500">Available Seats</p>
                  <p className="font-medium">{ride.seats}</p>
                </div>
                <div>
                  <p className="text-gray-500">Vehicle</p>
                  <p className="font-medium">{ride.vehicle.type}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Driver Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Driver</h2>
            <div className="flex items-center space-x-4">
              <img
                src={ride.driver.avatar}
                alt={ride.driver.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{ride.driver.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm text-gray-600">{ride.driver.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{ride.driver.trips} trips</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About this ride</h2>
            <p className="text-gray-700 leading-relaxed">{ride.description}</p>
          </Card>

          {/* Preferences */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Smoking</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ride.preferences.smoking 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {ride.preferences.smoking ? 'Allowed' : 'Not allowed'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Pets</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ride.preferences.pets 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {ride.preferences.pets ? 'Allowed' : 'Not allowed'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Music</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ride.preferences.music 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {ride.preferences.music ? 'Allowed' : 'Not allowed'}
                </span>
              </div>
            </div>
          </Card>

          {/* Passengers */}
          {ride.passengers.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Other passengers</h2>
              <div className="space-y-3">
                {ride.passengers.map((passenger, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={passenger.avatar}
                      alt={passenger.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-900">{passenger.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          {/* Passenger Matches (if user is host and ride is active) */}
          {user && ride.hostId._id === user.id && ride.status === 'active' && (
            <PassengerMatches 
              rideId={id} 
              onSelectPassenger={(passenger) => {
                // This function would handle inviting a passenger
                // For now, we'll just show an alert
                alert(`Invitation would be sent to ${passenger.name}`)
              }} 
            />
          )}

          {/* Reviews (if ride is completed) */}
          {ride.status === 'completed' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
              <ReviewList rideId={id} />
            </Card>
          )}
          
          {/* Chat */}
          <Chat rideId={id} />
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Book this ride</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of seats
                </label>
                <select
                  id="seats"
                  value={selectedSeats}
                  onChange={(e) => setSelectedSeats(Number(e.target.value))}
                  className="input-field"
                >
                  {[...Array(ride.seats)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'seat' : 'seats'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Price per seat</span>
                                      <span>{formatCurrency(ride.price)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Seats selected</span>
                  <span>{selectedSeats}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(ride.price * selectedSeats)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-2">
                  {error}
                </div>
              )}
              
              <Button 
                onClick={handleBooking} 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Book Now'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RideDetail