# 🚨 QUICK FIX FOR 400 BAD REQUEST ERROR

## The Problem
Your frontend (port 5172) is trying to connect directly to Appwrite, but Appwrite doesn't recognize your origin.

## ✅ SOLUTION (Do this NOW):

### 1. Go to Appwrite Console
Open: https://cloud.appwrite.io/console

### 2. Navigate to Your Project
Click on your project (the one with your PROJECT_ID)

### 3. Add Web Platform
**THIS IS THE CRITICAL STEP:**

1. Look for **"Platforms"** in the left sidebar (or at the bottom of Overview)
2. Click **"Add Platform"**
3. Select **"Web App"**
4. Fill in:
   - **Name**: `LiveCV Development`
   - **Hostname**: `localhost` (just localhost, no http:// or port)
5. Click **"Next"** or **"Create"**

### 4. Verify Platform is Added
You should see your platform listed with:
- Type: Web
- Hostname: localhost

### 5. Restart Your Frontend
```bash
# Stop your frontend (Ctrl+C)
# Then restart:
cd client
npm run dev
```

## Alternative: Use Wildcard for Development

If the above doesn't work, you can temporarily allow all origins:

1. In Appwrite Console → **Settings** → **Platforms**
2. Add a web platform with hostname: `*` (wildcard)
3. **⚠️ REMOVE THIS IN PRODUCTION!**

## Why This Happens

Appwrite uses a strict origin check. When your frontend at `http://localhost:5172` makes a request to Appwrite, Appwrite checks if `localhost` is in your registered platforms. If not → 400 Bad Request.

## After Adding Platform

The error should disappear immediately. If it doesn't:
1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check browser console for any other errors

---

**Still having issues?** Check that:
- Your `VITE_APPWRITE_PROJECT_ID` in client/.env matches your Appwrite project ID
- Your frontend is actually running on port 5172 (check the terminal)
