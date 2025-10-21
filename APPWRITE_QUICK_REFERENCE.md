# Appwrite Quick Reference for LiveCV

## 📋 Required Environment Variables Checklist

### Frontend (client/.env)
```bash
✅ VITE_APPWRITE_ENDPOINT          # Always: https://cloud.appwrite.io/v1
✅ VITE_APPWRITE_PROJECT_ID        # From: Appwrite Console → Project Settings
✅ VITE_APPWRITE_DATABASE_ID       # Use: livecv-production
```

### Backend (server/.env)
```bash
✅ APPWRITE_ENDPOINT               # Always: https://cloud.appwrite.io/v1
✅ APPWRITE_PROJECT_ID             # Same as frontend
✅ APPWRITE_API_KEY                # From: Appwrite Console → Settings → API Keys
✅ APPWRITE_DATABASE_ID            # Use: livecv-production
✅ APPWRITE_COLLECTION_RESUMES     # Use: resumes
✅ APPWRITE_COLLECTION_USERS       # Use: users
✅ APPWRITE_BUCKET_PDFS            # Use: resume-pdfs
✅ APPWRITE_BUCKET_YAMLS           # Use: resume-yamls
```

---

## 🎯 What Appwrite Does in Your App

### ✅ Authentication
- Email/Password login & signup
- Google OAuth ("Continue with Google")
- GitHub OAuth ("Continue with GitHub")
- Session management
- User profile data

### ✅ Database (Resume Metadata)
- Store resume information (name, theme, dates)
- Track user's resumes
- Query and list user resumes
- Update/delete resume records

### ✅ Storage (Files)
- **PDF Bucket**: Store generated resume PDFs
- **YAML Bucket**: Store RenderCV YAML files
- File upload/download
- File permissions per user

---

## 🚀 Quick Setup (3 Steps)

### 1. Create Appwrite Project
1. Go to https://cloud.appwrite.io
2. Create account → Create project
3. **Copy Project ID** → paste in both `.env` files

### 2. Create API Key (Backend only)
1. Project → Settings → API Keys
2. Create key with `databases.*`, `storage.*`, `users.*` scopes
3. **Copy API Key** → paste in server `.env`

### 3. Create Database & Collections
```
Database: livecv-production
  ├── Collection: resumes (with attributes from guide)
  └── Collection: users (optional)

Storage:
  ├── Bucket: resume-pdfs (PDF files)
  └── Bucket: resume-yamls (YAML files)
```

---

## 📊 Database Schema

### Collection: `resumes`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | String | Yes | Owner of the resume |
| `name` | String | Yes | Resume title |
| `theme` | String | No | RenderCV theme (classic, etc.) |
| `yamlContent` | String | No | YAML data |
| `lastPdfUrl` | String | No | URL to generated PDF |
| `lastPdfFileSize` | Integer | No | PDF size in bytes |
| `contentHash` | String | No | Hash for change detection |
| `createdAt` | String | Yes | Creation timestamp |
| `updatedAt` | String | Yes | Last update timestamp |

**Indexes:**
- `userId` (for fast queries)

**Permissions:**
- Read: Any or User-specific
- Create/Update/Delete: Users only

---

## 🔐 OAuth Setup Quick Links

### Google OAuth
1. https://console.cloud.google.com
2. Create OAuth 2.0 credentials
3. Callback URL: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/{PROJECT_ID}`

### GitHub OAuth
1. https://github.com/settings/developers
2. New OAuth App
3. Callback URL: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/{PROJECT_ID}`

---

## ✅ Backend Usage Verification

Your backend **correctly** uses Appwrite for:
- ✅ Resume metadata storage (database)
- ✅ PDF file uploads (storage)
- ✅ YAML file uploads (storage)
- ✅ File downloads and deletions
- ✅ User resume listings

Your backend **does NOT** use Appwrite for:
- ❌ Authentication (handled by frontend)
- ❌ Session management (handled by frontend)
- ❌ PDF generation (uses RenderCV locally)
- ❌ ATS analysis (uses OpenAI)
- ❌ Any other logic

**This is correct and optimal!** 🎉

---

## 🧪 Test Your Setup

### Test 1: Backend Connection
```bash
cd server
node -e "const {validateConnection} = require('./config/appwrite'); validateConnection();"
```
Expected: `[Appwrite] Connection validated successfully`

### Test 2: Frontend Auth
1. Start app: `npm run dev`
2. Try to login/signup
3. Check browser console for errors
4. Look for red debug panel (shows auth state)

### Test 3: Create Resume
1. Login to app
2. Create a resume
3. Check Appwrite Console → Database → resumes collection
4. Should see new document

### Test 4: File Upload
1. Generate PDF from resume
2. Check Appwrite Console → Storage → resume-pdfs bucket
3. Should see uploaded PDF

---

## 🐛 Common Issues & Fixes

### Issue: "Appwrite is not configured"
**Fix:** Check all env variables are set and server is restarted

### Issue: "Invalid API Key"
**Fix:** Regenerate API key with correct scopes (databases.*, storage.*, users.*)

### Issue: "Collection not found"
**Fix:** Verify collection ID is exactly `resumes` (case-sensitive)

### Issue: "Permission denied"
**Fix:** Check collection/bucket permissions allow user access

### Issue: OAuth not working
**Fix:** Verify callback URLs match exactly with provider settings

---

## 📚 Documentation Links

- **Appwrite Docs**: https://appwrite.io/docs
- **Auth Guide**: https://appwrite.io/docs/authentication
- **Database Guide**: https://appwrite.io/docs/databases
- **Storage Guide**: https://appwrite.io/docs/storage
- **OAuth Setup**: https://appwrite.io/docs/authentication-oauth2

---

## 💾 Copy-Paste Ready Config

### Frontend .env
```env
VITE_API_URL=http://localhost:5001
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=YOUR_PROJECT_ID
VITE_APPWRITE_DATABASE_ID=livecv-production
```

### Backend .env
```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=YOUR_PROJECT_ID
APPWRITE_API_KEY=YOUR_API_KEY
APPWRITE_DATABASE_ID=livecv-production
APPWRITE_COLLECTION_RESUMES=resumes
APPWRITE_COLLECTION_USERS=users
APPWRITE_BUCKET_PDFS=resume-pdfs
APPWRITE_BUCKET_YAMLS=resume-yamls
```

Replace `YOUR_PROJECT_ID` and `YOUR_API_KEY` with actual values!

---

**Need the detailed guide?** See `APPWRITE_SETUP_GUIDE.md`
