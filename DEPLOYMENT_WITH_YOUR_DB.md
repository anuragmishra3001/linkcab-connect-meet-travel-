# 🚀 Deploy LinkCab with Your MongoDB Atlas Database

## Your Database Configuration

**Connection String:** 
```
mongodb+srv://narmadamart_db_user:<db_password>@cluster0.aesghjx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## 🔧 Step 1: Configure Your Database

### Update Your Connection String
Replace `<db_password>` with your actual password and add the database name:

```
mongodb+srv://narmadamart_db_user:YOUR_ACTUAL_PASSWORD@cluster0.aesghjx.mongodb.net/linkcab?retryWrites=true&w=majority&appName=Cluster0
```

### Set Database Name
Your connection string should end with `/linkcab` to specify the database name for your LinkCab application.

## 🚀 Step 2: Deploy Backend (Railway) - 10 Minutes

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login with GitHub**
3. **New Project** → **Deploy from GitHub repo**
4. **Select your repository**
5. **Add Environment Variables:**

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
FRONTEND_URL=*
```

6. **Deploy** → Wait for build to complete
7. **Copy your Railway URL** (e.g., `https://linkcab-backend-production.up.railway.app`)

## 🌐 Step 3: Deploy Frontend (Vercel) - 10 Minutes

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login with GitHub**
3. **New Project** → **Import your repository**
4. **Configure:**
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variables in Vercel:**
```env
VITE_API_URL=https://your-railway-app-url.up.railway.app/api
```

6. **Deploy** → Wait for build
7. **Copy your Vercel URL** (e.g., `https://linkcab.vercel.app`)

## 🔄 Step 4: Update CORS Configuration

1. **Go back to Railway dashboard**
2. **Update Environment Variables:**
```env
FRONTEND_URL=https://your-vercel-app.vercel.app
```
3. **Redeploy backend**

## ✅ Step 5: Test Your Live Application

### Backend Health Check
Visit: `https://your-railway-app.up.railway.app/api/health`

Should return:
```json
{
  "status": "OK",
  "message": "LinkCab API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### Frontend Test
Visit: `https://your-vercel-app.vercel.app`

### Test Features:
- [ ] User registration
- [ ] User login  
- [ ] Create a ride
- [ ] Search for rides
- [ ] Book a ride
- [ ] Profile management

## 🎯 Your Live URLs

After deployment, you'll have:

- **Frontend:** `https://your-app.vercel.app`
- **Backend API:** `https://your-app.up.railway.app/api`
- **Database:** Your existing MongoDB Atlas cluster

## 🔍 Troubleshooting

### Common Issues:

#### "Network Error" in Frontend
1. Check if `VITE_API_URL` in Vercel matches your Railway URL
2. Ensure Railway backend is running
3. Check CORS configuration

#### "Database Connection Failed"
1. Verify your MongoDB password in the connection string
2. Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
3. Ensure database name is `linkcab` in connection string

#### "CORS Error"
1. Update `FRONTEND_URL` in Railway with exact Vercel URL
2. Redeploy backend after CORS changes
3. Check Railway logs for CORS errors

### Check Logs:
- **Railway:** Dashboard → Your project → Deployments → View logs
- **Vercel:** Dashboard → Your project → Functions → View logs

## 🚀 Quick Deploy Commands

If you prefer command line:

### Deploy to Vercel:
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Check if everything works:
```bash
# Test backend
curl https://your-railway-app.up.railway.app/api/health

# Test frontend (should return HTML)
curl https://your-vercel-app.vercel.app
```

## 🎉 Go Live!

Once both deployments are complete and tested:

1. **Share your app:** `https://your-app.vercel.app`
2. **Monitor performance** through Railway/Vercel dashboards
3. **Collect user feedback**
4. **Scale as needed**

Your LinkCab application is now live with your MongoDB Atlas database! 🌍

## 📞 Need Help?

If you encounter any issues:
1. Check deployment logs
2. Verify all environment variables
3. Test API endpoints directly
4. Check database connection in MongoDB Atlas

Your app should be live and ready for users! 🎊
