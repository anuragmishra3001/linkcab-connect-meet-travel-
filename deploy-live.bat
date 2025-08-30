@echo off
echo 🚀 LinkCab Live Deployment Script
echo ================================

echo.
echo 📦 Building Frontend...
call npm run build

echo.
echo 🎯 Frontend build complete!
echo Next steps:
echo 1. Deploy backend to Railway: https://railway.app
echo 2. Deploy frontend to Vercel: https://vercel.com
echo 3. Update environment variables with live URLs

echo.
echo 🔗 Deployment URLs will be:
echo - Backend: https://[your-app-name].railway.app
echo - Frontend: https://[your-app-name].vercel.app

pause
