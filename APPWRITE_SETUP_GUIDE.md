# Appwrite Setup Guide for LiveCV

## Overview

Your LiveCV application uses **Appwrite** for:
1. ✅ **User Authentication** (Email/Password, Google OAuth, GitHub OAuth)
2. ✅ **User Data Storage** (Database)
3. ✅ **Resume Storage** (Database metadata + File storage)
4. ✅ **PDF/YAML File Storage** (Storage buckets)

---

## Required Environment Variables

### **Frontend (.env in `/client`)**

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=livecv-production
```

### **Backend (.env in `/server`)**

```env
# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_API_KEY=your_api_key_here
APPWRITE_DATABASE_ID=livecv-production

# Collections
APPWRITE_COLLECTION_RESUMES=resumes
APPWRITE_COLLECTION_USERS=users

# Storage Buckets
APPWRITE_BUCKET_PDFS=resume-pdfs
APPWRITE_BUCKET_YAMLS=resume-yamls
```

---

## Step-by-Step Setup on Appwrite Platform

### **Step 1: Create Appwrite Account**

1. Go to https://cloud.appwrite.io
2. Sign up for a free account
3. Verify your email

### **Step 2: Create a New Project**

1. Click **"Create Project"**
2. Enter project name: `LiveCV` or any name you prefer
3. Click **"Create"**
4. **Copy the Project ID** - you'll need this for `APPWRITE_PROJECT_ID`

### **Step 3: Get API Key (Backend Only)**

1. In your project, go to **"Settings"** (left sidebar)
2. Click **"API Keys"** tab
3. Click **"Create API Key"**
4. Configure the API key:
   - **Name**: `LiveCV Backend`
   - **Expiration**: Never (or set as needed)
   - **Scopes**: Select these:
     - ✅ `databases.*` (all database permissions)
     - ✅ `storage.*` (all storage permissions)
     - ✅ `users.*` (all user management permissions)
5. Click **"Create"**
6. **Copy the API Key** immediately - you won't see it again!
7. This is your `APPWRITE_API_KEY`

### **Step 4: Create Database**

1. Go to **"Databases"** in left sidebar
2. Click **"Create Database"**
3. **Database Name**: `livecv-production`
4. **Database ID**: `livecv-production` (must match your env variable)
5. Click **"Create"**

### **Step 5: Create Collections**

#### Collection 1: Resumes

1. Inside your database, click **"Create Collection"**
2. **Collection Name**: `Resumes`
3. **Collection ID**: `resumes` (must match exactly)
4. Click **"Create"**

5. **Add Attributes** (click "Create Attribute" for each):

   | Attribute Key | Type | Size | Required | Default | Array |
   |---------------|------|------|----------|---------|-------|
   | `userId` | String | 255 | Yes | - | No |
   | `name` | String | 255 | Yes | - | No |
   | `theme` | String | 100 | No | `classic` | No |
   | `yamlContent` | String | 100000 | No | - | No |
   | `lastPdfUrl` | String | 500 | No | - | No |
   | `lastPdfFileSize` | Integer | - | No | `0` | No |
   | `contentHash` | String | 255 | No | - | No |
   | `createdAt` | String | 50 | Yes | - | No |
   | `updatedAt` | String | 50 | Yes | - | No |

6. **Set Permissions**:
   - Go to **"Settings"** tab in collection
   - Scroll to **"Permissions"**
   - Add these permissions:
     - **Read**: `Any` (or `User:{userId}` for privacy)
     - **Create**: `Users`
     - **Update**: `Users`
     - **Delete**: `Users`

7. **Create Indexes** (optional but recommended):
   - Click **"Indexes"** tab
   - Create index:
     - **Key**: `userId_index`
     - **Type**: `Key`
     - **Attributes**: `userId`
     - **Order**: `ASC`

#### Collection 2: Users (Optional - if you want custom user data)

1. Click **"Create Collection"**
2. **Collection Name**: `Users`
3. **Collection ID**: `users`
4. Add attributes as needed for additional user profile data

### **Step 6: Create Storage Buckets**

#### Bucket 1: Resume PDFs

1. Go to **"Storage"** in left sidebar
2. Click **"Create Bucket"**
3. Configuration:
   - **Name**: `Resume PDFs`
   - **Bucket ID**: `resume-pdfs` (must match exactly)
   - **File Security**: Enabled (recommended)
   - **Max File Size**: `10MB` (or as needed)
   - **Allowed File Extensions**: `pdf`
   - **Compression**: `none`
   - **Encryption**: Enabled (recommended)
   - **Antivirus**: Enabled (recommended)
4. Click **"Create"**

5. **Set Bucket Permissions**:
   - In bucket settings → **"Permissions"**
   - Add:
     - **Read**: `Any` (or `User:{userId}` for privacy)
     - **Create**: `Users`
     - **Update**: `Users`
     - **Delete**: `Users`

#### Bucket 2: Resume YAML Files

1. Click **"Create Bucket"**
2. Configuration:
   - **Name**: `Resume YAMLs`
   - **Bucket ID**: `resume-yamls` (must match exactly)
   - **File Security**: Enabled
   - **Max File Size**: `5MB`
   - **Allowed File Extensions**: `yaml,yml`
   - **Compression**: `gzip` (optional)
3. Set same permissions as PDF bucket

### **Step 7: Setup OAuth (Google & GitHub)**

#### Enable Google OAuth

1. Go to **"Auth"** in left sidebar
2. Click **"Settings"** tab
3. Scroll to **"OAuth2 Providers"**
4. Find **"Google"** and toggle it ON
5. You need to configure:
   - **App ID**: Get from [Google Cloud Console](https://console.cloud.google.com)
   - **App Secret**: Get from Google Cloud Console

**Getting Google OAuth Credentials:**
1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Go to **"APIs & Services"** → **"Credentials"**
4. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
5. Choose **"Web application"**
6. Add **Authorized redirect URIs**:
   ```
   https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/{PROJECT_ID}
   ```
   Replace `{PROJECT_ID}` with your Appwrite project ID
7. Copy **Client ID** and **Client Secret**
8. Paste them in Appwrite Google OAuth settings

#### Enable GitHub OAuth

1. In Appwrite **"Auth"** → **"Settings"**
2. Find **"GitHub"** and toggle it ON
3. You need:
   - **App ID**: Get from GitHub
   - **App Secret**: Get from GitHub

**Getting GitHub OAuth Credentials:**
1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `LiveCV`
   - **Homepage URL**: `https://your-app-url.com`
   - **Authorization callback URL**:
     ```
     https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/{PROJECT_ID}
     ```
     Replace `{PROJECT_ID}` with your Appwrite project ID
4. Click **"Register application"**
5. Copy **Client ID** and **Client Secret**
6. Paste them in Appwrite GitHub OAuth settings

### **Step 8: Configure Authentication Settings**

1. Go to **"Auth"** → **"Settings"**
2. Configure:
   - **Session Length**: `31536000` seconds (1 year) or as needed
   - **Password History**: `0` (or as needed)
   - **Password Dictionary**: Enabled (recommended)
   - **Personal Data**: Enabled (recommended)
   - **Email Verification**: Optional (recommended for production)

---

## Environment File Templates

### Frontend `.env` File

Create `/client/.env`:

```env
# API Configuration
VITE_API_URL=http://localhost:5001

# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=paste_your_project_id_here
VITE_APPWRITE_DATABASE_ID=livecv-production
```

### Backend `.env` File

Create `/server/.env`:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000

# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=paste_your_project_id_here
APPWRITE_API_KEY=paste_your_api_key_here
APPWRITE_DATABASE_ID=livecv-production

# Collections
APPWRITE_COLLECTION_RESUMES=resumes
APPWRITE_COLLECTION_USERS=users

# Storage Buckets
APPWRITE_BUCKET_PDFS=resume-pdfs
APPWRITE_BUCKET_YAMLS=resume-yamls

# Optional: OpenAI for AI features
OPENAI_API_KEY=your_openai_key_if_needed
```

---

## What Each Service Does

### Backend Appwrite Usage

✅ **User Management**: Backend doesn't manage users directly - handled by Appwrite Auth
✅ **Resume Storage**: Saves resume metadata to database
✅ **File Upload**: Uploads PDF and YAML files to storage buckets
✅ **Resume Retrieval**: Fetches user's resumes from database
✅ **File Management**: Downloads/deletes files from storage

### Frontend Appwrite Usage

✅ **Authentication**: Login, signup, OAuth (Google/GitHub)
✅ **Session Management**: Maintains user sessions
✅ **User Profile**: Gets current user data
✅ **Direct Database Access**: Can query user's resumes directly (optional)

---

## Testing Your Setup

### 1. Test Backend Connection

```bash
cd server
node -e "const {validateConnection} = require('./config/appwrite'); validateConnection();"
```

Should output: `[Appwrite] Connection validated successfully`

### 2. Test Frontend

1. Start your app: `npm run dev`
2. Open browser console (F12)
3. Check for Appwrite connection errors
4. Try logging in/signing up

### 3. Check Debug Panel

- Red debug panel in bottom-right shows auth state
- Should show `Authenticated: No` initially
- After login: `Authenticated: Yes` with user email

---

## Security Best Practices

1. ✅ **Never commit `.env` files** to git
2. ✅ **Use different projects** for development and production
3. ✅ **Rotate API keys** periodically
4. ✅ **Enable 2FA** on your Appwrite account
5. ✅ **Set proper permissions** on collections and buckets
6. ✅ **Use file security** on storage buckets
7. ✅ **Enable email verification** in production

---

## Summary of IDs You Need

| Variable | Where to Get It | Example |
|----------|----------------|---------|
| `APPWRITE_PROJECT_ID` | Project Settings | `652abc123def456` |
| `APPWRITE_API_KEY` | Project → Settings → API Keys | `standard_abc123...` |
| `APPWRITE_ENDPOINT` | Always use | `https://cloud.appwrite.io/v1` |
| `APPWRITE_DATABASE_ID` | Database you created | `livecv-production` |
| Collection IDs | Must match exactly | `resumes`, `users` |
| Bucket IDs | Must match exactly | `resume-pdfs`, `resume-yamls` |

---

## Troubleshooting

### "Appwrite is not configured" Error
- Check all env variables are set
- Restart your server after changing .env
- Verify Project ID is correct

### "Invalid API Key" Error
- Regenerate API key with correct scopes
- Ensure API key hasn't expired
- Check for trailing spaces in .env

### OAuth Not Working
- Verify callback URLs match exactly
- Check OAuth provider credentials
- Ensure OAuth is enabled in Appwrite

### Can't Upload Files
- Check bucket permissions
- Verify bucket IDs match exactly
- Check file size limits
- Verify file extensions are allowed

---

## Need Help?

- **Appwrite Docs**: https://appwrite.io/docs
- **Appwrite Discord**: https://appwrite.io/discord
- **Console**: https://cloud.appwrite.io

Your backend is correctly set up to use Appwrite **only** for user authentication, resume storage, and file management - nothing else! 🎉
