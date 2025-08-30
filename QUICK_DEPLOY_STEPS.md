# Quick Deploy Steps - Get Your App Live in 30 Minutes

## 🚀 Express Setup Guide

### Step 1: Database Setup (5 minutes)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) → Sign up
2. Create free cluster → Name it "linkcab-cluster"
3. Create user: username `linkcab-admin`, password `LinkCab2024!`
4. Network Access → Allow access from anywhere (0.0.0.0/0)
5. Get connection string → Copy it

### Step 2: Backend Deployment (10 minutes)
1. Go to [Railway.app](https://railway.app) → Sign up with GitHub
2. New Project → Deploy from GitHub repo
3. Select your repository
4. Add these environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=super_secret_jwt_key_12345
   JWT_EXPIRE=7d
   OTP_SECRET=otp_secret_key_67890
   OTP_EXPIRE=300000
   FRONTEND_URL=*
   ```
5. Deploy → Wait for build to complete
6. Copy your Railway app URL (e.g., `https://your-app.railway.app`)

### Step 3: Frontend Deployment (10 minutes)
1. Create `.env.production` in your project root:
   ```
   VITE_API_URL=https://your-railway-app.railway.app/api
   ```

2. Go to [Vercel.com](https://vercel.com) → Sign up with GitHub
3. New Project → Import your repository
4. Configure:
   - Framework: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable in Vercel dashboard:
   - `VITE_API_URL` = `https://your-railway-app.railway.app/api`
6. Deploy → Wait for build

### Step 4: Final Setup (5 minutes)
1. Update CORS in your backend - go to Railway dashboard
2. Add environment variable:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
3. Redeploy backend on Railway
4. Test your live app!

## 🎉 Your App is Live!

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

### Test These Features:
- [ ] User registration
- [ ] User login
- [ ] Create a ride
- [ ] Search for rides
- [ ] Book a ride
- [ ] Profile management

## 🔧 Quick Fixes for Common Issues

### "Network Error" or "CORS Error"
1. Check FRONTEND_URL in Railway environment variables
2. Make sure it matches your Vercel URL exactly
3. Redeploy backend after changes

### "Database Connection Failed"
1. Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
2. Verify MONGODB_URI in Railway environment variables
3. Make sure password in connection string is correct

### "Build Failed" on Vercel
1. Check if VITE_API_URL is set in Vercel environment variables
2. Make sure all dependencies are in package.json
3. Check build logs for specific errors

### "Cannot GET /" on Railway
1. Make sure your backend/server.js is set up correctly
2. Check if PORT environment variable is set to 5000
3. Verify your start script in package.json

## 📞 Need Help?

If you encounter any issues:
1. Check the deployment logs in Railway/Vercel dashboards
2. Test your backend API directly: `https://your-app.railway.app/api/health`
3. Make sure all environment variables are set correctly

Your app should now be live and accessible to users worldwide! 🌍
