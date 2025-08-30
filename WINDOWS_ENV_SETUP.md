# 🪟 Windows Environment Setup - Fixed Commands

## 🔧 Windows PowerShell/Command Prompt Fix

The `&` characters in MongoDB URI need special handling in Windows. Here are the corrected commands:

### **Option 1: PowerShell (Recommended)**

Open PowerShell in your project folder and run:

```powershell
cd backend
@"
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://narmadamart_db_user:anurag@cluster0.aesghjx.mongodb.net/linkcab?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=LinkCab_Super_Secret_JWT_Key_2024!
JWT_EXPIRE=7d
OTP_SECRET=LinkCab_OTP_Secret_Key_12345
OTP_EXPIRE=300000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
FRONTEND_URL=http://localhost:5173
"@ | Out-File -FilePath ".env" -Encoding utf8
```

### **Option 2: Manual Creation (Easiest)**

1. **Open your project in VS Code or any text editor**
2. **Navigate to the `backend` folder**
3. **Right-click → New File**
4. **Name it `.env` (including the dot)**
5. **Copy and paste this content:**

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://narmadamart_db_user:anurag@cluster0.aesghjx.mongodb.net/linkcab?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=LinkCab_Super_Secret_JWT_Key_2024!
JWT_EXPIRE=7d
OTP_SECRET=LinkCab_OTP_Secret_Key_12345
OTP_EXPIRE=300000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
FRONTEND_URL=http://localhost:5173
```

6. **Save the file**

### **Option 3: Using Notepad**

1. **Open Notepad**
2. **Copy and paste the environment variables above**
3. **Save As → Navigate to your `backend` folder**
4. **File name: `.env`**
5. **Save as type: All Files (*.*)**
6. **Encoding: UTF-8**
7. **Click Save**

## ✅ **Verify Your .env File**

After creating the file, check that it exists:

```powershell
cd backend
dir .env
```

You should see the `.env` file listed.

## 🚀 **Test Your Setup**

```powershell
cd backend
npm install
npm start
```

**Expected Output:**
```
📦 MongoDB Connected: cluster0.aesghjx.mongodb.net
🚀 LinkCab API server running on port 5000
✅ All API routes loaded successfully
```

## 🔍 **If You Still Have Issues:**

### Check if .env file was created correctly:
```powershell
cd backend
type .env
```

This should display your environment variables.

### Manual verification:
Open the `.env` file in VS Code and make sure it contains:
- No extra quotes around values
- No spaces around the `=` signs
- The MongoDB URI on one line without line breaks

## 📁 **Your Backend Folder Should Now Have:**

```
backend/
├── .env          ← Your new environment file
├── package.json
├── server.js
├── config/
├── models/
├── routes/
└── ...
```

## 🎯 **Ready to Test!**

Once your `.env` file is created with the correct content, run:

```powershell
cd backend
npm start
```

If you see the MongoDB connection message, you're all set! 🎉

## 🚀 **Next Steps After Success:**

1. ✅ **Environment variables working locally**
2. ⏭️ **Deploy to Railway with same variables**
3. ⏭️ **Deploy frontend to Vercel**
4. ⏭️ **Go live!**

The manual creation method (Option 2) is usually the most reliable on Windows! 💻
