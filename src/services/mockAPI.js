import { 
  mockUsers, 
  mockRides, 
  mockMessages, 
  mockReviews, 
  mockPayments,
  getMockUser,
  getMockRide,
  getMockMessages,
  getMockReviews,
  getMockRides,
  addMockMessage,
  addMockRide,
  bookMockRide
} from './mockData.js';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const mockAuthAPI = {
  sendOTP: async (phone, purpose = 'signup') => {
    await delay(300);
    console.log(`[MOCK API] OTP sent to ${phone} for ${purpose}`);
    return {
      data: {
        success: true,
        data: {
          message: 'OTP sent successfully',
          otpId: `otp_${Date.now()}`
        }
      }
    };
  },

  verifyOTP: async (phone, otp, purpose = 'signup') => {
    await delay(300);
    console.log(`[MOCK API] OTP ${otp} verified for ${phone} (${purpose})`);
    return {
      data: {
        success: true,
        data: {
          message: 'OTP verified successfully',
          verified: true
        }
      }
    };
  },

  signup: async (userData) => {
    await delay(800);
    console.log('[MOCK API] User signup:', userData);
    const newUser = {
      _id: `user-${Date.now()}`,
      ...userData,
      isPhoneVerified: true,
      rating: 5.0,
      totalRides: 0,
      isSubscribed: false,
      subscription: null,
      createdAt: new Date().toISOString()
    };
    
    return {
      data: {
        success: true,
        data: {
          user: newUser,
          token: `mock-token-${Date.now()}`
        }
      }
    };
  },

  login: async (phone, password) => {
    await delay(500);
    console.log('[MOCK API] User login:', phone);
    
    // Find existing user or create a mock one
    let user = mockUsers.find(u => u.phone === phone);
    if (!user) {
      user = {
        _id: `user-${Date.now()}`,
        name: 'Test User',
        email: 'test@example.com',
        phone: phone,
        age: 25,
        gender: 'other',
        bio: 'Test user for development',
        isPhoneVerified: true,
        rating: 4.5,
        totalRides: 5,
        isSubscribed: false,
        subscription: null,
        createdAt: new Date().toISOString()
      };
    }
    
    return {
      data: {
        success: true,
        data: {
          user: user,
          token: `mock-token-${Date.now()}`
        }
      }
    };
  },

  verifyPhone: async (otp) => {
    await delay(300);
    console.log('[MOCK API] Phone verification:', otp);
    return {
      data: {
        success: true,
        data: {
          message: 'Phone verified successfully',
          user: {
            ...mockUsers[0],
            isPhoneVerified: true
          }
        }
      }
    };
  },

  getCurrentUser: async () => {
    await delay(200);
    console.log('[MOCK API] Get current user');
    return {
      data: {
        success: true,
        data: {
          user: mockUsers[0]
        }
      }
    };
  }
};

export const mockProfileAPI = {
  getProfile: async () => {
    await delay(300);
    console.log('[MOCK API] Get profile');
    return {
      data: {
        success: true,
        data: {
          user: mockUsers[0]
        }
      }
    };
  },

  updateProfile: async (profileData) => {
    await delay(500);
    console.log('[MOCK API] Update profile:', profileData);
    const updatedUser = { ...mockUsers[0], ...profileData };
    return {
      data: {
        success: true,
        data: {
          user: updatedUser
        }
      }
    };
  },

  uploadAvatar: async (file) => {
    await delay(1000);
    console.log('[MOCK API] Upload avatar:', file.name);
    return {
      data: {
        success: true,
        data: {
          message: 'Avatar uploaded successfully',
          avatarUrl: 'https://via.placeholder.com/150'
        }
      }
    };
  },

  deleteAvatar: async () => {
    await delay(300);
    console.log('[MOCK API] Delete avatar');
    return {
      data: {
        success: true,
        data: {
          message: 'Avatar deleted successfully'
        }
      }
    };
  },

  getPublicProfile: async (userId) => {
    await delay(300);
    console.log('[MOCK API] Get public profile:', userId);
    const user = getMockUser(userId) || mockUsers[0];
    return {
      data: {
        success: true,
        data: {
          user: user
        }
      }
    };
  },

  rateUser: async (userId, rating) => {
    await delay(500);
    console.log('[MOCK API] Rate user:', userId, rating);
    return {
      data: {
        success: true,
        data: {
          message: 'Rating submitted successfully'
        }
      }
    };
  },

  getStats: async () => {
    await delay(300);
    console.log('[MOCK API] Get user stats');
    return {
      data: {
        success: true,
        data: {
          totalRides: 15,
          totalEarnings: 250,
          averageRating: 4.8,
          completedRides: 12,
          cancelledRides: 3
        }
      }
    };
  },

  deleteAccount: async () => {
    await delay(500);
    console.log('[MOCK API] Delete account');
    return {
      data: {
        success: true,
        data: {
          message: 'Account deleted successfully'
        }
      }
    };
  }
};

export const mockChatAPI = {
  getMessages: async (rideId) => {
    await delay(300);
    console.log('[MOCK API] Get messages for ride:', rideId);
    const messages = getMockMessages(rideId);
    return {
      data: {
        success: true,
        data: {
          messages: messages
        }
      }
    };
  },

  sendMessage: async (rideId, content) => {
    await delay(300);
    console.log('[MOCK API] Send message:', rideId, content);
    const newMessage = addMockMessage(rideId, 'user-1', 'John Doe', content);
    return {
      data: {
        success: true,
        data: {
          message: newMessage
        }
      }
    };
  }
};

export const mockRideAPI = {
  createRide: async (rideData) => {
    await delay(800);
    console.log('[MOCK API] Create ride:', rideData);
    const newRide = addMockRide(rideData);
    return {
      data: {
        success: true,
        data: {
          ride: newRide
        }
      }
    };
  },

  getRides: async (filters = {}) => {
    await delay(400);
    console.log('[MOCK API] Get rides with filters:', filters);
    const rides = getMockRides(filters);
    return {
      data: {
        success: true,
        data: {
          rides: rides,
          total: rides.length
        }
      }
    };
  },

  getRideById: async (rideId) => {
    await delay(300);
    console.log('[MOCK API] Get ride by ID:', rideId);
    const ride = getMockRide(rideId);
    if (!ride) {
      throw new Error('Ride not found');
    }
    return {
      data: {
        success: true,
        data: {
          ride: ride
        }
      }
    };
  },

  bookRide: async (rideId, seats) => {
    await delay(600);
    console.log('[MOCK API] Book ride:', rideId, seats);
    const result = bookMockRide(rideId, 'user-1');
    if (!result.success) {
      throw new Error(result.error);
    }
    return {
      data: {
        success: true,
        data: {
          message: 'Ride booked successfully',
          ride: result.ride
        }
      }
    };
  },

  completeRide: async (rideId) => {
    await delay(500);
    console.log('[MOCK API] Complete ride:', rideId);
    const ride = getMockRide(rideId);
    if (ride) {
      ride.status = 'completed';
    }
    return {
      data: {
        success: true,
        data: {
          message: 'Ride completed successfully',
          ride: ride
        }
      }
    };
  }
};

export const mockPaymentAPI = {
  createRazorpayOrder: async (orderData) => {
    await delay(500);
    console.log('[MOCK API] Create Razorpay order:', orderData);
    return {
      data: {
        success: true,
        data: {
          orderId: `order_mock_${Date.now()}`,
          amount: orderData.amount,
          currency: orderData.currency || 'USD',
          key: 'rzp_test_mock_key'
        }
      }
    };
  },

  verifyRazorpayPayment: async (paymentData) => {
    await delay(600);
    console.log('[MOCK API] Verify Razorpay payment:', paymentData);
    return {
      data: {
        success: true,
        data: {
          message: 'Payment verified successfully',
          paymentId: `pay_mock_${Date.now()}`,
          orderId: paymentData.orderId
        }
      }
    };
  },

  getPaymentHistory: async (page = 1, limit = 10) => {
    await delay(400);
    console.log('[MOCK API] Get payment history:', page, limit);
    return {
      data: {
        success: true,
        data: {
          payments: mockPayments,
          total: mockPayments.length,
          page: page,
          limit: limit
        }
      }
    };
  },

  getPaymentDetails: async (paymentId) => {
    await delay(300);
    console.log('[MOCK API] Get payment details:', paymentId);
    const payment = mockPayments.find(p => p._id === paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return {
      data: {
        success: true,
        data: {
          payment: payment
        }
      }
    };
  },

  createCheckoutSession: async (rideId, seats) => {
    await delay(500);
    console.log('[MOCK API] Create checkout session:', rideId, seats);
    return {
      data: {
        success: true,
        data: {
          sessionId: `cs_mock_${Date.now()}`,
          url: 'https://checkout.stripe.com/mock'
        }
      }
    };
  },

  verifyCheckoutSession: async (sessionId) => {
    await delay(400);
    console.log('[MOCK API] Verify checkout session:', sessionId);
    return {
      data: {
        success: true,
        data: {
          message: 'Payment successful',
          sessionId: sessionId
        }
      }
    };
  }
};

export const mockReviewAPI = {
  submitReview: async (reviewData) => {
    await delay(500);
    console.log('[MOCK API] Submit review:', reviewData);
    return {
      data: {
        success: true,
        data: {
          message: 'Review submitted successfully',
          review: {
            _id: `review_${Date.now()}`,
            ...reviewData,
            createdAt: new Date().toISOString()
          }
        }
      }
    };
  },

  getUserReviews: async (userId, page = 1, limit = 10) => {
    await delay(400);
    console.log('[MOCK API] Get user reviews:', userId, page, limit);
    const reviews = getMockReviews(userId);
    return {
      data: {
        success: true,
        data: {
          reviews: reviews,
          total: reviews.length,
          page: page,
          limit: limit
        }
      }
    };
  },

  getRideReviews: async (rideId) => {
    await delay(300);
    console.log('[MOCK API] Get ride reviews:', rideId);
    const reviews = mockReviews.filter(r => r.rideId === rideId);
    return {
      data: {
        success: true,
        data: {
          reviews: reviews
        }
      }
    };
  }
};

export const mockMatchAPI = {
  getMatches: async (rideId, useAI = false) => {
    await delay(800);
    console.log('[MOCK API] Get matches for ride:', rideId, 'AI:', useAI);
    const matches = mockUsers.filter(user => user._id !== 'user-1'); // Exclude current user
    return {
      data: {
        success: true,
        data: {
          matches: matches,
          total: matches.length,
          aiEnabled: useAI
        }
      }
    };
  }
};

export const mockHealthAPI = {
  checkHealth: async () => {
    await delay(200);
    console.log('[MOCK API] Health check');
    return {
      data: {
        status: 'OK',
        message: 'Mock API is running',
        timestamp: new Date().toISOString(),
        environment: 'development',
        uptime: process.uptime ? process.uptime() : 0,
        version: '1.0.0'
      }
    };
  }
};
