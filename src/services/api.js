import axios from 'axios';
import { 
  mockAuthAPI, 
  mockProfileAPI, 
  mockChatAPI, 
  mockRideAPI, 
  mockPaymentAPI, 
  mockReviewAPI, 
  mockMatchAPI, 
  mockHealthAPI 
} from './mockAPI.js';

// Development mode check
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV;

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
    DEV_MODE ? mockAuthAPI.sendOTP(phone, purpose) : api.post('/auth/send-otp', { phone, purpose }),

  // Verify OTP
  verifyOTP: (phone, otp, purpose = 'signup') =>
    DEV_MODE ? mockAuthAPI.verifyOTP(phone, otp, purpose) : api.post('/auth/verify-otp', { phone, otp, purpose }),

  // Signup
  signup: (userData) =>
    DEV_MODE ? mockAuthAPI.signup(userData) : api.post('/auth/signup', userData),

  // Login
  login: (phone, password) =>
    DEV_MODE ? mockAuthAPI.login(phone, password) : api.post('/auth/login', { phone, password }),

  // Verify phone (requires auth)
  verifyPhone: (otp) =>
    DEV_MODE ? mockAuthAPI.verifyPhone(otp) : api.post('/auth/verify', { otp }),

  // Get current user
  getCurrentUser: () =>
    DEV_MODE ? mockAuthAPI.getCurrentUser() : api.get('/auth/me'),
};

// Profile API calls
export const profileAPI = {
  // Get current user's profile
  getProfile: () =>
    DEV_MODE ? mockProfileAPI.getProfile() : api.get('/profile'),

  // Update profile
  updateProfile: (profileData) =>
    DEV_MODE ? mockProfileAPI.updateProfile(profileData) : api.put('/profile', profileData),

  // Upload avatar
  uploadAvatar: (file) => {
    if (DEV_MODE) {
      return mockProfileAPI.uploadAvatar(file);
    }
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
    DEV_MODE ? mockProfileAPI.deleteAvatar() : api.delete('/profile/avatar'),

  // Get public profile
  getPublicProfile: (userId) =>
    DEV_MODE ? mockProfileAPI.getPublicProfile(userId) : api.get(`/profile/${userId}`),

  // Rate a user
  rateUser: (userId, rating) =>
    DEV_MODE ? mockProfileAPI.rateUser(userId, rating) : api.post('/profile/rate', { userId, rating }),

  // Get user stats
  getStats: () =>
    DEV_MODE ? mockProfileAPI.getStats() : api.get('/profile/stats'),

  // Delete account
  deleteAccount: () =>
    DEV_MODE ? mockProfileAPI.deleteAccount() : api.delete('/profile'),
};

// Chat API calls
export const chatAPI = {
  // Get messages for a ride
  getMessages: (rideId) =>
    DEV_MODE ? mockChatAPI.getMessages(rideId) : api.get(`/chat/${rideId}`),

  // Send a message
  sendMessage: (rideId, content) =>
    DEV_MODE ? mockChatAPI.sendMessage(rideId, content) : api.post(`/chat/${rideId}`, { content }),
};

// Ride API calls
export const rideAPI = {
  // Create a new ride
  createRide: (rideData) =>
    DEV_MODE ? mockRideAPI.createRide(rideData) : api.post('/ride', rideData),

  // Get all rides with optional filters
  getRides: (filters = {}) =>
    DEV_MODE ? mockRideAPI.getRides(filters) : api.get('/ride', { params: filters }),

  // Get a specific ride by ID
  getRideById: (rideId) =>
    DEV_MODE ? mockRideAPI.getRideById(rideId) : api.get(`/ride/${rideId}`),

  // Book a ride
  bookRide: (rideId, seats) =>
    DEV_MODE ? mockRideAPI.bookRide(rideId, seats) : api.post(`/ride/${rideId}/book`, { seats }),
    
  // Complete a ride (host only)
  completeRide: (rideId) =>
    DEV_MODE ? mockRideAPI.completeRide(rideId) : api.patch(`/ride/${rideId}/complete`),
};

// Payment API calls
export const paymentAPI = {
  // Razorpay Order Management
  createRazorpayOrder: (orderData) =>
    DEV_MODE ? mockPaymentAPI.createRazorpayOrder(orderData) : api.post('/payment/razorpay/create-order', orderData),
    
  verifyRazorpayPayment: (paymentData) =>
    DEV_MODE ? mockPaymentAPI.verifyRazorpayPayment(paymentData) : api.post('/payment/razorpay/verify', paymentData),
    
  // Get payment history
  getPaymentHistory: (page = 1, limit = 10) =>
    DEV_MODE ? mockPaymentAPI.getPaymentHistory(page, limit) : api.get('/payment/history', { params: { page, limit } }),
    
  // Get payment details
  getPaymentDetails: (paymentId) =>
    DEV_MODE ? mockPaymentAPI.getPaymentDetails(paymentId) : api.get(`/payment/${paymentId}`),
    
  // Legacy Stripe endpoints (for backward compatibility)
  createCheckoutSession: (rideId, seats) =>
    DEV_MODE ? mockPaymentAPI.createCheckoutSession(rideId, seats) : api.post('/payment/create-checkout-session', { rideId, seats }),
    
  verifyCheckoutSession: (sessionId) =>
    DEV_MODE ? mockPaymentAPI.verifyCheckoutSession(sessionId) : api.get(`/payment/verify-session/${sessionId}`),
};

// Review API calls
export const reviewAPI = {
  // Submit a review
  submitReview: (reviewData) =>
    DEV_MODE ? mockReviewAPI.submitReview(reviewData) : api.post('/review', reviewData),
    
  // Get reviews for a user
  getUserReviews: (userId, page = 1, limit = 10) =>
    DEV_MODE ? mockReviewAPI.getUserReviews(userId, page, limit) : api.get(`/review/user/${userId}`, { params: { page, limit } }),
    
  // Get reviews for a ride
  getRideReviews: (rideId) =>
    DEV_MODE ? mockReviewAPI.getRideReviews(rideId) : api.get(`/review/ride/${rideId}`),
};

// Match API calls
export const matchAPI = {
  // Get passenger matches for a ride
  getMatches: (rideId, useAI = false) =>
    DEV_MODE ? mockMatchAPI.getMatches(rideId, useAI) : api.post('/match', { rideId, useAI }),
};

// Health check
export const healthAPI = {
  checkHealth: () =>
    DEV_MODE ? mockHealthAPI.checkHealth() : api.get('/health'),
};

export default api;