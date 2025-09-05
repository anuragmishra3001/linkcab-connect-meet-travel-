import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { subscriptionService, checkPremiumAccess } from '../services/subscription.js';

const AuthContext = createContext();

// Development mode - enable for testing without backend
const DEV_MODE = true;
console.log('🔍 DEV_MODE is set to:', DEV_MODE);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (DEV_MODE) {
      // Development mode: Create a mock user for testing
      const mockUser = {
        _id: 'dev-user-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        age: 28,
        gender: 'male',
        bio: 'I love traveling and meeting new people!',
        isPhoneVerified: true,
        rating: 4.8,
        totalRides: 15,
        isSubscribed: false,
        subscription: null,
        createdAt: new Date().toISOString()
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'dev-token-123');
      setLoading(false);
      return;
    }

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify token is still valid
        authAPI.getCurrentUser()
          .then(response => {
            setUser(response.data.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
          })
          .catch(() => {
            // Token is invalid, clear storage
            logout();
          })
          .finally(() => setLoading(false));
      } catch (error) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (phone, password) => {
    if (DEV_MODE) {
      // Development mode: Always succeed with mock user
      const mockUser = {
        _id: 'dev-user-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: phone,
        age: 28,
        gender: 'male',
        bio: 'I love traveling and meeting new people!',
        isPhoneVerified: true,
        rating: 4.8,
        totalRides: 15,
        isSubscribed: false,
        subscription: null,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('token', 'dev-token-123');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setError(null);
      
      return { success: true, user: mockUser };
    }

    try {
      setError(null);
      const response = await authAPI.login(phone, password);
      const { user: userData, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Signup function
  const signup = async (userData) => {
    if (DEV_MODE) {
      // Development mode: Always succeed with provided user data
      const mockUser = {
        _id: 'dev-user-' + Date.now(),
        name: userData.name || 'New User',
        email: userData.email || 'newuser@example.com',
        phone: userData.phone || '+1234567890',
        age: userData.age || 25,
        gender: userData.gender || 'other',
        bio: userData.bio || 'New LinkCab user!',
        isPhoneVerified: true,
        rating: 5.0,
        totalRides: 0,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('token', 'dev-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setError(null);
      
      return { success: true, user: mockUser };
    }

    try {
      setError(null);
      const response = await authAPI.signup(userData);
      const { user: newUser, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Send OTP function
  const sendOTP = async (phone, purpose = 'signup') => {
    if (DEV_MODE) {
      // Development mode: Always succeed
      console.log(`[DEV MODE] OTP sent to ${phone} for ${purpose}`);
      return { success: true, data: { message: 'OTP sent successfully (DEV MODE)' } };
    }

    try {
      setError(null);
      const response = await authAPI.sendOTP(phone, purpose);
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Verify OTP function
  const verifyOTP = async (phone, otp, purpose = 'signup') => {
    if (DEV_MODE) {
      // Development mode: Always succeed with any OTP
      console.log(`[DEV MODE] OTP ${otp} verified for ${phone} (${purpose})`);
      return { success: true, data: { message: 'OTP verified successfully (DEV MODE)' } };
    }

    try {
      setError(null);
      const response = await authAPI.verifyOTP(phone, otp, purpose);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Verify phone function (requires auth)
  const verifyPhone = async (otp) => {
    if (DEV_MODE) {
      // Development mode: Always succeed
      const updatedUser = { ...user, isPhoneVerified: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    }

    try {
      setError(null);
      const response = await authAPI.verifyPhone(otp);
      const updatedUser = response.data.data.user;
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Phone verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  // Update user function
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Check subscription status
  const checkSubscriptionStatus = async () => {
    if (DEV_MODE) {
      // In dev mode, return mock subscription status
      return { success: true, data: { isSubscribed: false, subscription: null } };
    }

    try {
      const response = await subscriptionService.getSubscriptionStatus();
      if (response.success) {
        const updatedUser = { ...user, ...response.data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return response;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return { success: false, error: error.message };
    }
  };

  // Check if user has premium access
  const hasPremiumAccess = () => {
    return checkPremiumAccess(user);
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    sendOTP,
    verifyOTP,
    verifyPhone,
    updateUser,
    checkSubscriptionStatus,
    hasPremiumAccess,
    clearError,
    isAuthenticated: !!user,
    isPhoneVerified: user?.isPhoneVerified || false,
    isDevMode: DEV_MODE,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 