# 🚂 Railway Deployment Fix Instructions

## 🚨 Current Issue
Railway is trying to deploy the frontend (root directory) instead of the backend directory.

## ✅ Solution

### Step 1: Configure Railway Correctly
1. **Go to Railway Dashboard**: https://railway.app
2. **Select your project**: `impartial-tenderness - linkcab-connect-meet-travel-`
3. **Go to Settings**
4. **Source Tab**
5. **Set Root Directory**: `backend` ⚠️ **CRITICAL**
6. **Save Changes**

### Step 2: Environment Variables
Add these in Railway Variables tab:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://narmadamart_db_user:anurag@cluster0.aesghjx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=linkcab-jwt-secret-production-2024
JWT_EXPIRE=7d
OTP_SECRET=linkcab-otp-secret-production-2024
OTP_EXPIRE=300000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
FRONTEND_URL=https://linkcab-connect-meet-travel.vercel.app
```

### Step 3: Redeploy
1. **Go to Deployments tab**
2. **Click "Redeploy"**
3. **Watch logs** - should show Node.js backend starting

## 🎯 Alternative: Fresh Railway Project
If the above doesn't work:
1. **Delete current Railway project**
2. **Create new project**
3. **Deploy from GitHub**
4. **IMMEDIATELY set Root Directory to `backend`**

## ✅ Success Indicators
- No more "vite not found" errors
- Logs show: "📦 MongoDB Connected"
- Health check works: `/api/health`
- Backend URL is accessible

## 🔗 URLs After Success
- **Backend**: `https://impartial-tenderness-production.up.railway.app`
- **Health Check**: `https://impartial-tenderness-production.up.railway.app/api/health`
