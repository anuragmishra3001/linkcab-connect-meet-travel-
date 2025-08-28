import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import FlashCard from '../components/FlashCard'
import Button from '../components/Button'
import SubscriptionCheck from '../components/SubscriptionCheck'
import { 
  AnimatedCounter,
  FloatingShapes 
} from '../components/ModernGraphics'
import { formatCurrency } from '../utils/currency'

const Messages = () => {
  const { user } = useAuth()
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  // Mock data - replace with actual API calls
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState({})

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock chats data
      const mockChats = [
        {
          id: 1,
          user: {
            id: 101,
            name: 'Sarah Johnson',
            avatar: '👩‍💼',
            email: 'sarah.johnson@email.com',
            location: 'New York, NY',
            status: 'online',
            lastSeen: '2 minutes ago'
          },
          lastMessage: {
            text: "Perfect! I'll be there at 9 AM sharp.",
            timestamp: '2 minutes ago',
            sender: 'them',
            unread: true
          },
          rideDetails: {
            from: 'New York, NY',
            to: 'Boston, MA',
            date: '2024-01-20',
            time: '09:00 AM',
            price: 45
          }
        },
        {
          id: 2,
          user: {
            id: 102,
            name: 'Michael Chen',
            avatar: '👨‍💻',
            email: 'michael.chen@email.com',
            location: 'San Francisco, CA',
            status: 'offline',
            lastSeen: '1 hour ago'
          },
          lastMessage: {
            text: 'Thanks for the ride yesterday!',
            timestamp: '1 hour ago',
            sender: 'them',
            unread: false
          },
          rideDetails: {
            from: 'San Francisco, CA',
            to: 'Palo Alto, CA',
            date: '2024-01-19',
            time: '08:30 AM',
            price: 25
          }
        },
        {
          id: 3,
          user: {
            id: 103,
            name: 'Emily Rodriguez',
            avatar: '👩‍🎓',
            email: 'emily.rodriguez@email.com',
            location: 'Austin, TX',
            status: 'online',
            lastSeen: 'Just now'
          },
          lastMessage: {
            text: 'Can we meet at the coffee shop instead?',
            timestamp: '5 minutes ago',
            sender: 'me',
            unread: false
          },
          rideDetails: {
            from: 'Austin, TX',
            to: 'Houston, TX',
            date: '2024-01-21',
            time: '10:00 AM',
            price: 35
          }
        }
      ]

      // Mock messages data
      const mockMessages = {
        1: [
          {
            id: 1,
            text: 'Hi Sarah! I\'m looking for a ride to Boston on Monday.',
            timestamp: '2024-01-18T10:30:00Z',
            sender: 'me',
            type: 'text'
          },
          {
            id: 2,
            text: 'Hi! I have a ride available. What time do you need to leave?',
            timestamp: '2024-01-18T10:32:00Z',
            sender: 'them',
            type: 'text'
          },
          {
            id: 3,
            text: 'Around 9 AM would be perfect.',
            timestamp: '2024-01-18T10:35:00Z',
            sender: 'me',
            type: 'text'
          },
          {
            id: 4,
            text: "Perfect! I'll be there at 9 AM sharp.",
            timestamp: '2024-01-18T10:36:00Z',
            sender: 'them',
            type: 'text'
          }
        ],
        2: [
          {
            id: 5,
            text: 'Thanks for the ride yesterday!',
            timestamp: '2024-01-19T09:30:00Z',
            sender: 'them',
            type: 'text'
          }
        ],
        3: [
          {
            id: 6,
            text: 'Can we meet at the coffee shop instead?',
            timestamp: '2024-01-18T15:45:00Z',
            sender: 'me',
            type: 'text'
          }
        ]
      }
      
      setChats(mockChats)
      setMessages(mockMessages)
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selectedChat])

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return

    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      timestamp: new Date().toISOString(),
      sender: 'me',
      type: 'text'
    }

    // Add message to current chat
    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
    }))

    // Update last message in chat list
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? {
            ...chat,
            lastMessage: {
              text: message.trim(),
              timestamp: 'Just now',
              sender: 'me',
              unread: false
            }
          }
        : chat
    ))

    setMessage('')
    
    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      // Simulate reply
      const reply = {
        id: Date.now() + 1,
        text: 'Thanks for the message! I\'ll get back to you soon.',
        timestamp: new Date().toISOString(),
        sender: 'them',
        type: 'text'
      }
      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), reply]
      }))
    }, 2000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const renderChatList = () => (
    <div className="space-y-2">
      {chats.map((chat) => (
        <motion.div
          key={chat.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FlashCard 
            className={`p-4 cursor-pointer transition-all duration-200 ${
              selectedChat?.id === chat.id 
                ? 'ring-2 ring-primary-500 bg-primary-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl border-2 border-white/20">
                  {chat.user.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  chat.user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {chat.user.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {chat.lastMessage.timestamp}
                  </span>
                </div>
                <p className="text-xs text-gray-600 truncate">
                  {chat.lastMessage.text}
                </p>
                {chat.lastMessage.unread && (
                  <div className="mt-1">
                    <span className="inline-block w-2 h-2 bg-primary-500 rounded-full"></span>
                  </div>
                )}
              </div>
            </div>
          </FlashCard>
        </motion.div>
      ))}
    </div>
  )

  const renderChatHeader = () => (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-xl border-2 border-white/20">
            {selectedChat.user.avatar}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
            selectedChat.user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{selectedChat.user.name}</h3>
          <p className="text-sm text-gray-500">{selectedChat.user.status === 'online' ? 'Online' : `Last seen ${selectedChat.user.lastSeen}`}</p>
        </div>
        <Button size="sm" variant="outline">
          <span className="text-lg">📞</span>
        </Button>
      </div>
    </div>
  )

  const renderMessage = (msg) => (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        msg.sender === 'me' 
          ? 'bg-primary-500 text-white rounded-br-md' 
          : 'bg-gray-100 text-gray-900 rounded-bl-md'
      }`}>
        <p className="text-sm">{msg.text}</p>
        <p className={`text-xs mt-1 ${
          msg.sender === 'me' ? 'text-primary-100' : 'text-gray-500'
        }`}>
          {formatTime(msg.timestamp)}
        </p>
      </div>
    </motion.div>
  )

  const renderRideDetails = () => (
    <FlashCard className="mb-6 p-4 bg-blue-50 border border-blue-200">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
          🚗
        </div>
        <h4 className="font-semibold text-blue-900">Ride Details</h4>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">From:</span>
          <span className="font-medium">{selectedChat.rideDetails.from}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">To:</span>
          <span className="font-medium">{selectedChat.rideDetails.to}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Date:</span>
          <span className="font-medium">{selectedChat.rideDetails.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Time:</span>
          <span className="font-medium">{selectedChat.rideDetails.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Price:</span>
                          <span className="font-medium text-primary-600">{formatCurrency(selectedChat.rideDetails.price)}</span>
        </div>
      </div>
    </FlashCard>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl animate-spin block mb-4">⏳</span>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <SubscriptionCheck feature="the Messages feature">
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
                  Messages
                </h1>
                <p className="text-xl opacity-90">
                  Stay connected with your travel partners
                </p>
              </div>
              <div className="mt-6 md:mt-0">
                <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <span className="text-6xl">💬</span>
                </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FlashCard className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl mx-auto mb-6 border-2 border-white/20">
                  💬
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter end={chats.length} />
                </div>
                <div className="text-gray-600">Active Chats</div>
              </FlashCard>

              <FlashCard className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl mx-auto mb-6 border-2 border-white/20">
                  📱
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter end={chats.filter(chat => chat.user.status === 'online').length} />
                </div>
                <div className="text-gray-600">Online Now</div>
              </FlashCard>

              <FlashCard className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl mx-auto mb-6 border-2 border-white/20">
                  🔔
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter end={chats.filter(chat => chat.lastMessage.unread).length} />
                </div>
                <div className="text-gray-600">Unread Messages</div>
              </FlashCard>
            </div>
          </motion.section>

          {/* Chat Interface */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Chat List */}
            <div className="lg:col-span-1">
              <FlashCard className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                  <Button size="sm" variant="outline" className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      ➕
                    </div>
                    <span>New Chat</span>
                  </Button>
                </div>
                {renderChatList()}
              </FlashCard>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              {selectedChat ? (
                <FlashCard className="h-[600px] flex flex-col">
                  {renderChatHeader()}
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    {renderRideDetails()}
                    
                    <div className="space-y-4">
                      {messages[selectedChat.id]?.map(renderMessage)}
                      
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start mb-4"
                        >
                          <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <div className="flex-1 relative">
                        <textarea
                          ref={inputRef}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
                          rows="1"
                          style={{ minHeight: '44px', maxHeight: '120px' }}
                        />
                      </div>
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="w-12 h-12 p-0 flex items-center justify-center"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                          📤
                        </div>
                      </Button>
                    </div>
                  </div>
                </FlashCard>
              ) : (
                <FlashCard className="h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-gray-300/30">
                      <span className="text-8xl">💬</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Select a conversation</h3>
                    <p className="text-gray-600">Choose a chat from the list to start messaging</p>
                  </div>
                </FlashCard>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </SubscriptionCheck>
  )
}

export default Messages
