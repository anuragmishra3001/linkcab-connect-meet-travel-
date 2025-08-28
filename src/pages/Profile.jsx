import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { profileAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import FlashCard from '../components/FlashCard';
import AvatarUpload from '../components/AvatarUpload';
import ReviewList from '../components/ReviewList';
import { 
  ModernIcon, 
  AnimatedProgressBar, 
  ModernBadge,
  AnimatedCounter,
  FloatingShapes 
} from '../components/ModernGraphics';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || 'prefer-not-to-say',
    bio: user?.bio || '',
    preferences: {
      smoking: user?.preferences?.smoking || false,
      music: user?.preferences?.music || true,
      pets: user?.preferences?.pets || false,
    },
    emergencyContact: {
      name: user?.emergencyContact?.name || '',
      phone: user?.emergencyContact?.phone || '',
      relationship: user?.emergencyContact?.relationship || '',
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age || '',
        gender: user.gender || 'prefer-not-to-say',
        bio: user.bio || '',
        preferences: {
          smoking: user.preferences?.smoking || false,
          music: user.preferences?.music || true,
          pets: user.preferences?.pets || false,
        },
        emergencyContact: {
          name: user.emergencyContact?.name || '',
          phone: user.emergencyContact?.phone || '',
          relationship: user.emergencyContact?.relationship || '',
        },
      });
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await profileAPI.getStats();
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await profileAPI.updateProfile(formData);
      updateUser(response.data.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (newAvatarUrl) => {
    updateUser({ ...user, avatar: newAvatarUrl });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0v15z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    return stars;
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'reviews', name: 'Reviews', icon: '⭐' },
    { id: 'stats', name: 'Statistics', icon: '📊' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center relative">
        <FloatingShapes />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600 text-lg">Manage your account and preferences</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-lg shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === tab.id 
                ? 'border-primary-500 text-primary-600 bg-primary-50' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <FlashCard className="p-6">
                <div className="text-center">
                  {/* Avatar Upload */}
                  <AvatarUpload
                    currentAvatar={user.avatar}
                    onAvatarChange={handleAvatarChange}
                    size="xlarge"
                    className="mb-6"
                  />

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                  <p className="text-gray-600 mb-1">{user.email}</p>
                  <p className="text-gray-500 text-sm mb-4">{user.phone}</p>

                  {/* Rating */}
                  <div className="flex justify-center items-center mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(user.rating || 0)}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {(user.rating || 0).toFixed(1)} ({user.totalRides || 0} rides)
                    </span>
                  </div>

                  {/* Verification Status */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${user.isPhoneVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-600">
                        Phone {user.isPhoneVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${user.isEmailVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-600">
                        Email {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Member since</p>
                    <p className="font-medium text-gray-900">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                </div>
              </FlashCard>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <FlashCard className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {isEditing ? 'Edit Profile' : 'Profile Information'}
                  </h3>
                  <Button
                    variant={isEditing ? 'outline' : 'primary'}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="input-field"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="input-field"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          disabled={!isEditing}
                          min="18"
                          max="100"
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="input-field"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">About Me</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows="4"
                        maxLength="500"
                        className="input-field"
                        placeholder="Tell us about yourself, your interests, or what you're looking for in ride companions..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.bio.length}/500 characters
                      </p>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Ride Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          name="preferences.smoking"
                          checked={formData.preferences.smoking}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Smoking allowed</span>
                      </label>

                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          name="preferences.music"
                          checked={formData.preferences.music}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Music during rides</span>
                      </label>

                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          name="preferences.pets"
                          checked={formData.preferences.pets}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Pets allowed</span>
                      </label>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          name="emergencyContact.name"
                          value={formData.emergencyContact.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="input-field"
                          placeholder="Emergency contact name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="emergencyContact.phone"
                          value={formData.emergencyContact.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="input-field"
                          placeholder="Emergency contact phone"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Relationship
                        </label>
                        <input
                          type="text"
                          name="emergencyContact.relationship"
                          value={formData.emergencyContact.relationship}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="input-field"
                          placeholder="e.g., Spouse, Parent, Friend"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  {isEditing && (
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </form>
              </FlashCard>
            </div>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <FlashCard className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Reviews</h3>
                <p className="text-gray-600">See what others are saying about you</p>
              </div>
              
              <ReviewList userId={user.id} limit={10} />
            </FlashCard>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FlashCard className="p-6 text-center">
                  <div className="text-4xl mb-2">🚗</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    <AnimatedCounter end={stats.totalRides || 0} />
                  </div>
                  <div className="text-gray-600">Total Rides</div>
                </FlashCard>

                <FlashCard className="p-6 text-center">
                  <div className="text-4xl mb-2">⭐</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    <AnimatedCounter end={stats.averageRating || 0} suffix="" />
                  </div>
                  <div className="text-gray-600">Average Rating</div>
                </FlashCard>

                <FlashCard className="p-6 text-center">
                  <div className="text-4xl mb-2">👥</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    <AnimatedCounter end={stats.totalPassengers || 0} />
                  </div>
                  <div className="text-gray-600">Passengers Met</div>
                </FlashCard>

                <FlashCard className="p-6 text-center">
                  <div className="text-4xl mb-2">📅</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.memberSince ? new Date(stats.memberSince).getFullYear() : 'N/A'}
                  </div>
                  <div className="text-gray-600">Member Since</div>
                </FlashCard>
              </div>
            )}

            <FlashCard className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-600 text-sm">🚗</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Last Ride</p>
                      <p className="text-sm text-gray-600">
                        {stats?.lastRideDate 
                          ? new Date(stats.lastRideDate).toLocaleDateString()
                          : 'No rides yet'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-sm">⭐</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Last Review</p>
                      <p className="text-sm text-gray-600">
                        {stats?.lastReviewDate 
                          ? new Date(stats.lastReviewDate).toLocaleDateString()
                          : 'No reviews yet'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FlashCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;