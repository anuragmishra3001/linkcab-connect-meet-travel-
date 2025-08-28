# Backend Avatar Upload Implementation

This document outlines the backend implementation needed to support the avatar upload functionality in the frontend.

## Required Dependencies

Add these to your backend `package.json`:

```json
{
  "dependencies": {
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.41.0",
    "sharp": "^0.32.6"
  }
}
```

## File Upload Configuration

### 1. Multer Configuration

Create `middleware/upload.js`:

```javascript
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

module.exports = upload;
```

### 2. Cloudinary Configuration

Create `config/cloudinary.js`:

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
```

### 3. Image Processing Utility

Create `utils/imageProcessor.js`:

```javascript
const sharp = require('sharp');
const cloudinary = require('../config/cloudinary');

const processAndUploadImage = async (buffer, userId) => {
  try {
    // Process image with Sharp
    const processedImageBuffer = await sharp(buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'avatars',
          public_id: `user_${userId}`,
          overwrite: true,
          transformation: [
            { width: 400, height: 400, crop: 'fill' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(processedImageBuffer);
    });

    return result.secure_url;
  } catch (error) {
    throw new Error('Image processing failed: ' + error.message);
  }
};

module.exports = { processAndUploadImage };
```

## API Routes

### 1. Avatar Upload Route

Add to your profile routes (`routes/profile.js`):

```javascript
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { processAndUploadImage } = require('../utils/imageProcessor');
const User = require('../models/User');

// Upload avatar
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Process and upload image
    const avatarUrl = await processAndUploadImage(req.file.buffer, req.user.id);

    // Update user's avatar in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true, select: '-password' }
    );

    res.json({
      success: true,
      data: {
        avatarUrl: avatarUrl,
        user: updatedUser
      },
      message: 'Avatar uploaded successfully'
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
});

// Delete avatar
router.delete('/avatar', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.avatar) {
      // Delete from Cloudinary (optional)
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`avatars/${publicId}`);
    }

    // Remove avatar from user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $unset: { avatar: 1 } },
      { new: true, select: '-password' }
    );

    res.json({
      success: true,
      data: {
        user: updatedUser
      },
      message: 'Avatar deleted successfully'
    });
  } catch (error) {
    console.error('Avatar deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete avatar'
    });
  }
});

module.exports = router;
```

### 2. Update Profile Route

Enhance your existing profile update route:

```javascript
// Update profile
router.put('/', auth, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      age,
      gender,
      bio,
      preferences,
      emergencyContact
    } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: req.user.id } 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already taken'
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        phone,
        age,
        gender,
        bio,
        preferences,
        emergencyContact
      },
      { new: true, select: '-password' }
    );

    res.json({
      success: true,
      data: {
        user: updatedUser
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});
```

## User Model Updates

Update your User model (`models/User.js`) to include avatar field:

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    default: null
  },
  age: {
    type: Number,
    min: 18,
    max: 100
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: 'prefer-not-to-say'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  preferences: {
    smoking: {
      type: Boolean,
      default: false
    },
    music: {
      type: Boolean,
      default: true
    },
    pets: {
      type: Boolean,
      default: false
    }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRides: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
```

## Environment Variables

Add these to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# File Upload Limits
MAX_FILE_SIZE=5242880
```

## Error Handling

Add global error handling for file uploads:

```javascript
// In your main app.js or server.js
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed!'
    });
  }
  
  next(error);
});
```

## Security Considerations

1. **File Type Validation**: Only allow image files
2. **File Size Limits**: Maximum 5MB per file
3. **Image Processing**: Resize and compress images
4. **Cloud Storage**: Use Cloudinary for secure storage
5. **Authentication**: Require authentication for uploads
6. **Rate Limiting**: Implement rate limiting for uploads

## Testing

Test the avatar upload functionality:

```bash
# Test avatar upload
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "avatar=@/path/to/image.jpg" \
  http://localhost:5000/api/profile/avatar

# Test avatar deletion
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/profile/avatar
```

## Frontend Integration

The frontend is already configured to work with these endpoints:

- `POST /api/profile/avatar` - Upload avatar
- `DELETE /api/profile/avatar` - Delete avatar
- `PUT /api/profile` - Update profile information

The `AvatarUpload` component will automatically handle the file upload and display the new avatar once the backend is implemented.
