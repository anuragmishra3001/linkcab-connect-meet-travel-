import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user, isDevMode } = useAuth();
  
  // Initialize socket connection when user is authenticated
  useEffect(() => {
    let socketInstance = null;
    
    // In development mode, simulate socket connection
    if (isDevMode && user) {
      console.log('[DEV MODE] Socket connection simulated');
      setConnected(true);
      // Create a mock socket object
      const mockSocket = {
        emit: (event, data) => {
          console.log(`[DEV MODE] Socket emit: ${event}`, data);
        },
        on: (event, callback) => {
          console.log(`[DEV MODE] Socket listener: ${event}`);
        },
        disconnect: () => {
          console.log('[DEV MODE] Socket disconnected');
          setConnected(false);
        }
      };
      setSocket(mockSocket);
      return;
    }
    
    // Only connect if user is logged in and not in dev mode
    if (user && !isDevMode) {
      const token = localStorage.getItem('token');
      const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Initialize socket with auth token
      socketInstance = io(SOCKET_URL, {
        auth: { token },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      
      // Socket event listeners
      socketInstance.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
      });
      
      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });
      
      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        setConnected(false);
      });
      
      // Set socket instance
      setSocket(socketInstance);
    }
    
    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        setSocket(null);
        setConnected(false);
      }
    };
  }, [user, isDevMode]);
  
  // Join a ride chat room
  const joinRideRoom = (rideId) => {
    if (socket && connected) {
      socket.emit('joinRoom', { rideId });
    }
  };
  
  // Leave a ride chat room
  const leaveRideRoom = (rideId) => {
    if (socket && connected) {
      socket.emit('leaveRoom', { rideId });
    }
  };
  
  // Send a message to a ride chat room
  const sendMessage = (rideId, content) => {
    if (socket && connected) {
      socket.emit('sendMessage', { rideId, content });
    }
  };
  
  // Send typing indicator
  const sendTyping = (rideId) => {
    if (socket && connected) {
      socket.emit('typing', { rideId });
    }
  };
  
  // Send stop typing indicator
  const sendStopTyping = (rideId) => {
    if (socket && connected) {
      socket.emit('stopTyping', { rideId });
    }
  };
  
  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        joinRideRoom,
        leaveRideRoom,
        sendMessage,
        sendTyping,
        sendStopTyping
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};