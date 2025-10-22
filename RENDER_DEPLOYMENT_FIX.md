# 🚨 FIX RENDER DEPLOYMENT ERROR - "Cannot find module 'express'"

## The Problem
Render isn't finding your dependencies because it's not looking in the correct directory or not installing them.

## ✅ SOLUTION - Render Configuration

### Step 1: Go to Your Render Dashboard
1. Log in to https://dashboard.render.com
2. Find your service (livecv-server)
3. Click on it

### Step 2: Update Settings
Click on **"Settings"** tab and configure these **EXACTLY**:

#### Build & Deploy Settings:
```
Root Directory: server
Build Command: npm install
Start Command: npm start
```

⚠️ **CRITICAL**: The `Root Directory` must be set to `server` because your package.json is in the `server` folder!

### Step 3: Environment Variables
Make sure these are set in Render:

```bash
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.netlify.app
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
APPWRITE_DATABASE_ID=livecv-production
SESSION_SECRET=your_secure_session_secret
MONGODB_URI=your_mongodb_connection_string
```

### Step 4: Deploy
1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. OR push to your repository to trigger auto-deploy

### Step 5: Check Logs
After deployment starts:
1. Go to **"Logs"** tab
2. Watch for errors
3. It should show "npm install" running successfully

---

## Alternative: If Still Failing

### Option A: Add render.yaml file

Create `/render.yaml` in your root directory:

```yaml
services:
  - type: web
    name: livecv-server
    env: node
    region: oregon
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5001
```

### Option B: Move package.json to root

If you can't set root directory, create a package.json in your root with:

```json
{
  "name": "livecv-root",
  "version": "1.0.0",
  "scripts": {
    "start": "cd server && npm start",
    "build": "cd server && npm install"
  }
}
```

---

## Common Render Issues

### Issue: "Module not found" after successful install
**Fix**: Clear build cache
- Settings → "Clear Build Cache"
- Then click "Manual Deploy"

### Issue: Wrong Node version
**Fix**: Add to package.json engines:
```json
"engines": {
  "node": "18.x"
}
```

### Issue: Memory limit during install
**Fix**: Upgrade to paid plan or reduce dependencies
