# Vercel Deployment Troubleshooting Guide

## Common White Screen Issues

### 1. Routing Configuration

The most common cause of a white screen in Vercel deployments is incorrect routing configuration. We've updated your `vercel.json` file to fix potential routing issues:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2. Environment Variables

Make sure all required environment variables are set in your Vercel project settings:

1. Go to your Vercel dashboard
2. Select your project
3. Click on "Settings" > "Environment Variables"
4. Add the following variables:
   - `VITE_API_URL`: Your deployed API URL (e.g., https://your-app-name.vercel.app/api)
   - `VITE_APP_SOCKET_URL`: Your deployed socket URL (e.g., https://your-app-name.vercel.app)
   - All backend environment variables from your `backend/.env` file

### 3. API Connection Issues

If your frontend can't connect to your backend, check:

1. CORS configuration in your backend
2. Correct API URL in your frontend
3. Network requests in browser developer tools

### 4. Build Issues

To rebuild your project with the updated configuration:

```bash
node redeploy.js
```

Then push the changes to GitHub or manually redeploy from the Vercel dashboard.

### 5. Debugging Steps

1. **Check Vercel Logs**:
   - Go to your Vercel dashboard
   - Select your project
   - Click on "Deployments"
   - Select the latest deployment
   - Click on "Functions" to see logs

2. **Check Browser Console**:
   - Open your deployed site
   - Open browser developer tools (F12 or right-click > Inspect)
   - Go to the Console tab
   - Look for any errors

3. **Test API Endpoints**:
   - Use a tool like Postman to test your API endpoints
   - Ensure they're accessible from your deployed URL

### 6. Common Error Messages

- **404 Not Found**: Check your routing configuration
- **CORS Errors**: Update your backend CORS settings
- **Network Error**: Check API URL and network connectivity
- **Unauthorized**: Check authentication token handling

## After Deployment

After deploying, if you still see a white screen:

1. Clear your browser cache
2. Try opening the site in an incognito/private window
3. Try a different browser
4. Check if the issue persists on mobile devices

## Need More Help?

If you're still experiencing issues, check the [Vercel Documentation](https://vercel.com/docs) or contact Vercel support.