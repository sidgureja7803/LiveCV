# 🚀 LiveCV - Complete Appwrite Migration Guide

## 📋 Overview

This guide covers the complete migration of LiveCV to use **Appwrite** as the primary backend for Authentication, Database, Storage, and all data persistence.

---

## 🌟 What's New

### ✅ **Appwrite Integration**
- **Authentication**: Replaced Clerk with Appwrite Auth
- **Database**: All resume data stored in Appwrite Database
- **Storage**: PDFs and YAML files stored in Appwrite Storage
- **Real-time**: Ready for Appwrite Realtime subscriptions

### ✅ **New Frontend Pages**
- **Landing Page** (`/`) - Marketing homepage
- **Login Page** (`/login`) - Appwrite authentication
- **Register Page** (`/register`) - User registration
- **Dashboard** (`/dashboard`) - Resume management with PDF modal viewer

### ✅ **PDF Modal Viewer**
- Full-screen PDF preview modal (like the popup in your image)
- Zoom controls (+/-)
- Download button
- Fullscreen mode
- Keyboard shortcuts (ESC to close)

### ✅ **Template Gallery**
- View all templates from `server/templates/` folder
- Preview PDFs in modal
- Download templates
- Shows all 5 RenderCV themes

---

## 🔐 Complete Environment Variables

### **Backend Environment Variables** (`server/.env`)

```bash
# =================================================================
# SERVER CONFIGURATION
# =================================================================
PORT=5001
NODE_ENV=production
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-session-secret-min-32-chars-change-this

# =================================================================
# APPWRITE CONFIGURATION (PRIMARY BACKEND)
# =================================================================
# Get these from: https://cloud.appwrite.io/console

APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id-here
APPWRITE_API_KEY=your-api-key-here

# Database Configuration
APPWRITE_DATABASE_ID=livecv-production

# Collections
APPWRITE_COLLECTION_USERS=users
APPWRITE_COLLECTION_RESUMES=resumes
APPWRITE_COLLECTION_TEMPLATES=templates
APPWRITE_COLLECTION_ATS_SCORES=ats_scores
APPWRITE_COLLECTION_JOB_MATCHES=job_matches

# Storage Buckets
APPWRITE_BUCKET_PDFS=resume-pdfs
APPWRITE_BUCKET_YAMLS=resume-yamls
APPWRITE_BUCKET_AVATARS=user-avatars
APPWRITE_BUCKET_TEMPLATES=template-files

# =================================================================
# MONGODB (Optional - for legacy data migration)
# =================================================================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/livecv

# =================================================================
# OPENAI API (For ATS Analysis & AI Features)
# =================================================================
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000

# =================================================================
# JWT (Legacy - if needed for migration)
# =================================================================
JWT_SECRET=your-jwt-secret-at-least-32-chars
JWT_EXPIRES_IN=90d

# =================================================================
# EMAIL CONFIGURATION (Optional)
# =================================================================
EMAIL_FROM=noreply@livecv.com
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# =================================================================
# CLOUDINARY (Optional - legacy image storage)
# =================================================================
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# =================================================================
# RENDERCV CONFIGURATION
# =================================================================
RENDERCV_TIMEOUT=30000
RENDERCV_CACHE_TTL=3600
RENDERCV_MAX_WORKERS=4
```

### **Frontend Environment Variables** (`client/.env`)

```bash
# =================================================================
# API CONFIGURATION
# =================================================================
VITE_API_BASE_URL=http://localhost:5001

# =================================================================
# APPWRITE CONFIGURATION (Client SDK)
# =================================================================
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id-here
VITE_APPWRITE_DATABASE_ID=livecv-production
```

---

## 🗺️ Complete API Routes

### **Authentication Routes** (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **POST** | `/api/auth/register` | Register new user | ❌ |
| **POST** | `/api/auth/login` | Login with email/password | ❌ |
| **POST** | `/api/auth/logout` | Logout current session | ✅ |
| **GET** | `/api/auth/me` | Get current user | ✅ |
| **PUT** | `/api/auth/profile` | Update user profile | ✅ |
| **POST** | `/api/auth/forgot-password` | Request password reset | ❌ |
| **POST** | `/api/auth/reset-password` | Reset password with token | ❌ |
| **POST** | `/api/auth/verify-email` | Send email verification | ✅ |
| **PUT** | `/api/auth/verify-email` | Confirm email verification | ❌ |

### **Resume Routes** (`/api/resume`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **GET** | `/api/resume` | List user's resumes | ✅ |
| **POST** | `/api/resume` | Create new resume | ✅ |
| **GET** | `/api/resume/:id` | Get resume by ID | ✅ |
| **PUT** | `/api/resume/:id` | Update resume | ✅ |
| **DELETE** | `/api/resume/:id` | Delete resume | ✅ |
| **GET** | `/api/resume/template/:templateId` | Render template (legacy) | ✅ |

### **RenderCV Routes** (`/api/render`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **GET** | `/api/render/health` | Health check | ❌ |
| **GET** | `/api/render/cache/stats` | Cache statistics | ❌ |
| **GET** | `/api/render/:id/preview` | Preview PDF (streaming) | ✅ |
| **GET** | `/api/render/:id/download` | Download PDF | ✅ |
| **GET** | `/api/render/:id/yaml` | Get YAML representation | ✅ |
| **POST** | `/api/render/generate` | Generate PDF from JSON | ❌ |

**Query Parameters:**
- `theme`: RenderCV theme (classic, moderncv, sb2nov, engineeringresumes)
- `bypassCache`: Force regeneration (true/false)

### **Templates Routes** (`/api/templates`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **GET** | `/api/templates` | List available templates | ❌ |
| **GET** | `/api/templates/:filename` | Get template file (PDF/YAML) | ❌ |

### **ATS Routes** (`/api/ats`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **POST** | `/api/ats/score` | Calculate ATS score | ✅ |
| **POST** | `/api/ats/analyze` | Analyze resume | ✅ |

### **Job Matching Routes** (`/api/match`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **POST** | `/api/match/score` | Calculate job match score | ✅ |
| **POST** | `/api/match/optimize` | Get optimization suggestions | ✅ |

### **Report Routes** (`/api/report`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **POST** | `/api/report/generate` | Generate report | ✅ |
| **GET** | `/api/report/:id/download` | Download report | ✅ |

---

## 🎨 Frontend Routes

| Route | Component | Description | Auth Required |
|-------|-----------|-------------|---------------|
| `/` | `Landing` | Marketing homepage | ❌ |
| `/login` | `Login` | User login | ❌ |
| `/register` | `Register` | User registration | ❌ |
| `/dashboard` | `Dashboard` | Resume management | ✅ |
| `/builder` | `ResumeBuilder` | Resume editor (new) | ✅ |
| `/builder/:id` | `ResumeBuilder` | Resume editor (existing) | ✅ |
| `/templates` | `Templates` | Template gallery | ❌ |
| `/ats-score` | `ATSScore` | ATS analysis | ✅ |
| `/job-matching` | `JobMatching` | Job matching | ✅ |

---

## 📦 Appwrite Database Schema

### **Collection: `users`**
```json
{
  "userId": "string (unique)",
  "name": "string",
  "email": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "resumeCount": "integer",
  "lastLoginAt": "datetime"
}
```

### **Collection: `resumes`**
```json
{
  "userId": "string",
  "name": "string",
  "theme": "string (classic|moderncv|sb2nov|engineeringresumes)",
  "yamlContent": "string (large)",
  "pdfUrl": "string (URL to Appwrite Storage)",
  "yamlUrl": "string (URL to Appwrite Storage)",
  "atsScore": "integer (0-100)",
  "templateId": "string",
  "personalInfo": "object",
  "experience": "array",
  "education": "array",
  "skills": "array",
  "projects": "array",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### **Collection: `templates`**
```json
{
  "name": "string",
  "theme": "string",
  "description": "string",
  "pdfFileId": "string",
  "yamlFileId": "string",
  "previewUrl": "string",
  "category": "string"
}
```

### **Collection: `ats_scores`**
```json
{
  "resumeId": "string",
  "userId": "string",
  "score": "integer",
  "analysis": "object",
  "suggestions": "array",
  "createdAt": "datetime"
}
```

### **Collection: `job_matches`**
```json
{
  "resumeId": "string",
  "userId": "string",
  "jobDescription": "string",
  "matchScore": "integer",
  "missingKeywords": "array",
  "suggestions": "array",
  "createdAt": "datetime"
}
```

---

## 📂 Appwrite Storage Buckets

### **Bucket: `resume-pdfs`**
- Stores generated PDF files
- Public read access (with URL signing)
- User-specific permissions

### **Bucket: `resume-yamls`**
- Stores generated YAML files
- Private access (user-only)
- Version history

### **Bucket: `user-avatars`**
- User profile pictures
- Public read access
- Max size: 5MB

### **Bucket: `template-files`**
- Template PDFs and YAMLs
- Public read access
- Admin write access only

---

## 🔧 Setup Instructions

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
pip install rendercv
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Create Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io/)
2. Create new project
3. Copy **Project ID** and **API Key**

### 3. Create Database & Collections

Run this script in Appwrite Console or use Appwrite CLI:

```bash
# Create database
appwrite databases create \
  --databaseId livecv-production \
  --name "LiveCV Production"

# Create collections (repeat for each collection)
appwrite databases createCollection \
  --databaseId livecv-production \
  --collectionId users \
  --name "Users"

# Add attributes
appwrite databases createStringAttribute \
  --databaseId livecv-production \
  --collectionId users \
  --key userId \
  --size 255 \
  --required true
```

### 4. Create Storage Buckets

```bash
appwrite storage createBucket \
  --bucketId resume-pdfs \
  --name "Resume PDFs" \
  --permissions read("any")
```

### 5. Configure Environment Variables

Copy the environment variables from above sections into:
- `server/.env`
- `client/.env`

### 6. Start Development Servers

```bash
# Terminal 1 (Backend)
cd server && npm run dev

# Terminal 2 (Frontend)
cd client && npm run dev
```

### 7. Test the Application

1. Navigate to `http://localhost:5173`
2. Register a new account
3. Create a resume
4. View PDF in modal
5. Download PDF

---

## 🎯 Key Features

### PDF Modal Viewer
- ✅ Full-screen modal overlay
- ✅ Zoom in/out controls
- ✅ Fullscreen mode
- ✅ Download button
- ✅ Keyboard shortcuts (ESC to close)
- ✅ Same design as your popup image

### Dashboard
- ✅ Lists all user resumes
- ✅ Shows template gallery from `server/templates/`
- ✅ Click "View" to open PDF in modal
- ✅ Edit, delete resume actions
- ✅ Create new resume button

### Authentication
- ✅ Register with email/password
- ✅ Login with Appwrite Auth
- ✅ Password strength indicator
- ✅ Email verification support
- ✅ Password reset support

---

## 📊 File Summary

### New Backend Files (8 files)
1. `server/services/authService.js` - Appwrite authentication
2. `server/routes/auth.js` - Auth routes
3. `server/routes/templates.js` - Template serving
4. `server/config/appwrite.js` - Enhanced with Users, Functions
5. `server/services/appwriteService.js` - Database operations
6. `server/utils/jsonToYamlMapper.js` - JSON → YAML conversion
7. `server/services/rendercvService.js` - RenderCV execution
8. `server/controllers/renderController.js` - PDF generation

### New Frontend Files (7 files)
1. `client/src/config/appwrite.ts` - Appwrite client config
2. `client/src/contexts/AuthContext.tsx` - Authentication context
3. `client/src/pages/Landing.tsx` - Homepage
4. `client/src/pages/Login.tsx` - Login page
5. `client/src/pages/Register.tsx` - Registration page
6. `client/src/components/PDFModal.tsx` - PDF popup viewer
7. `client/src/hooks/useDebouncedPreview.ts` - Debounced PDF generation

### Modified Files (5 files)
1. `server/server.js` - Added new routes
2. `server/package.json` - Added dependencies
3. `client/package.json` - Added appwrite, lucide-react
4. `client/src/pages/Dashboard.tsx` - Appwrite integration, PDF modal
5. `server/models/Resume.js` - Added RenderCV fields

---

## 🧪 Testing Checklist

- [ ] Install RenderCV: `pip install rendercv`
- [ ] Install backend deps: `cd server && npm install`
- [ ] Install frontend deps: `cd client && npm install`
- [ ] Create Appwrite project
- [ ] Configure environment variables
- [ ] Start backend: `npm run dev`
- [ ] Start frontend: `npm run dev`
- [ ] Register new account
- [ ] Login successfully
- [ ] View dashboard
- [ ] Create resume
- [ ] View PDF in modal (click "View" button)
- [ ] Test zoom controls
- [ ] Download PDF
- [ ] View template gallery
- [ ] Preview template PDFs in modal
- [ ] Test all 5 themes (classic, moderncv, sb2nov, engineering, engineeringclassic)

---

## 🚀 Deployment

### Backend (Vercel/Railway/Render)
```bash
# Build
cd server
npm install

# Environment variables required:
# - All Appwrite variables
# - OPENAI_API_KEY
# - Other service keys
```

### Frontend (Vercel/Netlify)
```bash
# Build
cd client
npm install
npm run build

# Environment variables required:
# - VITE_API_BASE_URL
# - VITE_APPWRITE_ENDPOINT
# - VITE_APPWRITE_PROJECT_ID
```

---

## 📖 Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [RenderCV Documentation](https://docs.rendercv.com/)
- [React Router Documentation](https://reactrouter.com/)

---

**Migration Complete! 🎉**

Your LiveCV application now uses Appwrite for everything:
- ✅ Authentication (replaces Clerk)
- ✅ Database (replaces MongoDB)
- ✅ Storage (replaces Cloudinary)
- ✅ All resume data persistence
- ✅ Template gallery with PDF modal viewer
- ✅ Professional landing and auth pages

Run `npm install` in both folders to install the new dependencies!
