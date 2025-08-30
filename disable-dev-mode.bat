@echo off
echo Disabling Development Mode for Production...

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy "env.example" ".env"
)

REM Update .env file to disable development mode
echo Updating .env file...
powershell -Command "(Get-Content .env) -replace 'VITE_DEV_MODE=true', 'VITE_DEV_MODE=false' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace 'VITE_DEV_MODE=.*', 'VITE_DEV_MODE=false' | Set-Content .env"

echo.
echo Development mode has been disabled!
echo.
echo Changes made:
echo - VITE_DEV_MODE=false
echo.
echo The following features are now disabled:
echo - Mock user authentication
echo - Bypassed OTP verification  
echo - Development mode banners
echo - Test credentials display
echo - Automatic login with mock user
echo.
echo Restart your development server for changes to take effect:
echo npm run dev
echo.
pause
