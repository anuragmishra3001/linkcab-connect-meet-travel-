@echo off
echo 🚀 Deploying LinkCab to Railway...
echo.

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI not found. Installing...
    npm install -g @railway/cli
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Railway CLI
        pause
        exit /b 1
    )
)

echo ✅ Railway CLI found
echo.

REM Login to Railway
echo 🔐 Logging into Railway...
railway login
if %errorlevel% neq 0 (
    echo ❌ Failed to login to Railway
    pause
    exit /b 1
)

echo ✅ Logged into Railway
echo.

REM Link to existing project or create new one
echo 🔗 Linking to Railway project...
railway link
if %errorlevel% neq 0 (
    echo ❌ Failed to link project
    pause
    exit /b 1
)

echo ✅ Project linked
echo.

REM Set environment variables
echo 🔧 Setting environment variables...
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="mongodb+srv://anuragmishra3002:anurag123@cluster0.kkzllaj.mongodb.net/linkcab?retryWrites=true&w=majority"
railway variables set JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
railway variables set JWT_EXPIRE="7d"
railway variables set OTP_SECRET="your-otp-secret-key"
railway variables set OTP_EXPIRE="300000"
railway variables set RATE_LIMIT_WINDOW="900000"
railway variables set RATE_LIMIT_MAX="50"
railway variables set FRONTEND_URL="https://your-frontend-domain.vercel.app"

echo ✅ Environment variables set
echo.

REM Deploy to Railway
echo 🚀 Deploying to Railway...
railway up
if %errorlevel% neq 0 (
    echo ❌ Deployment failed
    pause
    exit /b 1
)

echo ✅ Deployment successful!
echo.

REM Show deployment info
echo 📊 Deployment Information:
railway status

echo.
echo 🌐 Your app is now running on Railway!
echo 📱 Check the Railway dashboard for the live URL
echo.

pause
