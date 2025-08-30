# 🚀 LinkCab Live Deployment Guide

## Quick Overview
Your LinkCab app will be deployed with:
- **Backend**: Railway (Node.js + MongoDB)
- **Frontend**: Vercel (React + Vite)
- **Database**: MongoDB Atlas (already configured)

---

## 🎯 Step-by-Step Deployment

### **STEP 1: Deploy Backend to Railway** 🚂

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Create New Project** → **Deploy from GitHub repo**
4. **Select your repository** (or fork it to your GitHub)
5. **Choose the backend folder** as root directory
6. **Set Environment Variables** in Railway:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://narmadamart_db_user:anurag@cluster0.aesghjx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
   JWT_EXPIRE=7d
   OTP_SECRET=your-otp-secret-key-change-this-in-production-2024
   OTP_EXPIRE=300000
   RATE_LIMIT_WINDOW=900000
   RATE_LIMIT_MAX=100
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```
7. **Deploy** and get your backend URL: `https://[your-app-name].railway.app`

### **STEP 2: Deploy Frontend to Vercel** ⚡

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Import Project** → Select your repository
4. **Configure Project**:
   - Framework Preset: **Vite**
   - Root Directory: **.**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Set Environment Variables** in Vercel:
   ```
   VITE_DEV_MODE=false
   VITE_API_URL=https://[your-backend-railway-url].railway.app
   ```
6. **Deploy** and get your frontend URL: `https://[your-app-name].vercel.app`

### **STEP 3: Update Cross-Origin URLs** 🔗

1. **Update Backend Environment** in Railway:
   - Set `FRONTEND_URL` to your actual Vercel URL
2. **Update Frontend Environment** in Vercel:
   - Set `VITE_API_URL` to your actual Railway URL
3. **Redeploy both services**

---

## 🛠️ Alternative: Deploy via Command Line

### **Backend (Railway CLI)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd backend
railway init
railway up
```

### **Frontend (Vercel CLI)**
```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel --prod
```

---

## 🔧 Environment Variables Summary

### **Backend (Railway)**
| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://narmadamart_db_user:anurag@cluster0.aesghjx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production-2024` |
| `FRONTEND_URL` | `https://your-frontend-domain.vercel.app` |

### **Frontend (Vercel)**
| Variable | Value |
|----------|-------|
| `VITE_DEV_MODE` | `false` |
| `VITE_API_URL` | `https://your-backend-domain.railway.app` |

---

## ✅ Final Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Cross-origin URLs updated
- [ ] MongoDB connection tested
- [ ] User registration/login tested
- [ ] Ride creation tested
- [ ] Real-time chat tested

---

## 🚀 Go Live Commands

Run this locally first to test build:
```cmd
npm run build
```

Your live URLs will be:
- **Frontend**: `https://[your-app-name].vercel.app`
- **Backend**: `https://[your-app-name].railway.app`
- **API Health**: `https://[your-app-name].railway.app/api/health`

---

## 🎉 Success!
Once deployed, your LinkCab app will be live and accessible worldwide! 🌍
