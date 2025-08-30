#!/bin/bash

# LinkCab Deployment Script
# This script helps deploy the application to various platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="linkcab"
VERSION=$(node -p "require('./package.json').version")
DOCKER_REGISTRY="your-registry.com"
GCP_PROJECT_ID="your-gcp-project-id"
GCP_REGION="us-central1"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    log_info "Checking dependencies..."
    
    command -v docker >/dev/null 2>&1 || { log_error "Docker is required but not installed. Aborting."; exit 1; }
    command -v docker-compose >/dev/null 2>&1 || { log_error "Docker Compose is required but not installed. Aborting."; exit 1; }
    command -v node >/dev/null 2>&1 || { log_error "Node.js is required but not installed. Aborting."; exit 1; }
    command -v npm >/dev/null 2>&1 || { log_error "npm is required but not installed. Aborting."; exit 1; }
    
    log_success "All dependencies are installed"
}

# Build the application
build_app() {
    log_info "Building application..."
    
    # Install frontend dependencies
    npm install
    
    # Build frontend
    npm run build
    
    # Install backend dependencies
    cd backend
    npm install
    cd ..
    
    log_success "Application built successfully"
}

# Build Docker images
build_docker() {
    log_info "Building Docker images..."
    
    # Build frontend image
    docker build -t ${APP_NAME}-frontend:${VERSION} .
    
    # Build backend image
    docker build -t ${APP_NAME}-backend:${VERSION} ./backend
    
    log_success "Docker images built successfully"
}

# Deploy to local Docker
deploy_local() {
    log_info "Deploying to local Docker..."
    
    # Stop existing containers
    docker-compose down
    
    # Build and start containers
    docker-compose up --build -d
    
    log_success "Application deployed locally at http://localhost"
}

# Deploy to Google Cloud Run
deploy_gcp() {
    log_info "Deploying to Google Cloud Run..."
    
    # Check if gcloud is installed
    command -v gcloud >/dev/null 2>&1 || { log_error "Google Cloud SDK is required but not installed. Aborting."; exit 1; }
    
    # Configure gcloud
    gcloud config set project ${GCP_PROJECT_ID}
    
    # Build and push images to Google Container Registry
    docker tag ${APP_NAME}-frontend:${VERSION} gcr.io/${GCP_PROJECT_ID}/${APP_NAME}-frontend:${VERSION}
    docker tag ${APP_NAME}-backend:${VERSION} gcr.io/${GCP_PROJECT_ID}/${APP_NAME}-backend:${VERSION}
    
    docker push gcr.io/${GCP_PROJECT_ID}/${APP_NAME}-frontend:${VERSION}
    docker push gcr.io/${GCP_PROJECT_ID}/${APP_NAME}-backend:${VERSION}
    
    # Deploy to Cloud Run
    gcloud run deploy ${APP_NAME}-frontend \
        --image gcr.io/${GCP_PROJECT_ID}/${APP_NAME}-frontend:${VERSION} \
        --platform managed \
        --region ${GCP_REGION} \
        --allow-unauthenticated \
        --port 3000
    
    gcloud run deploy ${APP_NAME}-backend \
        --image gcr.io/${GCP_PROJECT_ID}/${APP_NAME}-backend:${VERSION} \
        --platform managed \
        --region ${GCP_REGION} \
        --allow-unauthenticated \
        --port 5000 \
        --set-env-vars "DB_HOST=${DB_HOST},DB_NAME=${DB_NAME},DB_USER=${DB_USER},DB_PASSWORD=${DB_PASSWORD},JWT_SECRET=${JWT_SECRET}"
    
    log_success "Application deployed to Google Cloud Run"
}

# Deploy to Vercel
deploy_vercel() {
    log_info "Deploying to Vercel..."
    
    # Check if vercel CLI is installed
    command -v vercel >/dev/null 2>&1 || { log_error "Vercel CLI is required but not installed. Run: npm i -g vercel"; exit 1; }
    
    # Deploy frontend
    vercel --prod
    
    log_success "Application deployed to Vercel"
}

# Setup Cloud SQL
setup_cloud_sql() {
    log_info "Setting up Cloud SQL..."
    
    # Create Cloud SQL instance
    gcloud sql instances create ${APP_NAME}-db \
        --database-version=MYSQL_8_0 \
        --tier=db-f1-micro \
        --region=${GCP_REGION} \
        --root-password=${DB_PASSWORD}
    
    # Create database
    gcloud sql databases create ${DB_NAME} --instance=${APP_NAME}-db
    
    # Create user
    gcloud sql users create ${DB_USER} \
        --instance=${APP_NAME}-db \
        --password=${DB_PASSWORD}
    
    log_success "Cloud SQL setup completed"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    cd backend
    npm run db:migrate
    cd ..
    
    log_success "Database migrations completed"
}

# Seed database
seed_database() {
    log_info "Seeding database..."
    
    cd backend
    npm run db:seed
    cd ..
    
    log_success "Database seeded successfully"
}

# Show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  build       Build the application"
    echo "  docker      Build Docker images"
    echo "  local       Deploy to local Docker"
    echo "  gcp         Deploy to Google Cloud Run"
    echo "  vercel      Deploy to Vercel"
    echo "  setup-db    Setup Cloud SQL database"
    echo "  migrate     Run database migrations"
    echo "  seed        Seed database with test data"
    echo "  all         Build and deploy everything"
    echo "  help        Show this help message"
}

# Main script
case "$1" in
    "build")
        check_dependencies
        build_app
        ;;
    "docker")
        check_dependencies
        build_docker
        ;;
    "local")
        check_dependencies
        build_app
        deploy_local
        ;;
    "gcp")
        check_dependencies
        build_app
        build_docker
        deploy_gcp
        ;;
    "vercel")
        check_dependencies
        build_app
        deploy_vercel
        ;;
    "setup-db")
        setup_cloud_sql
        ;;
    "migrate")
        run_migrations
        ;;
    "seed")
        seed_database
        ;;
    "all")
        check_dependencies
        build_app
        build_docker
        deploy_local
        ;;
    "help"|*)
        show_usage
        ;;
esac
