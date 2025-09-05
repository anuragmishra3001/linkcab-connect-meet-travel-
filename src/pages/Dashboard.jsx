import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FlashCard from '../components/FlashCard'
import Button from '../components/Button'
import { 
  AnimatedProgressBar, 
  ModernBadge,
  AnimatedCounter,
  FloatingShapes 
} from '../components/ModernGraphics'
import { formatCurrency } from '../utils/currency'

const Dashboard = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || '',
    bio: user?.bio || ''
  })
  const [previousRides, setPreviousRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRides: 0,
    totalEarnings: 0,
    averageRating: 0,
    ridesThisMonth: 0
  })

  useEffect(() => {
    // Simulate fetching user's previous rides and stats
    const fetchUserData = async () => {
      setLoading(true)
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - Indian locations and pricing
        const mockRides = [
          {
            id: 1,
            startLocation: 'Connaught Place, New Delhi',
            endLocation: 'India Gate, New Delhi',
            date: '2024-01-15',
            time: '09:00',
            price: 150,
            status: 'completed',
            passengers: 3,
            rating: 4.8,
            earnings: 450
          },
          {
            id: 2,
            startLocation: 'Marine Drive, Mumbai',
            endLocation: 'Gateway of India, Mumbai',
            date: '2024-01-20',
            time: '14:00',
            price: 120,
            status: 'completed',
            passengers: 2,
            rating: 4.9,
            earnings: 240
          },
          {
            id: 3,
            startLocation: 'Kempegowda Airport, Bangalore',
            endLocation: 'MG Road, Bangalore',
            date: '2024-01-25',
            time: '10:30',
            price: 250,
            status: 'completed',
            passengers: 4,
            rating: 4.7,
            earnings: 1000
          },
          {
            id: 4,
            startLocation: 'Park Street, Kolkata',
            endLocation: 'Victoria Memorial, Kolkata',
            date: '2024-02-01',
            time: '08:00',
            price: 100,
            status: 'completed',
            passengers: 3,
            rating: 4.6,
            earnings: 300
          }
        ]

        setPreviousRides(mockRides)
        setStats({
          totalRides: mockRides.length,
          totalEarnings: mockRides.reduce((sum, ride) => sum + ride.earnings, 0),
          averageRating: (mockRides.reduce((sum, ride) => sum + ride.rating, 0) / mockRides.length).toFixed(1),
          ridesThisMonth: mockRides.filter(ride => new Date(ride.date).getMonth() === new Date().getMonth()).length
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update user context
      updateUser({ ...user, ...editForm })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      cancelled: 'danger',
      upcoming: 'warning',
      active: 'primary'
    }
    return <ModernBadge variant={variants[status]}>{status}</ModernBadge>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl animate-spin block mb-4">⏳</span>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <FloatingShapes />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-xl opacity-90">
                Here's your LinkCab dashboard
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <span className="text-6xl animate-bounce">👋</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FlashCard className="text-center py-8">
              <div className="mx-auto mb-6 text-center">
                <span className="text-5xl md:text-6xl animate-pulse">🚗</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={stats.totalRides} />
              </div>
              <div className="text-gray-600">Total Rides</div>
            </FlashCard>

            <FlashCard className="text-center py-8">
              <div className="mx-auto mb-6 text-center">
                <span className="text-5xl md:text-6xl animate-pulse">💰</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={stats.totalEarnings} formatter={formatCurrency} />
              </div>
              <div className="text-gray-600">Total Earnings</div>
            </FlashCard>

            <FlashCard className="text-center py-8">
              <div className="mx-auto mb-6 text-center">
                <span className="text-5xl md:text-6xl animate-pulse">⭐</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={parseFloat(stats.averageRating)} suffix="★" />
              </div>
              <div className="text-gray-600">Average Rating</div>
            </FlashCard>

            <FlashCard className="text-center py-8">
              <div className="mx-auto mb-6 text-center">
                <span className="text-5xl md:text-6xl animate-pulse">📅</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={stats.ridesThisMonth} />
              </div>
              <div className="text-gray-600">This Month</div>
            </FlashCard>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <FlashCard className="p-6">
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 text-center">
                  <span className="text-6xl md:text-7xl font-bold text-primary-600">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {user?.name || 'User'}
                </h2>
                                 <p className="text-gray-600">{user?.email}</p>
                 {user?.isSubscribed && (
                   <div className="mt-2">
                     <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                       <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                       {user.subscription?.planName} Plan
                     </div>
                   </div>
                 )}
               </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📱</span>
                    <span className="text-gray-700">{user?.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🎂</span>
                    <span className="text-gray-700">{user?.age ? `${user.age} years` : 'Age not set'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl mr-3">👤</span>
                    <span className="text-gray-700">{user?.gender || 'Not specified'}</span>
                  </div>
                  {user?.bio && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-gray-700 italic">"{user.bio}"</p>
                    </div>
                  )}
                                     <Button 
                     onClick={() => setIsEditing(true)}
                     className="w-full mt-6"
                   >
                     <span className="mr-2 text-lg">✏️</span>
                     Edit Profile
                   </Button>
                   
                   {!user?.isSubscribed ? (
                     <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl">
                       <h4 className="font-semibold text-gray-900 mb-2">Upgrade to Premium</h4>
                       <p className="text-sm text-gray-600 mb-3">
                         Unlock unlimited rides, priority support, and premium features
                       </p>
                       <div className="space-y-2">
                         <Link to="/payment">
                           <Button size="sm" className="w-full">
                             Choose a Plan
                           </Button>
                         </Link>
                         <Link to="/premium-features">
                           <Button size="sm" variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                             <span className="mr-2">🧪</span>
                             Test Premium Features
                           </Button>
                         </Link>
                       </div>
                     </div>
                   ) : (
                     <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                       <h4 className="font-semibold text-gray-900 mb-2">Premium Member</h4>
                       <p className="text-sm text-gray-600 mb-3">
                         You have access to all premium features
                       </p>
                       <Link to="/premium-features">
                         <Button size="sm" variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                           <span className="mr-2">⭐</span>
                           Explore Premium Features
                         </Button>
                       </Link>
                     </div>
                   )}
                </div>
              ) : (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={editForm.age}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      <span className="mr-2 text-lg">💾</span>
                      Save
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </FlashCard>
          </motion.section>

          {/* Previous Rides Section */}
          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Previous Rides</h2>
              <p className="text-gray-600">Your ride history and earnings</p>
            </div>

            <div className="space-y-6">
              {previousRides.map((ride, index) => (
                <FlashCard key={ride.id} delay={index} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {ride.startLocation} → {ride.endLocation}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <span className="text-lg mr-1">📅</span>
                              {formatDate(ride.date)}
                            </span>
                            <span className="flex items-center">
                              <span className="text-lg mr-1">🕐</span>
                              {formatTime(ride.time)}
                            </span>
                            <span className="flex items-center">
                              <span className="text-lg mr-1">👥</span>
                              {ride.passengers} passengers
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600">
                            {formatCurrency(ride.earnings)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(ride.price)} per seat
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="text-sm font-medium">{ride.rating}</span>
                          </div>
                          {getStatusBadge(ride.status)}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <span className="text-lg mr-1">👁️</span>
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <span className="text-lg mr-1">💬</span>
                            Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </FlashCard>
              ))}
            </div>

            {previousRides.length === 0 && (
              <FlashCard className="p-12 text-center">
                <div className="mx-auto mb-4 inline-block">
                  <span className="text-7xl md:text-8xl animate-pulse">🚗</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No rides yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start your journey by creating your first ride or joining an existing one.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg">
                    <span className="mr-2 text-lg">📢</span>
                    Make Announcement
                  </Button>
                  <Button variant="outline" size="lg">
                    <span className="mr-2 text-lg">🔍</span>
                    Find Rides
                  </Button>
                </div>
              </FlashCard>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
