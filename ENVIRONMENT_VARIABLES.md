# Environment Variables Configuration

## 🔧 Backend Environment Variables (Railway/Render)

Copy these exactly into your Railway/Render environment variables:

### Required Variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://narmadamart_db_user:YOUR_ACTUAL_PASSWORD@cluster0.aesghjx.mongodb.net/linkcab?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=LinkCab_Super_Secret_JWT_Key_2024!
JWT_EXPIRE=7d
OTP_SECRET=LinkCab_OTP_Secret_Key_12345
OTP_EXPIRE=300000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### ⚠️ Important Notes:
1. **Replace `YOUR_ACTUAL_PASSWORD`** with your real MongoDB Atlas password
2. **Update `FRONTEND_URL`** with your actual Vercel deployment URL
3. **Keep all other values exactly as shown**

## 🌐 Frontend Environment Variables (Vercel)

Add these in your Vercel dashboard under Settings → Environment Variables:

```env
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

### ⚠️ Important Notes:
1. **Replace `your-railway-app`** with your actual Railway deployment URL
2. **Must include `/api` at the end**
3. **Must start with `https://`**

## 🔄 Step-by-Step Setup

### 1. Railway Backend Setup:
1. Go to Railway dashboard
2. Select your project
3. Go to "Variables" tab
4. Add each environment variable one by one
5. Click "Deploy" after adding all variables

### 2. Vercel Frontend Setup:
1. Go to Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add `VITE_API_URL` variable
5. Redeploy from "Deployments" tab

## 🔍 How to Get Your URLs

### Railway Backend URL:
1. Deploy your backend to Railway
2. Go to your project dashboard
3. Copy the URL from "Deployments" section
4. Format: `https://your-project-name.up.railway.app`

### Vercel Frontend URL:
1. Deploy your frontend to Vercel
2. Go to your project dashboard
3. Copy the URL from project overview
4. Format: `https://your-project-name.vercel.app`

## ✅ Final Configuration Example

Once you have both URLs, here's what your final configuration should look like:

### Railway Environment Variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://narmadamart_db_user:MySecurePassword123@cluster0.aesghjx.mongodb.net/linkcab?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=LinkCab_Super_Secret_JWT_Key_2024!
JWT_EXPIRE=7d
OTP_SECRET=LinkCab_OTP_Secret_Key_12345
OTP_EXPIRE=300000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
FRONTEND_URL=https://linkcab-frontend.vercel.app
```

### Vercel Environment Variables:
```env
VITE_API_URL=https://linkcab-backend.up.railway.app/api
```

## 🚨 Security Reminders

1. **Never commit** `.env` files to GitHub
2. **Use strong passwords** for your MongoDB Atlas
3. **Keep JWT secrets** complex and unique
4. **Regularly rotate** sensitive keys
5. **Use different secrets** for production vs development

## 🔧 Testing Your Configuration

### Test Backend:
```bash
curl https://your-railway-app.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "LinkCab API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### Test Frontend:
Visit your Vercel URL and check browser console for any API connection errors.

Your environment variables are now properly configured for production! 🎉
