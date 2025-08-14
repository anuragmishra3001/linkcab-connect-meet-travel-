import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import FlashCard from '../components/FlashCard'
import Button from '../components/Button'
import SubscriptionCheck from '../components/SubscriptionCheck'
import { 
  AnimatedCounter,
  FloatingShapes 
} from '../components/ModernGraphics'

const Connect = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('connections')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Mock data - replace with actual API calls
  const [connections, setConnections] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [suggestedUsers, setSuggestedUsers] = useState([])

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock connections data
      setConnections([
        {
          id: 1,
          name: 'Sarah Johnson',
          avatar: '👩‍💼',
          email: 'sarah.johnson@email.com',
          location: 'New York, NY',
          mutualConnections: 3,
          lastActive: '2 hours ago',
          rating: 4.8,
          totalRides: 45,
          status: 'online'
        },
        {
          id: 2,
          name: 'Michael Chen',
          avatar: '👨‍💻',
          email: 'michael.chen@email.com',
          location: 'San Francisco, CA',
          mutualConnections: 1,
          lastActive: '1 day ago',
          rating: 4.9,
          totalRides: 67,
          status: 'offline'
        },
        {
          id: 3,
          name: 'Emily Rodriguez',
          avatar: '👩‍🎓',
          email: 'emily.rodriguez@email.com',
          location: 'Austin, TX',
          mutualConnections: 2,
          lastActive: '30 minutes ago',
          rating: 4.7,
          totalRides: 23,
          status: 'online'
        }
      ])

      // Mock pending requests
      setPendingRequests([
        {
          id: 4,
          name: 'David Thompson',
          avatar: '👨‍🌾',
          email: 'david.thompson@email.com',
          location: 'Portland, OR',
          mutualConnections: 1,
          message: 'Hi! I saw we have similar travel patterns. Would love to connect!',
          sentAt: '2 days ago'
        },
        {
          id: 5,
          name: 'Lisa Wang',
          avatar: '👩‍💻',
          email: 'lisa.wang@email.com',
          location: 'Seattle, WA',
          mutualConnections: 0,
          message: 'Looking for reliable travel partners in the area.',
          sentAt: '1 day ago'
        }
      ])

      // Mock sent requests
      setSentRequests([
        {
          id: 6,
          name: 'James Wilson',
          avatar: '👨‍🎨',
          email: 'james.wilson@email.com',
          location: 'Denver, CO',
          mutualConnections: 2,
          status: 'pending',
          sentAt: '3 days ago'
        },
        {
          id: 7,
          name: 'Alex Kim',
          avatar: '👨‍🔬',
          email: 'alex.kim@email.com',
          location: 'Boston, MA',
          mutualConnections: 1,
          status: 'pending',
          sentAt: '1 week ago'
        }
      ])

      // Mock suggested users
      setSuggestedUsers([
        {
          id: 8,
          name: 'Rachel Green',
          avatar: '👩‍🏫',
          email: 'rachel.green@email.com',
          location: 'Chicago, IL',
          mutualConnections: 2,
          rating: 4.6,
          totalRides: 34,
          reason: '2 mutual connections'
        },
        {
          id: 9,
          name: 'Tom Anderson',
          avatar: '👨‍🚀',
          email: 'tom.anderson@email.com',
          location: 'Miami, FL',
          mutualConnections: 1,
          rating: 4.8,
          totalRides: 89,
          reason: 'Similar travel routes'
        },
        {
          id: 10,
          name: 'Maria Garcia',
          avatar: '👩‍⚕️',
          email: 'maria.garcia@email.com',
          location: 'Los Angeles, CA',
          mutualConnections: 0,
          rating: 4.9,
          totalRides: 156,
          reason: 'High-rated driver'
        }
      ])
      
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleAcceptRequest = async (requestId) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const request = pendingRequests.find(r => r.id === requestId)
    setPendingRequests(prev => prev.filter(r => r.id !== requestId))
    setConnections(prev => [...prev, { ...request, id: Date.now() }])
    
    setLoading(false)
  }

  const handleRejectRequest = async (requestId) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setPendingRequests(prev => prev.filter(r => r.id !== requestId))
    
    setLoading(false)
  }

  const handleSendRequest = async (userId) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const user = suggestedUsers.find(u => u.id === userId)
    setSuggestedUsers(prev => prev.filter(u => u.id !== userId))
    setSentRequests(prev => [...prev, { ...user, status: 'pending', sentAt: 'Just now' }])
    
    setLoading(false)
  }

  const handleCancelRequest = async (requestId) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const request = sentRequests.find(r => r.id === requestId)
    setSentRequests(prev => prev.filter(r => r.id !== requestId))
    setSuggestedUsers(prev => [...prev, { ...request, reason: 'Previously sent request' }])
    
    setLoading(false)
  }

  const handleRemoveConnection = async (connectionId) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setConnections(prev => prev.filter(c => c.id !== connectionId))
    
    setLoading(false)
  }

  const tabs = [
    { id: 'connections', label: 'Connections', count: connections.length, icon: '👥' },
    { id: 'pending', label: 'Pending', count: pendingRequests.length, icon: '⏳' },
    { id: 'sent', label: 'Sent', count: sentRequests.length, icon: '📤' },
    { id: 'suggestions', label: 'Suggestions', count: suggestedUsers.length, icon: '💡' }
  ]

  const renderConnectionCard = (connection) => (
    <FlashCard key={connection.id} className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl border-2 border-white/20">
              {connection.avatar}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              connection.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{connection.name}</h3>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{connection.location}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{connection.email}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <span className="text-lg mr-1">⭐</span>
                      {connection.rating} ({connection.totalRides} rides)
                    </span>
                    <span className="flex items-center">
                      <span className="text-lg mr-1">🤝</span>
                      {connection.mutualConnections} mutual
                    </span>
                    <span className="flex items-center">
                      <span className="text-lg mr-1">🕐</span>
                      {connection.lastActive}
                    </span>
                  </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <span className="text-lg mr-1">💬</span>
                Message
              </Button>
              <Button size="sm" variant="outline">
                <span className="text-lg mr-1">🚗</span>
                View Rides
              </Button>
            </div>
          </div>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => handleRemoveConnection(connection.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <span className="text-lg">❌</span>
        </Button>
      </div>
    </FlashCard>
  )

  const renderPendingRequestCard = (request) => (
    <FlashCard key={request.id} className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl border-2 border-white/20">
            {request.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{request.location}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{request.email}</p>
            <p className="text-sm text-gray-700 mb-3 italic">"{request.message}"</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center">
                <span className="text-lg mr-1">🤝</span>
                {request.mutualConnections} mutual connections
              </span>
              <span className="flex items-center">
                <span className="text-lg mr-1">🕐</span>
                {request.sentAt}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                onClick={() => handleAcceptRequest(request.id)}
                disabled={loading}
              >
                <span className="text-lg mr-1">✅</span>
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleRejectRequest(request.id)}
                disabled={loading}
              >
                <span className="text-lg mr-1">❌</span>
                Reject
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FlashCard>
  )

  const renderSentRequestCard = (request) => (
    <FlashCard key={request.id} className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl border-2 border-white/20">
            {request.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{request.location}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{request.email}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center">
                <span className="text-lg mr-1">🤝</span>
                {request.mutualConnections} mutual connections
              </span>
              <span className="flex items-center">
                <span className="text-lg mr-1">🕐</span>
                {request.sentAt}
              </span>
              <span className="flex items-center">
                <span className="text-lg mr-1">⏳</span>
                {request.status}
              </span>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleCancelRequest(request.id)}
              disabled={loading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <span className="text-lg mr-1">❌</span>
              Cancel Request
            </Button>
          </div>
        </div>
      </div>
    </FlashCard>
  )

  const renderSuggestionCard = (user) => (
    <FlashCard key={user.id} className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl border-2 border-white/20">
            {user.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{user.location}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{user.email}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center">
                <span className="text-lg mr-1">⭐</span>
                {user.rating} ({user.totalRides} rides)
              </span>
              <span className="flex items-center">
                <span className="text-lg mr-1">🤝</span>
                {user.mutualConnections} mutual
              </span>
            </div>
            <p className="text-sm text-blue-600 mb-3 font-medium">{user.reason}</p>
            <Button 
              size="sm" 
              onClick={() => handleSendRequest(user.id)}
              disabled={loading}
            >
              <span className="text-lg mr-1">➕</span>
              Connect
            </Button>
          </div>
        </div>
      </div>
    </FlashCard>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl animate-spin block mb-4">⏳</span>
          <p className="text-gray-600">Loading connections...</p>
        </div>
      </div>
    )
  }

  return (
    <SubscriptionCheck feature="the Connect feature">
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
                  Connect with Fellow Travelers
                </h1>
                <p className="text-xl opacity-90">
                  Build your network and find reliable travel partners
                </p>
              </div>
                          <div className="mt-6 md:mt-0">
              <span className="text-6xl animate-bounce">🤝</span>
            </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Stats */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FlashCard className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl mx-auto mb-6 border-2 border-white/20">
                  👥
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter end={connections.length} />
                </div>
                <div className="text-gray-600">Connections</div>
              </FlashCard>

              <FlashCard className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl mx-auto mb-6 border-2 border-white/20">
                  ⏳
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter end={pendingRequests.length} />
                </div>
                <div className="text-gray-600">Pending Requests</div>
              </FlashCard>

              <FlashCard className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl mx-auto mb-6 border-2 border-white/20">
                  📤
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter end={sentRequests.length} />
                </div>
                <div className="text-gray-600">Sent Requests</div>
              </FlashCard>

              <FlashCard className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl mx-auto mb-6 border-2 border-white/20">
                  💡
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter end={suggestedUsers.length} />
                </div>
                <div className="text-gray-600">Suggestions</div>
              </FlashCard>
            </div>
          </motion.section>

          {/* Tabs */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.section>

          {/* Search */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>
          </motion.section>

          {/* Content */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {activeTab === 'connections' && (
              <div className="space-y-6">
                {connections.length === 0 ? (
                  <FlashCard className="p-12 text-center">
                                      <div className="mx-auto mb-4 inline-block">
                    <span className="text-7xl md:text-8xl animate-pulse">👥</span>
                  </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No connections yet</h3>
                    <p className="text-gray-600 mb-6">Start building your network by connecting with other travelers.</p>
                    <Button onClick={() => setActiveTab('suggestions')}>
                      <span className="mr-2 text-lg">💡</span>
                      View Suggestions
                    </Button>
                  </FlashCard>
                ) : (
                  connections.map(renderConnectionCard)
                )}
              </div>
            )}

            {activeTab === 'pending' && (
              <div className="space-y-6">
                {pendingRequests.length === 0 ? (
                  <FlashCard className="p-12 text-center">
                                      <div className="mx-auto mb-4 inline-block">
                    <span className="text-7xl md:text-8xl animate-pulse">⏳</span>
                  </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No pending requests</h3>
                    <p className="text-gray-600">You don't have any pending connection requests.</p>
                  </FlashCard>
                ) : (
                  pendingRequests.map(renderPendingRequestCard)
                )}
              </div>
            )}

            {activeTab === 'sent' && (
              <div className="space-y-6">
                {sentRequests.length === 0 ? (
                  <FlashCard className="p-12 text-center">
                                      <div className="mx-auto mb-4 inline-block">
                    <span className="text-7xl md:text-8xl animate-pulse">📤</span>
                  </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No sent requests</h3>
                    <p className="text-gray-600 mb-6">You haven't sent any connection requests yet.</p>
                    <Button onClick={() => setActiveTab('suggestions')}>
                      <span className="mr-2 text-lg">💡</span>
                      View Suggestions
                    </Button>
                  </FlashCard>
                ) : (
                  sentRequests.map(renderSentRequestCard)
                )}
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="space-y-6">
                {suggestedUsers.length === 0 ? (
                  <FlashCard className="p-12 text-center">
                                      <div className="mx-auto mb-4 inline-block">
                    <span className="text-7xl md:text-8xl animate-pulse">💡</span>
                  </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No suggestions available</h3>
                    <p className="text-gray-600">We'll suggest new connections based on your activity.</p>
                  </FlashCard>
                ) : (
                  suggestedUsers.map(renderSuggestionCard)
                )}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </SubscriptionCheck>
  )
}

export default Connect
