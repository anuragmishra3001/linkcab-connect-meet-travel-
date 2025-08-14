import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Card from './Card';

const Chat = ({ rideId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const { user } = useAuth();
  const { 
    socket, 
    connected, 
    joinRideRoom, 
    leaveRideRoom, 
    sendMessage, 
    sendTyping, 
    sendStopTyping 
  } = useSocket();
  
  // Join chat room when component mounts
  useEffect(() => {
    if (connected && rideId) {
      joinRideRoom(rideId);
      setLoading(true);
      
      // Cleanup: leave room when component unmounts
      return () => {
        leaveRideRoom(rideId);
      };
    }
  }, [connected, rideId, joinRideRoom, leaveRideRoom]);
  
  // Socket event listeners
  useEffect(() => {
    if (!socket) return;
    
    // Listen for previous messages
    const handlePreviousMessages = (data) => {
      setMessages(data);
      setLoading(false);
    };
    
    // Listen for new messages
    const handleNewMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    
    // Listen for user joined notifications
    const handleUserJoined = (data) => {
      // Add system message
      const systemMessage = {
        _id: Date.now(),
        content: data.message,
        isSystem: true,
        timestamp: new Date()
      };
      setMessages((prevMessages) => [...prevMessages, systemMessage]);
    };
    
    // Listen for user left notifications
    const handleUserLeft = (data) => {
      // Add system message
      const systemMessage = {
        _id: Date.now(),
        content: data.message,
        isSystem: true,
        timestamp: new Date()
      };
      setMessages((prevMessages) => [...prevMessages, systemMessage]);
    };
    
    // Listen for typing indicators
    const handleUserTyping = (data) => {
      if (data.user._id !== user._id) {
        setTypingUsers((prevUsers) => {
          if (!prevUsers.some(u => u._id === data.user._id)) {
            return [...prevUsers, data.user];
          }
          return prevUsers;
        });
      }
    };
    
    // Listen for stop typing indicators
    const handleUserStoppedTyping = (data) => {
      if (data.user._id !== user._id) {
        setTypingUsers((prevUsers) => 
          prevUsers.filter(u => u._id !== data.user._id)
        );
      }
    };
    
    // Listen for errors
    const handleError = (error) => {
      console.error('Socket error:', error.message);
    };
    
    // Register event listeners
    socket.on('previousMessages', handlePreviousMessages);
    socket.on('newMessage', handleNewMessage);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);
    socket.on('error', handleError);
    
    // Cleanup event listeners
    return () => {
      socket.off('previousMessages', handlePreviousMessages);
      socket.off('newMessage', handleNewMessage);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStoppedTyping', handleUserStoppedTyping);
      socket.off('error', handleError);
    };
  }, [socket, user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle input change with typing indicator
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Send typing indicator
    sendTyping(rideId);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout for stop typing
    typingTimeoutRef.current = setTimeout(() => {
      sendStopTyping(rideId);
    }, 1000);
  };
  
  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (newMessage.trim() && connected) {
      // Send message
      sendMessage(rideId, newMessage.trim());
      
      // Clear input
      setNewMessage('');
      
      // Clear typing indicator
      sendStopTyping(rideId);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Card className="h-[500px] flex flex-col">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Chat</h2>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message._id} 
              className={`flex ${message.isSystem ? 'justify-center' : 
                message.sender?._id === user?._id ? 'justify-end' : 'justify-start'}`}
            >
              {message.isSystem ? (
                <div className="bg-gray-100 text-gray-500 text-xs py-1 px-3 rounded-full">
                  {message.content}
                </div>
              ) : message.sender?._id === user?._id ? (
                <div className="max-w-[75%]">
                  <div className="bg-primary-600 text-white p-3 rounded-lg rounded-tr-none">
                    {message.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              ) : (
                <div className="flex max-w-[75%]">
                  <div className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
                      {message.sender?.name?.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="bg-gray-200 p-3 rounded-lg rounded-tl-none">
                      <div className="text-xs text-gray-600 font-medium mb-1">
                        {message.sender?.name}
                      </div>
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <span>
              {typingUsers.length === 1
                ? `${typingUsers[0].name} is typing`
                : `${typingUsers.length} people are typing`}
            </span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSubmit} className="mt-auto">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 input-field"
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !connected}
            className="bg-primary-600 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        {!connected && (
          <p className="text-red-500 text-xs mt-1">Disconnected. Reconnecting...</p>
        )}
      </form>
    </Card>
  );
};

export default Chat;