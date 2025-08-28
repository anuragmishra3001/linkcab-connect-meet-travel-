import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { rideAPI } from '../services/api'
import FlashCard from './FlashCard'
import Button from './Button'
import { ModernIcon, AnimatedProgressBar, ModernBadge } from './ModernGraphics'
import { formatCurrency } from '../utils/currency'

const RideList = ({ filters = {} }) => {
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true)
      try {
        const response = await rideAPI.getRides(filters)
        setRides(response.data.data.rides)
        setError(null)
      } catch (err) {
        console.error('Error fetching rides:', err)
        setError('Failed to load rides. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchRides()
  }, [filters])

  if (loading) {
    return (
      <div className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <FlashCard key={i} animation={false} className="animate-pulse">
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </FlashCard>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12">
        <FlashCard className="p-8 text-center">
          <ModernIcon icon="😔" size="lg" className="mx-auto mb-4" />
          <p className="text-red-600 mb-4 text-lg">{error}</p>
          <Button onClick={() => window.location.reload()} size="lg">
            Try Again
          </Button>
        </FlashCard>
      </div>
    )
  }

  if (rides.length === 0) {
    return (
      <div className="py-12">
        <FlashCard className="p-8 text-center">
          <ModernIcon icon="🚗" size="lg" className="mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            No rides available
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            There are no rides matching your criteria at the moment.
          </p>
          <Link to="/create-ride">
            <Button size="lg">
              📢 Make Announcement
            </Button>
          </Link>
        </FlashCard>
      </div>
    )
  }

  return (
    <div className="py-12">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-8 text-center"
      >
        Available Rides
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rides.map((ride, index) => (
          <RideCard key={ride._id} ride={ride} index={index} />
        ))}
      </div>
    </div>
  )
}

const RideCard = ({ ride, index }) => {
  // Format date and time
  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString)
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' }
    const timeOptions = { hour: '2-digit', minute: '2-digit' }
    
    return {
      date: dateTime.toLocaleDateString(undefined, dateOptions),
      time: dateTime.toLocaleTimeString(undefined, timeOptions)
    }
  }

  const seatsLeft = ride.seats - (ride.passengers?.length || 0)
  const occupancyPercentage = ((ride.seats - seatsLeft) / ride.seats) * 100

  return (
    <FlashCard delay={index} className="p-0 overflow-hidden group">
      <div className="relative">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                  {ride.startLocation?.address} → {ride.endLocation?.address}
                </h3>
                <p className="text-primary-100 font-medium flex items-center">
                  <ModernIcon icon="📅" size="sm" className="mr-2" />
                  {formatDateTime(ride.dateTime).date} at {formatDateTime(ride.dateTime).time}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-2xl font-bold">
                  {formatCurrency(ride.pricePerSeat)}
                </p>
                <p className="text-primary-100 text-sm">per seat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Driver Info */}
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {ride.hostId?.name?.charAt(0) || '?'}
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">
                {ride.hostId?.name || 'Host'}
              </p>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-sm text-gray-600">
                  {ride.hostId?.rating || '4.5'} • {ride.hostId?.totalRides || '10'} rides
                </span>
              </div>
            </div>
          </div>

          {/* Seats Info with Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Available Seats</span>
              <span className="text-lg font-bold text-primary-600">{seatsLeft}</span>
            </div>
            <AnimatedProgressBar 
              progress={100 - occupancyPercentage} 
              color="primary" 
              className="mb-2"
            />
            <p className="text-xs text-gray-500 text-center">
              {seatsLeft} of {ride.seats} seats available
            </p>
          </div>

          {/* Tags with Modern Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {ride.preferences?.genderPreference && ride.preferences.genderPreference !== 'any' && (
              <ModernBadge variant="secondary">
                {ride.preferences.genderPreference === 'male' ? 'Male' : 'Female'} riders only
              </ModernBadge>
            )}
            {ride.preferences?.smoking && (
              <ModernBadge variant="warning">
                Smoking allowed
              </ModernBadge>
            )}
            {ride.preferences?.pets && (
              <ModernBadge variant="success">
                Pets allowed
              </ModernBadge>
            )}
            {ride.preferences?.music && (
              <ModernBadge variant="accent">
                Music
              </ModernBadge>
            )}
          </div>

          {/* Action Button */}
          <Link to={`/ride/${ride._id}`}>
            <Button className="w-full group-hover:scale-105 transition-transform duration-200 shadow-lg">
              <ModernIcon icon="👁️" size="sm" className="mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </FlashCard>
  )
}

export default RideList