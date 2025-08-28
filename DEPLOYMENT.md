# Deployment Guide for LinkCab

This guide will walk you through deploying the LinkCab application to GitHub and Vercel.

## GitHub Deployment

### 1. Initialize Git Repository (Already Done)

```bash
git init
```

### 2. Add Files to Git

```bash
# Add all files to git
git add .

# Commit the changes
git commit -m "Initial commit"
```

### 3. Create a GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in to your account
2. Click on the '+' icon in the top-right corner and select 'New repository'
3. Enter a repository name (e.g., 'linkcab')
4. Choose whether to make it public or private
5. Do NOT initialize with README, .gitignore, or license as we already have these files
6. Click 'Create repository'

### 4. Link Local Repository to GitHub

After creating the repository, GitHub will show commands to push an existing repository. Run the following commands in your terminal:

```bash
# Add the remote repository URL
git remote add origin https://github.com/YOUR_USERNAME/linkcab.git

# Push the code to GitHub
git push -u origin main
```

Note: If your default branch is named 'master' instead of 'main', use:

```bash
git push -u origin master
```

## Vercel Deployment

### 1. Prepare for Deployment

Before deploying to Vercel, make sure your project is properly structured:

- Frontend (React) is in the root directory
- Backend (Node.js) is in the `/backend` directory

### 2. Create a Vercel Account

1. Go to [Vercel](https://vercel.com/) and sign up for an account
2. You can sign up using your GitHub account for easier integration

### 3. Deploy Frontend to Vercel

1. From the Vercel dashboard, click 'Add New...'
2. Select 'Project'
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: dist
   - Install Command: npm install
5. Add environment variables if needed
6. Click 'Deploy'

### 4. Deploy Backend to Vercel

For the backend, you have two options:

#### Option 1: Deploy as a Separate Vercel Project

1. From the Vercel dashboard, click 'Add New...'
2. Select 'Project'
3. Import the same GitHub repository
4. Configure the project:
   - Root Directory: backend
   - Build Command: npm install
   - Output Directory: (leave empty)
   - Install Command: npm install
5. Add all required environment variables from your `.env` file
6. Click 'Deploy'

#### Option 2: Use a Serverless Function Approach

Alternatively, you can adapt your backend to use Vercel's serverless functions:

1. Create a `/api` directory in your project root
2. Move your Express routes to serverless functions
3. Update your frontend API calls to point to these functions

### 5. Connect Frontend and Backend

1. After deploying both frontend and backend, get the deployment URLs from Vercel
2. Update your frontend API base URL to point to your deployed backend
3. Update CORS settings in your backend to allow requests from your frontend URL

### 6. Set Up MongoDB Atlas (Cloud Database)

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster (the free tier is sufficient for starting)
3. Set up database access (username and password)
4. Set up network access (IP whitelist)
5. Get your connection string
6. Add the connection string to your backend environment variables in Vercel

## Continuous Deployment

With GitHub and Vercel connected, any changes pushed to your GitHub repository will automatically trigger a new deployment on Vercel.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend has proper CORS configuration to allow requests from your frontend domain
2. **Environment Variables**: Make sure all required environment variables are set in Vercel
3. **Build Failures**: Check the build logs in Vercel for any errors
4. **API Connection Issues**: Verify that your frontend is using the correct backend URL

### Vercel Logs

To debug issues:

1. Go to your Vercel dashboard
2. Select your project
3. Click on 'Deployments'
4. Select the deployment you want to inspect
5. Click on 'Functions' to see logs for your serverless functions

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Documentation](https://docs.github.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)