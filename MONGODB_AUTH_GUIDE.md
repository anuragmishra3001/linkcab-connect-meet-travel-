# MongoDB Authentication Troubleshooting Guide

## Authentication Error

If you're seeing the error `bad auth : authentication failed` when trying to connect to MongoDB Atlas, follow these steps to resolve it:

## 1. Verify Your MongoDB Atlas Credentials

### Check Username and Password
- Confirm that the username `anuragmishra3001` exists in your MongoDB Atlas Database Access section
- Verify that the password is exactly what you think it is
- Remember that passwords are case-sensitive

### Special Characters in Password
- If your password contains special characters like `@`, they need to be URL-encoded
- For example, `@` should be encoded as `%40`
- However, some MongoDB drivers handle this automatically, while others don't

## 2. Create a New Database User

If you continue to have issues, try creating a new database user:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your project
3. Go to Database Access under Security
4. Click "Add New Database User"
5. Create a user with a simple password (avoid special characters)
6. Give appropriate permissions (readWrite on your database)
7. Update your `.env` file with the new credentials

## 3. Check Network Access

- Ensure your IP address is whitelisted in MongoDB Atlas
- Go to Network Access under Security in MongoDB Atlas
- Add your current IP address or use `0.0.0.0/0` to allow access from anywhere (not recommended for production)

## 4. Verify Connection String Format

The correct format for MongoDB Atlas connection string is:
```
mongodb+srv://<username>:<password>@<cluster-name>.<subdomain>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

## 5. Temporary Local MongoDB Solution

If you need to test your application while resolving Atlas authentication issues:

1. Install MongoDB locally if not already installed
2. Start the MongoDB service
3. Use this connection string in your `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/linkcab
   ```
4. This will connect to a local MongoDB instance instead of Atlas

## 6. Check MongoDB Atlas Status

Verify that MongoDB Atlas is operational by checking their [status page](https://status.mongodb.com/).

## 7. Contact MongoDB Support

If all else fails, contact [MongoDB Support](https://support.mongodb.com/) with details about your issue.