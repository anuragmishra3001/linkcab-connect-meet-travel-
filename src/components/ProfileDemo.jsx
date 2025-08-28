import { useState } from 'react'
import { motion } from 'framer-motion'
import AvatarUpload from './AvatarUpload'
import FlashCard from './FlashCard'
import Button from './Button'

const ProfileDemo = () => {
  const [demoUser, setDemoUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    avatar: null,
    bio: 'I love traveling and meeting new people! Always up for a good conversation during rides.',
    rating: 4.8,
    totalRides: 15
  })

  const handleAvatarChange = (newAvatarUrl) => {
    setDemoUser(prev => ({ ...prev, avatar: newAvatarUrl }))
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Enhanced Profile Demo
        </h1>
        <p className="text-gray-600">
          Test the new profile features including avatar upload and enhanced editing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <FlashCard className="p-6">
            <div className="text-center">
              {/* Avatar Upload Demo */}
              <AvatarUpload
                currentAvatar={demoUser.avatar}
                onAvatarChange={handleAvatarChange}
                size="xlarge"
                className="mb-6"
              />

              <h2 className="text-2xl font-bold text-gray-900 mb-2">{demoUser.name}</h2>
              <p className="text-gray-600 mb-1">{demoUser.email}</p>
              <p className="text-gray-500 text-sm mb-4">{demoUser.phone}</p>

              {/* Rating */}
              <div className="flex justify-center items-center mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(demoUser.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : i < demoUser.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300 fill-current'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {demoUser.rating.toFixed(1)} ({demoUser.totalRides} rides)
                </span>
              </div>

              {/* Bio Preview */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">About</h3>
                <p className="text-sm text-gray-600">{demoUser.bio}</p>
              </div>
            </div>
          </FlashCard>
        </div>

        {/* Features Demo */}
        <div className="lg:col-span-2">
          <FlashCard className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              New Profile Features
            </h3>

            <div className="space-y-6">
              {/* Avatar Upload Features */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">🖼️ Avatar Upload</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Drag & drop or click to upload images</li>
                  <li>• Automatic image resizing and optimization</li>
                  <li>• Support for JPG, PNG formats up to 5MB</li>
                  <li>• Real-time preview before upload</li>
                  <li>• Delete avatar functionality</li>
                  <li>• Fallback to initials when no avatar</li>
                </ul>
              </div>

              {/* Profile Editing Features */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">✏️ Enhanced Profile Editing</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Edit name, email, phone, age, gender</li>
                  <li>• Extended bio field (500 characters)</li>
                  <li>• Ride preferences (smoking, music, pets)</li>
                  <li>• Emergency contact information</li>
                  <li>• Real-time form validation</li>
                  <li>• Auto-save functionality</li>
                </ul>
              </div>

              {/* UI/UX Features */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">🎨 Modern UI/UX</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Tabbed interface (Profile, Reviews, Statistics)</li>
                  <li>• Smooth animations and transitions</li>
                  <li>• Responsive design for all devices</li>
                  <li>• Loading states and error handling</li>
                  <li>• Modern card-based layout</li>
                  <li>• Interactive hover effects</li>
                </ul>
              </div>

              {/* Statistics Features */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">📊 Enhanced Statistics</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Total rides counter</li>
                  <li>• Average rating display</li>
                  <li>• Passengers met counter</li>
                  <li>• Member since information</li>
                  <li>• Recent activity tracking</li>
                  <li>• Animated counters</li>
                </ul>
              </div>
            </div>

            {/* Demo Actions */}
            <div className="mt-8 pt-6 border-t">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Try It Out</h4>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    // Simulate avatar upload
                    setDemoUser(prev => ({
                      ...prev,
                      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
                    }))
                  }}
                  variant="outline"
                >
                  Add Demo Avatar
                </Button>
                <Button
                  onClick={() => {
                    setDemoUser(prev => ({ ...prev, avatar: null }))
                  }}
                  variant="outline"
                >
                  Remove Avatar
                </Button>
                <Button
                  onClick={() => {
                    setDemoUser(prev => ({
                      ...prev,
                      bio: 'Updated bio: I love traveling and meeting new people! Always up for a good conversation during rides. Looking forward to sharing more journeys with fellow travelers.'
                    }))
                  }}
                  variant="outline"
                >
                  Update Bio
                </Button>
              </div>
            </div>
          </FlashCard>
        </div>
      </div>

      {/* Backend Integration Info */}
      <FlashCard className="p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🔧 Backend Integration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Required Backend Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• File upload handling (Multer)</li>
              <li>• Image processing (Sharp)</li>
              <li>• Cloud storage (Cloudinary)</li>
              <li>• Avatar upload endpoint</li>
              <li>• Avatar deletion endpoint</li>
              <li>• Enhanced profile update</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">API Endpoints:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <code>POST /api/profile/avatar</code> - Upload avatar</li>
              <li>• <code>DELETE /api/profile/avatar</code> - Delete avatar</li>
              <li>• <code>PUT /api/profile</code> - Update profile</li>
              <li>• <code>GET /api/profile/stats</code> - Get statistics</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 Check <code>BACKEND_AVATAR_SETUP.md</code> for complete backend implementation guide.
          </p>
        </div>
      </FlashCard>
    </div>
  )
}

export default ProfileDemo
