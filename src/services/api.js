import axios from 'axios';

// Create axios instance with base configuration
// For production, you'll need to set VITE_API_URL in Vercel environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Send OTP
  sendOTP: (phone, purpose = 'signup') =>
    api.post('/auth/send-otp', { phone, purpose }),

  // Verify OTP
  verifyOTP: (phone, otp, purpose = 'signup') =>
    api.post('/auth/verify-otp', { phone, otp, purpose }),

  // Signup
  signup: (userData) =>
    api.post('/auth/signup', userData),

  // Login
  login: (phone, password) =>
    api.post('/auth/login', { phone, password }),

  // Verify phone (requires auth)
  verifyPhone: (otp) =>
    api.post('/auth/verify', { otp }),

  // Get current user
  getCurrentUser: () =>
    api.get('/auth/me'),
};

// Profile API calls
export const profileAPI = {
  // Get current user's profile
  getProfile: () =>
    api.get('/profile'),

  // Update profile
  updateProfile: (profileData) =>
    api.put('/profile', profileData),

  // Upload avatar
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete avatar
  deleteAvatar: () =>
    api.delete('/profile/avatar'),

  // Get public profile
  getPublicProfile: (userId) =>
    api.get(`/profile/${userId}`),

  // Rate a user
  rateUser: (userId, rating) =>
    api.post('/profile/rate', { userId, rating }),

  // Get user stats
  getStats: () =>
    api.get('/profile/stats'),

  // Delete account
  deleteAccount: () =>
    api.delete('/profile'),
};

// Chat API calls
export const chatAPI = {
  // Get messages for a ride
  getMessages: (rideId) =>
    api.get(`/chat/${rideId}`),

  // Send a message
  sendMessage: (rideId, content) =>
    api.post(`/chat/${rideId}`, { content }),
};

// Ride API calls
export const rideAPI = {
  // Create a new ride
  createRide: (rideData) =>
    api.post('/ride', rideData),

  // Get all rides with optional filters
  getRides: (filters = {}) =>
    api.get('/ride', { params: filters }),

  // Get a specific ride by ID
  getRideById: (rideId) =>
    api.get(`/ride/${rideId}`),

  // Book a ride
  bookRide: (rideId, seats) =>
    api.post(`/ride/${rideId}/book`, { seats }),
    
  // Complete a ride (host only)
  completeRide: (rideId) =>
    api.patch(`/ride/${rideId}/complete`),
};

// Payment API calls
export const paymentAPI = {
  // Razorpay Order Management
  createRazorpayOrder: (orderData) =>
    api.post('/payment/razorpay/create-order', orderData),
    
  verifyRazorpayPayment: (paymentData) =>
    api.post('/payment/razorpay/verify', paymentData),
    
  // Get payment history
  getPaymentHistory: (page = 1, limit = 10) =>
    api.get('/payment/history', { params: { page, limit } }),
    
  // Get payment details
  getPaymentDetails: (paymentId) =>
    api.get(`/payment/${paymentId}`),
    
  // Legacy Stripe endpoints (for backward compatibility)
  createCheckoutSession: (rideId, seats) =>
    api.post('/payment/create-checkout-session', { rideId, seats }),
    
  verifyCheckoutSession: (sessionId) =>
    api.get(`/payment/verify-session/${sessionId}`),
};

// Review API calls
export const reviewAPI = {
  // Submit a review
  submitReview: (reviewData) =>
    api.post('/review', reviewData),
    
  // Get reviews for a user
  getUserReviews: (userId, page = 1, limit = 10) =>
    api.get(`/review/user/${userId}`, { params: { page, limit } }),
    
  // Get reviews for a ride
  getRideReviews: (rideId) =>
    api.get(`/review/ride/${rideId}`),
};

// Match API calls
export const matchAPI = {
  // Get passenger matches for a ride
  getMatches: (rideId, useAI = false) =>
    api.post('/match', { rideId, useAI }),
};

// Health check
export const healthAPI = {
  checkHealth: () =>
    api.get('/health'),
};

export default api;