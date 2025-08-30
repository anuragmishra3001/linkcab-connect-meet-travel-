@echo off
echo ========================================
echo LinkCab Production Deployment Script
echo ========================================
echo.

setlocal enabledelayedexpansion

REM Configuration
set PROJECT_ID=linkcab-production
set REGION=us-central1
set SERVICE_NAME=linkcab-backend
set IMAGE_NAME=gcr.io/%PROJECT_ID%/%SERVICE_NAME%

REM Colors
set RED=[ERROR]
set GREEN=[SUCCESS]
set YELLOW=[WARNING]
set BLUE=[INFO]

echo %BLUE% Starting production deployment...
echo.

REM Check prerequisites
echo %BLUE% Checking prerequisites...

where gcloud >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED% Google Cloud SDK is not installed. Please install it first.
    echo %YELLOW% Download from: https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED% Docker is not installed. Please install it first.
    pause
    exit /b 1
)

echo %GREEN% Prerequisites check passed!
echo.

REM Step 1: Setup Google Cloud Project
echo %BLUE% Step 1: Setting up Google Cloud Project...
gcloud config set project %PROJECT_ID%
if %errorlevel% neq 0 (
    echo %RED% Failed to set project. Please check your gcloud configuration.
    pause
    exit /b 1
)

REM Step 2: Enable required APIs
echo %BLUE% Step 2: Enabling required APIs...
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com

REM Step 3: Configure Docker for GCR
echo %BLUE% Step 3: Configuring Docker for Google Container Registry...
gcloud auth configure-docker

REM Step 4: Build and push Docker image
echo %BLUE% Step 4: Building and pushing Docker image...
cd backend
docker build -t %IMAGE_NAME%:latest .
if %errorlevel% neq 0 (
    echo %RED% Docker build failed!
    pause
    exit /b 1
)

docker push %IMAGE_NAME%:latest
if %errorlevel% neq 0 (
    echo %RED% Docker push failed!
    pause
    exit /b 1
)
cd ..

REM Step 5: Deploy to Cloud Run
echo %BLUE% Step 5: Deploying to Google Cloud Run...
gcloud run deploy %SERVICE_NAME% ^
    --image %IMAGE_NAME%:latest ^
    --platform managed ^
    --region %REGION% ^
    --allow-unauthenticated ^
    --port 5000 ^
    --memory 1Gi ^
    --cpu 1 ^
    --max-instances 10 ^
    --set-env-vars "NODE_ENV=production" ^
    --set-env-vars "DB_HOST=/cloudsql/%PROJECT_ID%:%REGION%:linkcab-db" ^
    --set-env-vars "DB_NAME=linkcab" ^
    --set-env-vars "DB_USER=linkcab_user" ^
    --set-env-vars "DB_PASSWORD=YourStrongPassword123!" ^
    --set-env-vars "DB_SSL=true" ^
    --set-env-vars "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" ^
    --add-cloudsql-instances %PROJECT_ID%:%REGION%:linkcab-db

if %errorlevel% neq 0 (
    echo %RED% Cloud Run deployment failed!
    pause
    exit /b 1
)

REM Step 6: Get service URL
echo %BLUE% Step 6: Getting service URL...
for /f "tokens=*" %%i in ('gcloud run services describe %SERVICE_NAME% --region=%REGION% --format="value(status.url)"') do set SERVICE_URL=%%i

echo.
echo ========================================
echo %GREEN% DEPLOYMENT COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo %BLUE% Service Details:
echo - Service Name: %SERVICE_NAME%
echo - Region: %REGION%
echo - URL: %SERVICE_URL%
echo.
echo %BLUE% Next Steps:
echo 1. Update your frontend .env with the new API URL
echo 2. Deploy frontend to Vercel or your preferred platform
echo 3. Test the application
echo 4. Set up custom domain (optional)
echo.
echo %YELLOW% Important Security Notes:
echo - Change the JWT_SECRET in production
echo - Change the database password
echo - Set up proper CORS configuration
echo - Enable SSL/TLS
echo.
pause
