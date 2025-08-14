# Authentication Troubleshooting Guide

## Recent Fixes

We've made the following changes to fix authentication issues:

1. **Updated CORS Configuration**:
   - Modified the backend server to accept requests from the Vercel deployment URL
   - Used environment variables for better configuration management

2. **Updated Backend Environment**:
   - Set `NODE_ENV` to production
   - Updated MongoDB connection string for cloud database
   - Added secure JWT secret for production
   - Added frontend URL for CORS configuration

## Common Authentication Issues

### 1. Signup Not Working

Possible causes:

- **CORS Issues**: The backend wasn't allowing requests from the frontend domain
- **Database Connection**: MongoDB connection string might be incorrect
- **Environment Variables**: Missing or incorrect environment variables

### 2. Login Not Working

Possible causes:

- **JWT Secret**: Different JWT secrets between development and production
- **Token Expiration**: JWT tokens might be expiring too quickly
- **API URL**: Frontend might be using incorrect API URL

### 3. OTP Verification Issues

Possible causes:

- **OTP Expiration**: OTP might be expiring before verification
- **Phone Number Format**: Ensure phone numbers are in the correct format

## Verifying the Fix

1. **Clear Browser Cache**:
   - Clear your browser cache or try in incognito mode
   - This ensures you're using the latest deployed version

2. **Check Network Requests**:
   - Open browser developer tools (F12)
   - Go to the Network tab
   - Try to sign up and check for any failed requests
   - Look for CORS errors or 4xx/5xx status codes

3. **Check Console Errors**:
   - Open browser developer tools (F12)
   - Go to the Console tab
   - Look for any error messages related to authentication

## Backend Environment Variables

Make sure these environment variables are set in your Vercel project settings:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.vercel.app
OTP_SECRET=your_otp_secret
OTP_EXPIRE=300000
```

## Frontend Environment Variables

Make sure these environment variables are set in your frontend:

```
VITE_API_URL=https://your-backend-url.vercel.app/api
VITE_APP_SOCKET_URL=https://your-backend-url.vercel.app
```

## Still Having Issues?

If you're still experiencing authentication problems:

1. Check the Vercel deployment logs for any errors
2. Verify that both frontend and backend are deployed correctly
3. Ensure your MongoDB Atlas database is properly configured and accessible
4. Check that your environment variables are correctly set in Vercel