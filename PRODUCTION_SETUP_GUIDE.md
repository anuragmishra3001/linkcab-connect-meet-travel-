# 🚀 LinkCab Production Setup Guide

This guide will help you set up your LinkCab backend and database for production deployment.

## 📋 Prerequisites

- Google Cloud Platform account
- Google Cloud SDK installed
- Docker installed
- Node.js 18+ installed
- Git installed

## 🎯 Quick Start (Automated)

### Option 1: Automated Setup (Windows)
```bash
# 1. Setup Cloud SQL Database
setup-cloud-sql.bat

# 2. Deploy Backend to Production
deploy-production.bat
```

### Option 2: Automated Setup (Linux/Mac)
```bash
# 1. Setup Cloud SQL Database
chmod +x setup-cloud-sql.sh
./setup-cloud-sql.sh

# 2. Deploy Backend to Production
chmod +x deploy-production.sh
./deploy-production.sh
```

## 🔧 Manual Setup (Step-by-Step)

### Step 1: Google Cloud Project Setup

1. **Install Google Cloud SDK**
   ```bash
   # Download from: https://cloud.google.com/sdk/docs/install
   # For Windows: https://cloud.google.com/sdk/docs/install#windows
   ```

2. **Login and Create Project**
   ```bash
   gcloud auth login
   gcloud projects create linkcab-production --name="LinkCab Production"
   gcloud config set project linkcab-production
   ```

3. **Enable Required APIs**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable sqladmin.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

### Step 2: Cloud SQL Database Setup

1. **Create Cloud SQL Instance**
   ```bash
   gcloud sql instances create linkcab-db \
     --database-version=MYSQL_8_0 \
     --tier=db-f1-micro \
     --region=us-central1 \
     --root-password=YourStrongPassword123! \
     --storage-type=SSD \
     --storage-size=10GB \
     --backup-start-time=02:00 \
     --backup-retention-days=7
   ```

2. **Create Database**
   ```bash
   gcloud sql databases create linkcab --instance=linkcab-db
   ```

3. **Create Application User**
   ```bash
   gcloud sql users create linkcab_user \
     --instance=linkcab-db \
     --password=YourStrongPassword123!
   ```

4. **Get Connection Details**
   ```bash
   gcloud sql instances describe linkcab-db --format="value(connectionName)"
   ```

### Step 3: Backend Environment Configuration

1. **Create Production Environment File**
   ```bash
   cp backend/env.production.example backend/.env
   ```

2. **Update Environment Variables**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=production
   
   # Cloud SQL Configuration
   DB_HOST=/cloudsql/linkcab-production:us-central1:linkcab-db
   DB_PORT=3306
   DB_NAME=linkcab
   DB_USER=linkcab_user
   DB_PASSWORD=YourStrongPassword123!
   DB_SSL=true
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   
   # Frontend URL
   FRONTEND_URL=https://your-domain.com
   ```

### Step 4: Database Migration and Seeding

1. **Run Database Migrations**
   ```bash
   npm run db:migrate
   ```

2. **Seed Database with Initial Data**
   ```bash
   npm run db:seed
   ```

### Step 5: Backend Deployment

1. **Configure Docker for Google Container Registry**
   ```bash
   gcloud auth configure-docker
   ```

2. **Build and Push Docker Image**
   ```bash
   cd backend
   docker build -t gcr.io/linkcab-production/linkcab-backend:latest .
   docker push gcr.io/linkcab-production/linkcab-backend:latest
   cd ..
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy linkcab-backend \
     --image gcr.io/linkcab-production/linkcab-backend:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 5000 \
     --memory 1Gi \
     --cpu 1 \
     --max-instances 10 \
     --set-env-vars "NODE_ENV=production" \
     --set-env-vars "DB_HOST=/cloudsql/linkcab-production:us-central1:linkcab-db" \
     --set-env-vars "DB_NAME=linkcab" \
     --set-env-vars "DB_USER=linkcab_user" \
     --set-env-vars "DB_PASSWORD=YourStrongPassword123!" \
     --set-env-vars "DB_SSL=true" \
     --set-env-vars "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" \
     --add-cloudsql-instances linkcab-production:us-central1:linkcab-db
   ```

4. **Get Service URL**
   ```bash
   gcloud run services describe linkcab-backend \
     --region=us-central1 \
     --format="value(status.url)"
   ```

## 🔒 Security Configuration

### 1. Generate Strong JWT Secret
```bash
# Generate a strong random secret
openssl rand -base64 32
```

### 2. Update Database Password
```bash
# Change the database password
gcloud sql users set-password linkcab_user \
  --instance=linkcab-db \
  --password=NewStrongPassword456!
```

### 3. Configure CORS
Update your backend CORS configuration to only allow your frontend domain:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## 🌐 Frontend Configuration

1. **Update Frontend Environment**
   ```env
   VITE_API_URL=https://your-backend-url.run.app/api
   VITE_DEV_MODE=false
   ```

2. **Deploy Frontend**
   ```bash
   # Deploy to Vercel
   npm run deploy:vercel
   
   # Or deploy to your preferred platform
   ```

## 📊 Monitoring and Logging

### 1. View Application Logs
```bash
gcloud logs read "resource.type=cloud_run_revision" --limit=50
```

### 2. Monitor Database
```bash
gcloud sql instances describe linkcab-db
```

### 3. Health Check
```bash
curl https://your-backend-url.run.app/api/health
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
          ./deploy-production.sh
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check if Cloud SQL instance is running
   gcloud sql instances describe linkcab-db
   
   # Test connection
   gcloud sql connect linkcab-db --user=linkcab_user
   ```

2. **Docker Build Failed**
   ```bash
   # Check Docker is running
   docker --version
   
   # Clean up Docker
   docker system prune -a
   ```

3. **Cloud Run Deployment Failed**
   ```bash
   # Check logs
   gcloud logs read "resource.type=cloud_run_revision" --limit=10
   
   # Verify environment variables
   gcloud run services describe linkcab-backend --region=us-central1
   ```

### Performance Optimization

1. **Database Optimization**
   ```sql
   -- Add indexes for better performance
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_rides_status ON rides(status);
   CREATE INDEX idx_payments_user ON payments(userId);
   ```

2. **Application Optimization**
   ```bash
   # Enable gzip compression
   # Configure Redis for session storage
   # Set up CDN for static assets
   ```

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale Cloud Run service
gcloud run services update linkcab-backend \
  --max-instances=20 \
  --cpu=2 \
  --memory=4Gi \
  --region=us-central1
```

### Database Scaling
```bash
# Upgrade Cloud SQL instance
gcloud sql instances patch linkcab-db \
  --tier=db-custom-2-8 \
  --region=us-central1
```

## 🔄 Backup and Recovery

### Automated Backups
```bash
# Enable automated backups
gcloud sql instances patch linkcab-db \
  --backup-start-time=02:00 \
  --backup-retention-days=7
```

### Manual Backups
```bash
# Create manual backup
gcloud sql export sql linkcab-db \
  gs://your-bucket/backup-$(date +%Y%m%d).sql \
  --database=linkcab
```

## 📞 Support

For deployment issues:
1. Check the logs: `gcloud logs read`
2. Verify environment variables
3. Test database connectivity
4. Check network connectivity
5. Review security group settings

---

**Note**: This guide assumes you have the necessary permissions and access to Google Cloud Platform. Adjust the commands and configurations according to your specific setup and requirements.
