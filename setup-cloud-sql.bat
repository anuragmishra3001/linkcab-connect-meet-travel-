@echo off
echo Setting up Cloud SQL Database for LinkCab Production...

REM Configuration
set PROJECT_ID=linkcab-production
set REGION=us-central1
set INSTANCE_NAME=linkcab-db
set DATABASE_NAME=linkcab
set DB_USER=linkcab_user
set DB_PASSWORD=YourStrongPassword123!

echo.
echo Configuration:
echo Project ID: %PROJECT_ID%
echo Region: %REGION%
echo Instance: %INSTANCE_NAME%
echo Database: %DATABASE_NAME%
echo User: %DB_USER%
echo.

REM Check if gcloud is installed
where gcloud >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Google Cloud SDK is not installed.
    echo Please install from: https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

echo Step 1: Setting up Google Cloud Project...
gcloud config set project %PROJECT_ID%

echo Step 2: Enabling required APIs...
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com

echo Step 3: Creating Cloud SQL instance...
gcloud sql instances create %INSTANCE_NAME% ^
    --database-version=MYSQL_8_0 ^
    --tier=db-f1-micro ^
    --region=%REGION% ^
    --root-password=%DB_PASSWORD% ^
    --storage-type=SSD ^
    --storage-size=10GB ^
    --backup-start-time=02:00 ^
    --backup-retention-days=7 ^
    --maintenance-window-day=SUN ^
    --maintenance-window-hour=03

echo Step 4: Creating database...
gcloud sql databases create %DATABASE_NAME% --instance=%INSTANCE_NAME%

echo Step 5: Creating application user...
gcloud sql users create %DB_USER% --instance=%INSTANCE_NAME% --password=%DB_PASSWORD%

echo Step 6: Getting connection information...
gcloud sql instances describe %INSTANCE_NAME% --format="value(connectionName)"

echo.
echo ========================================
echo CLOUD SQL SETUP COMPLETED!
echo ========================================
echo.
echo Connection Details:
echo - Instance: %INSTANCE_NAME%
echo - Database: %DATABASE_NAME%
echo - User: %DB_USER%
echo - Password: %DB_PASSWORD%
echo.
echo Next Steps:
echo 1. Update backend/.env with these details
echo 2. Run: npm run db:migrate
echo 3. Run: npm run db:seed
echo 4. Deploy backend: npm run deploy:gcp
echo.
pause
