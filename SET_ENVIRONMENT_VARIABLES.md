# 🔧 Set Environment Variables - Step by Step

## 📋 For Local Development

### 1. Create `.env` file in `backend` folder:

Create a file called `.env` in your `backend` directory and add these exact values:

```env
# Production Environment Variables for LinkCab Backend
NODE_ENV=production
PORT=5000

# MongoDB Atlas Connection - Your Database
MONGODB_URI=mongodb+srv://narmadamart_db_user:anurag@cluster0.aesghjx.mongodb.net/linkcab?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=LinkCab_Super_Secret_JWT_Key_2024!
JWT_EXPIRE=7d

# OTP Configuration  
OTP_SECRET=LinkCab_OTP_Secret_Key_12345
OTP_EXPIRE=300000

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Frontend URL (update after Vercel deployment)
FRONTEND_URL=http://localhost:5173

# Razorpay Configuration (add your keys when ready)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 2. Test Local Connection:

```bash
cd backend
npm install
npm start
```

You should see:
```
📦 MongoDB Connected: cluster0.aesghjx.mongodb.net
🚀 LinkCab API server running on port 5000
```

## 🚀 For Railway Deployment

### Add these Environment Variables in Railway Dashboard:

1. **Go to Railway.app → Your Project → Variables tab**
2. **Add each variable:**

```
Variable: NODE_ENV
Value: production

Variable: PORT
Value: 5000

Variable: MONGODB_URI
Value: mongodb+srv://narmadamart_db_user:anurag@cluster0.aesghjx.mongodb.net/linkcab?retryWrites=true&w=majority&appName=Cluster0

Variable: JWT_SECRET
Value: LinkCab_Super_Secret_JWT_Key_2024!

Variable: JWT_EXPIRE
Value: 7d

Variable: OTP_SECRET
Value: LinkCab_OTP_Secret_Key_12345

Variable: OTP_EXPIRE
Value: 300000

Variable: RATE_LIMIT_WINDOW
Value: 900000

Variable: RATE_LIMIT_MAX
Value: 100

Variable: FRONTEND_URL
Value: https://your-vercel-app.vercel.app
```

## 🌐 For Vercel Frontend

### Add Environment Variable in Vercel Dashboard:

1. **Go to Vercel.com → Your Project → Settings → Environment Variables**
2. **Add:**

```
Variable: VITE_API_URL
Value: https://your-railway-app.up.railway.app/api
```

## 📱 Quick Setup Commands

### Create .env file (Windows):
```cmd
cd backend
echo # LinkCab Environment Variables > .env
echo NODE_ENV=production >> .env
echo PORT=5000 >> .env
echo MONGODB_URI=mongodb+srv://narmadamart_db_user:anurag@cluster0.aesghjx.mongodb.net/linkcab?retryWrites=true^&w=majority^&appName=Cluster0 >> .env
echo JWT_SECRET=LinkCab_Super_Secret_JWT_Key_2024! >> .env
echo JWT_EXPIRE=7d >> .env
echo OTP_SECRET=LinkCab_OTP_Secret_Key_12345 >> .env
echo OTP_EXPIRE=300000 >> .env
echo RATE_LIMIT_WINDOW=900000 >> .env
echo RATE_LIMIT_MAX=100 >> .env
echo FRONTEND_URL=http://localhost:5173 >> .env
```

### Create .env file (Mac/Linux):
```bash
cd backend
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://narmadamart_db_user:anurag@cluster0.aesghjx.mongodb.net/linkcab?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=LinkCab_Super_Secret_JWT_Key_2024!
JWT_EXPIRE=7d
OTP_SECRET=LinkCab_OTP_Secret_Key_12345
OTP_EXPIRE=300000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
FRONTEND_URL=http://localhost:5173
EOF
```

## ✅ Test Your Connection

### 1. Start Backend:
```bash
cd backend
npm start
```

### 2. Check Health:
Visit: `http://localhost:5000/api/health`

Should return:
```json
{
  "status": "OK",
  "message": "LinkCab API is running",
  "timestamp": "2024-01-01T...",
  "environment": "production"
}
```

### 3. Check Database Connection:
Look for this in console:
```
📦 MongoDB Connected: cluster0.aesghjx.mongodb.net
```

## 🎯 Your Environment is Ready!

Once you see the MongoDB connection message, your environment variables are correctly set and your app is connected to your database! 🎉

## 🚀 Next Steps:

1. ✅ **Environment Variables Set**
2. ⏭️ **Deploy to Railway/Vercel**
3. ⏭️ **Test Live App**
4. ⏭️ **Go Live for Users!**
