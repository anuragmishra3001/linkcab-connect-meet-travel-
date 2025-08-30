@echo off
REM LinkCab Deployment Script for Windows
REM This script helps deploy the application to various platforms

setlocal enabledelayedexpansion

REM Configuration
set APP_NAME=linkcab
set VERSION=1.0.0
set DOCKER_REGISTRY=your-registry.com
set GCP_PROJECT_ID=your-gcp-project-id
set GCP_REGION=us-central1

REM Colors for output (Windows doesn't support ANSI colors in batch)
set RED=[ERROR]
set GREEN=[SUCCESS]
set YELLOW=[WARNING]
set BLUE=[INFO]

REM Functions
:log_info
echo %BLUE% %~1
goto :eof

:log_success
echo %GREEN% %~1
goto :eof

:log_warning
echo %YELLOW% %~1
goto :eof

:log_error
echo %RED% %~1
goto :eof

REM Check if required tools are installed
:check_dependencies
call :log_info "Checking dependencies..."

where docker >nul 2>&1
if %errorlevel% neq 0 (
    call :log_error "Docker is required but not installed. Aborting."
    exit /b 1
)

where docker-compose >nul 2>&1
if %errorlevel% neq 0 (
    call :log_error "Docker Compose is required but not installed. Aborting."
    exit /b 1
)

where node >nul 2>&1
if %errorlevel% neq 0 (
    call :log_error "Node.js is required but not installed. Aborting."
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    call :log_error "npm is required but not installed. Aborting."
    exit /b 1
)

call :log_success "All dependencies are installed"
goto :eof

REM Build the application
:build_app
call :log_info "Building application..."

REM Install frontend dependencies
npm install
if %errorlevel% neq 0 (
    call :log_error "Failed to install frontend dependencies"
    exit /b 1
)

REM Build frontend
npm run build
if %errorlevel% neq 0 (
    call :log_error "Failed to build frontend"
    exit /b 1
)

REM Install backend dependencies
cd backend
npm install
if %errorlevel% neq 0 (
    call :log_error "Failed to install backend dependencies"
    exit /b 1
)
cd ..

call :log_success "Application built successfully"
goto :eof

REM Build Docker images
:build_docker
call :log_info "Building Docker images..."

REM Build frontend image
docker build -t %APP_NAME%-frontend:%VERSION% .
if %errorlevel% neq 0 (
    call :log_error "Failed to build frontend Docker image"
    exit /b 1
)

REM Build backend image
docker build -t %APP_NAME%-backend:%VERSION% ./backend
if %errorlevel% neq 0 (
    call :log_error "Failed to build backend Docker image"
    exit /b 1
)

call :log_success "Docker images built successfully"
goto :eof

REM Deploy to local Docker
:deploy_local
call :log_info "Deploying to local Docker..."

REM Stop existing containers
docker-compose down

REM Build and start containers
docker-compose up --build -d
if %errorlevel% neq 0 (
    call :log_error "Failed to start Docker containers"
    exit /b 1
)

call :log_success "Application deployed locally at http://localhost"
goto :eof

REM Deploy to Google Cloud Run
:deploy_gcp
call :log_info "Deploying to Google Cloud Run..."

REM Check if gcloud is installed
where gcloud >nul 2>&1
if %errorlevel% neq 0 (
    call :log_error "Google Cloud SDK is required but not installed. Aborting."
    exit /b 1
)

REM Configure gcloud
gcloud config set project %GCP_PROJECT_ID%

REM Build and push images to Google Container Registry
docker tag %APP_NAME%-frontend:%VERSION% gcr.io/%GCP_PROJECT_ID%/%APP_NAME%-frontend:%VERSION%
docker tag %APP_NAME%-backend:%VERSION% gcr.io/%GCP_PROJECT_ID%/%APP_NAME%-backend:%VERSION%

docker push gcr.io/%GCP_PROJECT_ID%/%APP_NAME%-frontend:%VERSION%
docker push gcr.io/%GCP_PROJECT_ID%/%APP_NAME%-backend:%VERSION%

REM Deploy to Cloud Run
gcloud run deploy %APP_NAME%-frontend --image gcr.io/%GCP_PROJECT_ID%/%APP_NAME%-frontend:%VERSION% --platform managed --region %GCP_REGION% --allow-unauthenticated --port 3000

gcloud run deploy %APP_NAME%-backend --image gcr.io/%GCP_PROJECT_ID%/%APP_NAME%-backend:%VERSION% --platform managed --region %GCP_REGION% --allow-unauthenticated --port 5000 --set-env-vars "DB_HOST=%DB_HOST%,DB_NAME=%DB_NAME%,DB_USER=%DB_USER%,DB_PASSWORD=%DB_PASSWORD%,JWT_SECRET=%JWT_SECRET%"

call :log_success "Application deployed to Google Cloud Run"
goto :eof

REM Deploy to Vercel
:deploy_vercel
call :log_info "Deploying to Vercel..."

REM Check if vercel CLI is installed
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    call :log_error "Vercel CLI is required but not installed. Run: npm i -g vercel"
    exit /b 1
)

REM Deploy frontend
vercel --prod

call :log_success "Application deployed to Vercel"
goto :eof

REM Setup Cloud SQL
:setup_cloud_sql
call :log_info "Setting up Cloud SQL..."

REM Create Cloud SQL instance
gcloud sql instances create %APP_NAME%-db --database-version=MYSQL_8_0 --tier=db-f1-micro --region=%GCP_REGION% --root-password=%DB_PASSWORD%

REM Create database
gcloud sql databases create %DB_NAME% --instance=%APP_NAME%-db

REM Create user
gcloud sql users create %DB_USER% --instance=%APP_NAME%-db --password=%DB_PASSWORD%

call :log_success "Cloud SQL setup completed"
goto :eof

REM Run database migrations
:run_migrations
call :log_info "Running database migrations..."

cd backend
npm run db:migrate
if %errorlevel% neq 0 (
    call :log_error "Failed to run database migrations"
    exit /b 1
)
cd ..

call :log_success "Database migrations completed"
goto :eof

REM Seed database
:seed_database
call :log_info "Seeding database..."

cd backend
npm run db:seed
if %errorlevel% neq 0 (
    call :log_error "Failed to seed database"
    exit /b 1
)
cd ..

call :log_success "Database seeded successfully"
goto :eof

REM Show usage
:show_usage
echo Usage: %0 [OPTION]
echo.
echo Options:
echo   build       Build the application
echo   docker      Build Docker images
echo   local       Deploy to local Docker
echo   gcp         Deploy to Google Cloud Run
echo   vercel      Deploy to Vercel
echo   setup-db    Setup Cloud SQL database
echo   migrate     Run database migrations
echo   seed        Seed database with test data
echo   all         Build and deploy everything
echo   help        Show this help message
goto :eof

REM Main script
if "%1"=="build" (
    call :check_dependencies
    call :build_app
) else if "%1"=="docker" (
    call :check_dependencies
    call :build_docker
) else if "%1"=="local" (
    call :check_dependencies
    call :build_app
    call :deploy_local
) else if "%1"=="gcp" (
    call :check_dependencies
    call :build_app
    call :build_docker
    call :deploy_gcp
) else if "%1"=="vercel" (
    call :check_dependencies
    call :build_app
    call :deploy_vercel
) else if "%1"=="setup-db" (
    call :setup_cloud_sql
) else if "%1"=="migrate" (
    call :run_migrations
) else if "%1"=="seed" (
    call :seed_database
) else if "%1"=="all" (
    call :check_dependencies
    call :build_app
    call :build_docker
    call :deploy_local
) else (
    call :show_usage
)

endlocal
