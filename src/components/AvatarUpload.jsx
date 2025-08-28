import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profileAPI } from '../services/api'

const AvatarUpload = ({ 
  currentAvatar, 
  onAvatarChange, 
  size = 'large',
  className = "" 
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
    xlarge: 'w-40 h-40'
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setError(null)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target.result)
    }
    reader.readAsDataURL(file)

    // Upload file
    uploadAvatar(file)
  }

  const uploadAvatar = async (file) => {
    setIsUploading(true)
    setError(null)

    try {
      const response = await profileAPI.uploadAvatar(file)
      const avatarUrl = response.data.data.avatarUrl
      onAvatarChange(avatarUrl)
      setPreviewUrl(null) // Clear preview after successful upload
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setError(error.response?.data?.message || 'Failed to upload image. Please try again.')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const deleteAvatar = async () => {
    if (!currentAvatar) return

    setIsUploading(true)
    setError(null)

    try {
      await profileAPI.deleteAvatar()
      onAvatarChange(null)
    } catch (error) {
      console.error('Error deleting avatar:', error)
      setError(error.response?.data?.message || 'Failed to delete image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const displayImage = previewUrl || currentAvatar

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Container */}
      <div className={`relative ${sizeClasses[size]} mx-auto`}>
        {/* Avatar Image/Placeholder */}
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center relative`}>
          {displayImage ? (
            <img
              src={displayImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-2xl font-bold">
              {getInitials('User')}
            </span>
          )}

          {/* Upload Overlay */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 rounded-full flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="text-white text-center">
              <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs">Change Photo</span>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>

        {/* Delete Button (if avatar exists) */}
        {currentAvatar && !isUploading && (
          <button
            type="button"
            onClick={deleteAvatar}
            className="absolute -bottom-2 -left-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-center"
          >
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Instructions */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          Click to upload a new photo
        </p>
        <p className="text-xs text-gray-400">
          JPG, PNG up to 5MB
        </p>
      </div>
    </div>
  )
}

export default AvatarUpload
