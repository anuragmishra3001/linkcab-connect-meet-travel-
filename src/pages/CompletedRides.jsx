import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { rideAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import Button from '../components/Button'
import ReviewForm from '../components/ReviewForm'

const CompletedRides = () => {
  const { user } = useAuth()
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRide, setSelectedRide] = useState(null)
  const [reviewType, setReviewType] = useState(null)
  const [revieweeId, setRevieweeId] = useState(null)

  useEffect(() => {
    const fetchCompletedRides = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch rides where the user is either the host or a passenger
        const response = await rideAPI.getRides({ status: 'completed' })
        
        // Filter rides where the user is either the host or a passenger
        const userRides = response.data.data.rides.filter(ride => {
          const isHost = ride.hostId._id === user.id
          const isPassenger = ride.passengers.some(p => p.user._id === user.id)
          return isHost || isPassenger
        })
        
        setRides(userRides)
      } catch (err) {
        console.error('Error fetching completed rides:', err)
        setError(err.response?.data?.message || 'Failed to load completed rides')
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchCompletedRides()
    }
  }, [user])

  const openReviewForm = (ride, revieweeId, reviewType) => {
    setSelectedRide(ride)
    setRevieweeId(revieweeId)
    setReviewType(reviewType)
  }

  const handleReviewSubmitted = () => {
    // Close the review form after submission
    setSelectedRide(null)
    setRevieweeId(null)
    setReviewType(null)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading completed rides...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center text-red-500 p-4 border border-red-200 rounded-lg">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (rides.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center p-8 border border-gray-200 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">No completed rides yet</h2>
          <p className="text-gray-600 mb-6">You don't have any completed rides to review.</p>
          <Link to="/" className="btn-primary">
            Find a ride
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <Link to="/profile" className="text-primary-600 hover:text-primary-500 mb-4 inline-flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to profile
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Completed Rides
        </h1>
        <p className="text-gray-600 mt-2">Review your past rides and rate your co-travelers</p>
      </div>

      <div className="space-y-6">
        {rides.map((ride) => {
          const isHost = ride.hostId._id === user.id
          const passengers = ride.passengers.filter(p => p.user._id !== user.id)
          
          return (
            <Card key={ride._id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {ride.startLocation.address} to {ride.endLocation.address}
                    </h2>
                    <p className="text-gray-600">
                      {formatDate(ride.dateTime)}
                    </p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Completed
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {isHost ? 'Your Passengers' : 'Ride Host'}
                  </h3>

                  {isHost ? (
                    <div className="space-y-4">
                      {passengers.length > 0 ? (
                        passengers.map((passenger) => (
                          <div key={passenger.user._id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img
                                src={passenger.user.avatar || 'https://via.placeholder.com/40'}
                                alt={passenger.user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{passenger.user.name}</p>
                                <p className="text-sm text-gray-500">{passenger.seats} {passenger.seats === 1 ? 'seat' : 'seats'}</p>
                              </div>
                            </div>
                            <Button 
                              onClick={() => openReviewForm(ride, passenger.user._id, 'host-to-passenger')}
                              variant="outline"
                              size="sm"
                            >
                              Rate Passenger
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No passengers for this ride</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={ride.hostId.avatar || 'https://via.placeholder.com/40'}
                          alt={ride.hostId.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{ride.hostId.name}</p>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm text-gray-600">{ride.hostId.rating?.toFixed(1) || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => openReviewForm(ride, ride.hostId._id, 'passenger-to-host')}
                        variant="outline"
                        size="sm"
                      >
                        Rate Host
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <Link 
                    to={`/ride/${ride._id}`} 
                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                  >
                    View Ride Details
                  </Link>
                </div>
              </div>

              {/* Review Form */}
              {selectedRide && selectedRide._id === ride._id && (
                <div className="bg-gray-50 p-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Leave a Review
                  </h3>
                  <ReviewForm 
                    revieweeId={revieweeId}
                    rideId={ride._id}
                    reviewType={reviewType}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default CompletedRides