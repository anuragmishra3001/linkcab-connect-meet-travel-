import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';
import User from '../models/User.js';

// Socket.IO configuration and event handlers
const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:5173'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Socket.IO middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token not provided'));
      }
      
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by ID
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.name} (${socket.user._id})`);
    
    // Join a ride chat room
    socket.on('joinRoom', async ({ rideId }) => {
      try {
        // Join the room
        socket.join(rideId);
        console.log(`User ${socket.user._id} joined room: ${rideId}`);
        
        // Fetch previous messages for this ride
        const messages = await Message.find({ rideId })
          .sort({ timestamp: 1 })
          .populate('sender', 'name avatar');
        
        // Send previous messages to the user
        socket.emit('previousMessages', messages);
        
        // Notify other users in the room
        socket.to(rideId).emit('userJoined', {
          user: {
            _id: socket.user._id,
            name: socket.user.name
          },
          message: `${socket.user.name} has joined the chat`
        });
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join the chat room' });
      }
    });
    
    // Leave a ride chat room
    socket.on('leaveRoom', ({ rideId }) => {
      socket.leave(rideId);
      console.log(`User ${socket.user._id} left room: ${rideId}`);
      
      // Notify other users in the room
      socket.to(rideId).emit('userLeft', {
        user: {
          _id: socket.user._id,
          name: socket.user.name
        },
        message: `${socket.user.name} has left the chat`
      });
    });
    
    // Send a message to a ride chat room
    socket.on('sendMessage', async ({ rideId, content }) => {
      try {
        if (!content.trim()) {
          return socket.emit('error', { message: 'Message cannot be empty' });
        }
        
        // Create a new message
        const newMessage = new Message({
          rideId,
          sender: socket.user._id,
          content,
          timestamp: new Date()
        });
        
        // Save message to database
        await newMessage.save();
        
        // Populate sender information
        await newMessage.populate('sender', 'name avatar');
        
        // Broadcast message to all users in the room
        io.to(rideId).emit('newMessage', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    // Handle typing indicator
    socket.on('typing', ({ rideId }) => {
      socket.to(rideId).emit('userTyping', {
        user: {
          _id: socket.user._id,
          name: socket.user.name
        }
      });
    });
    
    // Handle stop typing indicator
    socket.on('stopTyping', ({ rideId }) => {
      socket.to(rideId).emit('userStoppedTyping', {
        user: {
          _id: socket.user._id,
          name: socket.user.name
        }
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.user.name} (${socket.user._id})`);
    });
  });

  return io;
};

export default configureSocket;