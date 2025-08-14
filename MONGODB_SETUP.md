# MongoDB Atlas Setup Guide

## Connection String

You've provided the following MongoDB Atlas connection string:

```
mongodb+srv://anuragmishra3002:<db_password>@cluster0.kkzllaj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Important:** Replace `<db_password>` with your actual MongoDB Atlas password.

## Configuration Steps

1. **Update your .env file**
   - I've updated your `backend/.env` file with this connection string
   - The password has been replaced with 'Anurag1729@'
   - I've also set `NODE_ENV=production` since you're using a production database

2. **Security Note**
   - The `.env` file is ignored by Git (in `.gitignore`)
   - This is a security best practice to prevent committing sensitive credentials
   - You'll need to manually set up the `.env` file on any new development environment

## Verifying the Connection

To test if your MongoDB connection is working:

1. Navigate to your backend directory:
   ```
   cd backend
   ```

2. Start the server:
   ```
   npm start
   ```

3. Check the console output for:
   ```
   📦 MongoDB Connected: cluster0.fevwsqd.mongodb.net
   ```

## Troubleshooting

If you encounter the "bad auth : authentication failed" error:

1. **Verify your MongoDB Atlas credentials**
   - Double-check that the username `anuragmishra3002` is correct
   - Replace `<db_password>` in the connection string with your actual MongoDB Atlas password
   - If your password contains special characters like `@`, URL-encode them (e.g., `@` becomes `%40`)
   - Try creating a new database user in MongoDB Atlas with a simple password (no special characters)

2. **Network Access**
   - Verify in MongoDB Atlas that your IP address is whitelisted
   - Or set Network Access to allow connections from anywhere (0.0.0.0/0)

3. **Database User**
   - Confirm the user `anuragmishra3002` has the correct permissions
   - The user should have at least read/write access to the database

## MongoDB Atlas Dashboard

You can manage your database through the MongoDB Atlas dashboard:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your project
3. Select "Cluster0" from the clusters list
4. Use the various tabs to manage your database, collections, and settings