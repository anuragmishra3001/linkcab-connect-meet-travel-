# 🚀 Your Exact Deployment Configuration

## 📋 Your MongoDB Connection Details

**Username:** `narmadamart_db_user`  
**Password:** `anurag`  
**Cluster:** `cluster0.aesghjx.mongodb.net`

## 🔧 Backend Environment Variables (Railway/Render)

Copy these EXACT values into your Railway environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://narmadamart_db_user:anurag@cluster0.aesghjx.mongodb.net/linkcab?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=LinkCab_Super_Secret_JWT_Key_2024!
JWT_EXPIRE=7d
OTP_SECRET=LinkCab_OTP_Secret_Key_12345
OTP_EXPIRE=300000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
FRONTEND_URL=*
```

## 🚀 Deploy Now - Step by Step

### Step 1: Deploy Backend to Railway (10 minutes)

1. **Go to [Railway.app](https://railway.app)**
2. **Click "Login" → Sign in with GitHub**
3. **Click "New Project"**
4. **Click "Deploy from GitHub repo"**
5. **Select your LinkcCab repository**
6. **Click on your deployed service**
7. **Go to "Variables" tab**
8. **Add these variables ONE BY ONE:**

```
Variable Name: NODE_ENV
Value: production

Variable Name: PORT  
Value: 5000

Variable Name: MONGODB_URI
Value: mongodb+srv://narmadamart_db_user:anurag@cluster0.aesghjx.mongodb.net/linkcab?retryWrites=true&w=majority&appName=Cluster0

Variable Name: JWT_SECRET
Value: LinkCab_Super_Secret_JWT_Key_2024!

Variable Name: JWT_EXPIRE
Value: 7d

Variable Name: OTP_SECRET
Value: LinkCab_OTP_Secret_Key_12345

Variable Name: OTP_EXPIRE
Value: 300000

Variable Name: RATE_LIMIT_WINDOW
Value: 900000

Variable Name: RATE_LIMIT_MAX
Value: 100

Variable Name: FRONTEND_URL
Value: *
```

9. **Wait for deployment to complete**
10. **Copy your Railway URL** (something like: `https://linkcab-backend-production.up.railway.app`)

### Step 2: Deploy Frontend to Vercel (10 minutes)

1. **Go to [Vercel.com](https://vercel.com)**
2. **Click "Continue with GitHub"**
3. **Click "Add New Project"**
4. **Find and Import your LinkCab repository**
5. **Configure deployment:**
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://YOUR_RAILWAY_URL.up.railway.app/api`
   - (Replace YOUR_RAILWAY_URL with the URL you copied from Railway)

7. **Click "Deploy"**
8. **Wait for build to complete**
9. **Copy your Vercel URL** (something like: `https://linkcab.vercel.app`)

### Step 3: Update CORS (5 minutes)

1. **Go back to Railway dashboard**
2. **Click on your project**
3. **Go to "Variables" tab**
4. **Find "FRONTEND_URL" variable**
5. **Update its value to your Vercel URL** (exact URL you copied)
6. **Click "Redeploy"**

## ✅ Test Your Live App

### 1. Test Backend API:
Visit: `https://your-railway-url.up.railway.app/api/health`

You should see:
```json
{
  "status": "OK",
  "message": "LinkCab API is running",
  "timestamp": "2024-01-XX...",
  "environment": "production"
}
```

### 2. Test Frontend:
Visit: `https://your-vercel-url.vercel.app`

### 3. Test Full Functionality:
- [ ] Open the app
- [ ] Try to register a new user
- [ ] Try to login
- [ ] Create a test ride
- [ ] Check if all features work

## 🎯 Your Final URLs

After successful deployment:

- **Live App:** `https://your-app-name.vercel.app`
- **API Backend:** `https://your-app-name.up.railway.app/api`
- **Database:** Your existing MongoDB Atlas (already configured)

## 🚨 Troubleshooting

### If Backend Shows "Database Connection Error":
1. Check MongoDB Atlas dashboard
2. Ensure IP Whitelist includes `0.0.0.0/0` (allow all)
3. Verify password is exactly: `anurag`
4. Check Railway logs for specific error

### If Frontend Shows "Network Error":
1. Verify `VITE_API_URL` in Vercel exactly matches Railway URL
2. Ensure Railway URL includes `/api` at the end
3. Check browser console for CORS errors

### If CORS Errors:
1. Update `FRONTEND_URL` in Railway with exact Vercel URL
2. Redeploy backend
3. Clear browser cache

## 🎉 Ready to Go Live!

Your LinkCab app will be:
- ✅ **Globally accessible**
- ✅ **Secure with HTTPS**
- ✅ **Connected to your MongoDB**
- ✅ **Ready for real users**
- ✅ **Automatically scaled**

Start the deployment now - your app will be live in 30 minutes! 🚀
