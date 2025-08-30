# LinkCab Deployment Guide

This guide will help you deploy LinkCab with Cloud SQL database to various platforms.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- Docker and Docker Compose
- Google Cloud SDK (for GCP deployment)
- Vercel CLI (for Vercel deployment)

### 1. Environment Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd linkcab-connect-meet-travel

# Install dependencies
npm install
cd backend && npm install && cd ..

# Copy environment files
cp env.example .env
cp backend/env.example backend/.env
```

### 2. Configure Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_SOCKET_URL=http://localhost:5000
VITE_DEV_MODE=false  # Set to false for production
```

#### Backend (backend/.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Cloud SQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=linkcab
DB_USER=root
DB_PASSWORD=your-database-password
DB_SSL=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Razorpay Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret-key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Disable Development Mode

**Important**: For production deployment, make sure to disable development mode:

```bash
# In your .env file, set:
VITE_DEV_MODE=false

# Or for production environment:
cp env.production.example .env.production
# Then edit .env.production and set VITE_DEV_MODE=false
```

Development mode features that will be disabled:
- ✅ Mock user authentication (any credentials work)
- ✅ Bypassed OTP verification
- ✅ Development mode banners
- ✅ Test credentials display
- ✅ Automatic login with mock user

## 🐳 Local Docker Deployment

### 1. Build and Run with Docker Compose

```bash
# Make deploy script executable
chmod +x deploy.sh

# Deploy locally
npm run deploy:local
# or
./deploy.sh local
```

### 2. Access the Application

- Frontend: http://localhost
- Backend API: http://localhost/api
- Health Check: http://localhost/health

### 3. Database Operations

```bash
# Run migrations
npm run db:migrate

# Seed with test data
npm run db:seed

# View logs
docker-compose logs -f
```

## ☁️ Google Cloud Platform Deployment

### 1. Setup Google Cloud Project

```bash
# Install Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# Login to Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID
```

### 2. Setup Cloud SQL

```bash
# Create Cloud SQL instance
./deploy.sh setup-db

# Update backend/.env with Cloud SQL connection details
DB_HOST=/cloudsql/YOUR_PROJECT_ID:REGION:INSTANCE_NAME
DB_SSL=true
```

### 3. Deploy to Cloud Run

```bash
# Deploy to Google Cloud Run
npm run deploy:gcp
# or
./deploy.sh gcp
```

### 4. Configure Domain and SSL

```bash
# Map custom domain (optional)
gcloud run domain-mappings create \
  --service linkcab-frontend \
  --domain your-domain.com \
  --region us-central1
```

## 🚀 Vercel Deployment

### 1. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
npm run deploy:vercel
# or
./deploy.sh vercel
```

### 2. Configure Environment Variables in Vercel Dashboard

- `VITE_API_URL`: Your backend API URL
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `VITE_SOCKET_URL`: WebSocket server URL

## 🔧 Database Management

### Cloud SQL Connection

#### Using Cloud SQL Proxy (Recommended for Development)

```bash
# Install Cloud SQL Proxy
# https://cloud.google.com/sql/docs/mysql/connect-admin-proxy

# Start proxy
cloud_sql_proxy -instances=YOUR_PROJECT_ID:REGION:INSTANCE_NAME=tcp:3306

# Connect to database
mysql -h 127.0.0.1 -u root -p
```

#### Direct Connection (Production)

```bash
# Get connection info
gcloud sql instances describe linkcab-db

# Connect using gcloud
gcloud sql connect linkcab-db --user=root
```

### Database Operations

```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Backup database
gcloud sql export sql linkcab-db gs://your-bucket/backup.sql \
  --database=linkcab

# Restore database
gcloud sql import sql linkcab-db gs://your-bucket/backup.sql \
  --database=linkcab
```

## 🔒 Security Configuration

### 1. Environment Variables

Never commit sensitive information to version control:

```bash
# Add to .gitignore
.env
backend/.env
*.pem
*.key
```

### 2. SSL/TLS Configuration

For production, enable SSL:

```env
# Backend .env
DB_SSL=true
```

### 3. JWT Secret

Generate a strong JWT secret:

```bash
# Generate random secret
openssl rand -base64 32
```

### 4. Database Security

```bash
# Create application-specific user
gcloud sql users create linkcab_app \
  --instance=linkcab-db \
  --password=strong-password

# Grant minimal required permissions
mysql -h YOUR_HOST -u root -p
GRANT SELECT, INSERT, UPDATE, DELETE ON linkcab.* TO 'linkcab_app'@'%';
FLUSH PRIVILEGES;
```

## 📊 Monitoring and Logging

### 1. Application Logs

```bash
# View application logs
docker-compose logs -f backend

# View Cloud Run logs
gcloud logs read "resource.type=cloud_run_revision" \
  --limit=50
```

### 2. Database Monitoring

```bash
# Monitor Cloud SQL
gcloud sql instances describe linkcab-db

# View database logs
gcloud sql logs tail linkcab-db
```

### 3. Health Checks

```bash
# Application health
curl http://localhost/health

# Database health
curl http://localhost/api/health
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          npm install
          cd backend && npm install
          
      - name: Run tests
        run: npm test
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to Cloud Run
        run: |
          echo ${{ secrets.GCP_SA_KEY }} | gcloud auth activate-service-account --key-file=-
          gcloud config set project ${{ secrets.GCP_PROJECT_ID }}
          ./deploy.sh gcp
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check database connectivity
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD -e "SELECT 1"

# Verify Cloud SQL instance is running
gcloud sql instances describe linkcab-db
```

#### 2. Docker Issues

```bash
# Clean up Docker
docker system prune -a
docker volume prune

# Rebuild containers
docker-compose down
docker-compose up --build
```

#### 3. Environment Variables

```bash
# Verify environment variables
docker-compose exec backend env | grep DB_
```

#### 4. Port Conflicts

```bash
# Check port usage
lsof -i :3000
lsof -i :5000
lsof -i :3306
```

### Performance Optimization

#### 1. Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_payments_user ON payments(userId);
```

#### 2. Application Optimization

```bash
# Enable gzip compression
# Already configured in nginx.conf

# Enable caching
# Configure Redis for session storage
```

## 📈 Scaling

### 1. Horizontal Scaling

```bash
# Scale Cloud Run services
gcloud run services update linkcab-backend \
  --max-instances=10 \
  --cpu=2 \
  --memory=4Gi
```

### 2. Database Scaling

```bash
# Upgrade Cloud SQL instance
gcloud sql instances patch linkcab-db \
  --tier=db-custom-4-16
```

### 3. Load Balancing

```bash
# Create load balancer
gcloud compute backend-services create linkcab-backend \
  --global \
  --load-balancing-scheme=EXTERNAL_MANAGED
```

## 🔄 Backup and Recovery

### 1. Automated Backups

```bash
# Enable automated backups
gcloud sql instances patch linkcab-db \
  --backup-start-time=02:00 \
  --backup-retention-days=7
```

### 2. Manual Backups

```bash
# Create manual backup
gcloud sql export sql linkcab-db gs://your-bucket/backup-$(date +%Y%m%d).sql \
  --database=linkcab
```

### 3. Disaster Recovery

```bash
# Restore from backup
gcloud sql import sql linkcab-db gs://your-bucket/backup-20231201.sql \
  --database=linkcab
```

## 📞 Support

For deployment issues:

1. Check the logs: `docker-compose logs` or `gcloud logs read`
2. Verify environment variables
3. Test database connectivity
4. Check network connectivity
5. Review security group settings

## 🎯 Next Steps

After successful deployment:

1. Set up monitoring and alerting
2. Configure automated backups
3. Set up CI/CD pipeline
4. Implement load testing
5. Plan for scaling
6. Set up SSL certificates
7. Configure custom domain
8. Set up analytics tracking

---

**Note**: This guide assumes you have the necessary permissions and access to the Google Cloud Platform. Adjust the commands and configurations according to your specific setup and requirements.
