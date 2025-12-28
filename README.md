# LiveCV - AI-Powered Resume Builder

LiveCV is a modern resume builder application that helps job seekers create professional resumes optimized for Applicant Tracking Systems (ATS). Powered by **RenderCV** for high-quality PDF generation and **Appwrite** for secure cloud storage and authentication.

## Features

- **RenderCV Integration**: Professional PDF generation using Typst rendering engine
- **Appwrite Backend**: Secure cloud storage, authentication, and user management
- **Live PDF Preview**: Real-time debounced preview as you edit
- **Multiple Themes**: Classic, ModernCV, SB2Nov, and Engineering resume styles
- **ATS Optimization**: Score analysis and keyword matching
- **Job Description Matching**: AI-powered resume tailoring
- **Real-time Collaboration**: Socket.IO-powered live editing
- **Dual Preview Modes**: Toggle between HTML and PDF preview
- **Smart Caching**: In-memory PDF caching for instant previews
- **Cloud Storage**: Resume persistence with automatic versioning
- **Dashboard**: Manage multiple resumes with version history
- **OAuth Integration**: Sign in with Google or GitHub via Appwrite
- **Resume Limit Management**: Automatic 5-resume limit per user with smart cleanup

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Python 3.8+ (for RenderCV)
- pip (Python package installer)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sidgureja7803/LiveCV.git
cd LiveCV
```

2. Install RenderCV (required for PDF generation):
```bash
pip install rendercv
```

Or use the npm script:
```bash
cd server
npm run setup:rendercv
```

3. Install dependencies for both client and server:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

4. Configure environment variables:

**Server (.env file in server directory):**

Copy the example file and fill in your values:
```bash
cd server
cp .env.example.server .env
```

Edit `.env` with your configuration:
```bash
# REQUIRED - Server Configuration
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# REQUIRED - Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
APPWRITE_DATABASE_ID=livecv-production
APPWRITE_COLLECTION_RESUMES=resumes
APPWRITE_COLLECTION_USERS=users
APPWRITE_BUCKET_PDFS=resume-pdfs
APPWRITE_BUCKET_YAMLS=resume-yamls

# OPTIONAL - AI Features
AIMLAPI_API_KEY=your_aiml_api_key
OPENAI_API_KEY=sk-your_openai_key
```

**Client (.env file in client directory):**

Copy the example file and fill in your values:
```bash
cd client
cp .env.example.client .env
```

Edit `.env` with your configuration:
```bash
# REQUIRED - API Configuration
VITE_API_URL=http://localhost:5001

# REQUIRED - Appwrite Configuration (must match server)
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=livecv-production
```

**Important Notes:**
- All `REQUIRED` variables must be set for the application to work
- `OPTIONAL` variables enable additional features (AI scoring, job matching)
- Ensure Appwrite configuration matches between client and server
- Never commit your `.env` files to version control
- See `.env.example.server` and `.env.example.client` for detailed documentation

5. Start the development servers:

```bash
# Start client (in client directory)
npm run dev

# Start server (in server directory)
npm run dev
```

### Maintenance

**Cleanup Script**

LiveCV includes an automated cleanup script to remove unnecessary files from the repository:

```bash
# Run from project root
./server/scripts/cleanup.sh
```

This script will:
- Remove all `.DS_Store` files (macOS system files)
- Remove macOS resource fork files (`._*`)
- Remove temporary files (`*.tmp`)
- Remove vim swap files (`*.swp`, `*.swo`, `*~`)
- Remove log files from the root directory

**Note:** Build artifacts in `node_modules/` and `dist/` are already ignored by `.gitignore` and don't need manual cleanup.

## Resume Templates

LiveCV uses **RenderCV** for professional PDF generation with multiple theme options. Templates are dynamically generated from user data, not loaded from static files.

### How Templates Work

```
User Input (JSON) → Backend Conversion → RenderCV YAML → PDF Generation
```

1. User fills out resume form in the frontend
2. Frontend sends resume data as JSON to backend
3. Backend converts JSON to RenderCV YAML format
4. RenderCV generates PDF with selected theme
5. PDF is cached and streamed to user

### Available Themes

LiveCV supports 5 professional RenderCV themes:

| Theme | Best For | Style |
|-------|----------|-------|
| **Classic** | Business professionals, finance, management | Traditional two-column with blue accents |
| **ModernCV** | Software engineers, product managers | Modern design with sidebar |
| **Sb2nov** | Developers, tech leads | Compact, popular among engineers |
| **EngineeringResumes** | Software/hardware engineers | Technical roles, skills highlighted |
| **EngineeringClassic** | Researchers, PhD candidates | Academic focus, publications ready |

### Template Configuration

**Frontend** (`client/src/config/templates.ts`):
- Template metadata (name, description, category)
- Thumbnail images for preview
- Theme IDs that map to RenderCV themes

**Backend** (`server/utils/jsonToYamlMapper.js`):
- JSON to YAML conversion logic
- Theme-specific design configuration
- Field mapping and validation

**Server Templates Directory** (`server/templates/`):
- Example YAML and PDF files for reference
- Used for testing and documentation
- **NOT loaded by the application at runtime**

### Adding New Themes

To add a new RenderCV theme to LiveCV:

1. **Verify RenderCV Support**: Ensure the theme exists in RenderCV
   ```bash
   rendercv --help  # Check available themes
   ```

2. **Update Backend Mapper** (`server/utils/jsonToYamlMapper.js`):
   ```javascript
   function getThemeDesign(theme) {
     switch(theme) {
       case 'your-new-theme':
         return {
           theme: 'your-new-theme',
           // Theme-specific configuration
         };
       // ... other themes
     }
   }
   ```

3. **Add Frontend Configuration** (`client/src/config/templates.ts`):
   ```typescript
   {
     id: 'your-new-theme',
     name: 'Your Theme Name',
     description: 'Theme description',
     category: 'professional',
     thumbnail: '/images/your-theme-thumb.png',
     // ... other metadata
   }
   ```

4. **Add Thumbnail Image**: Place preview image in `client/public/images/`

5. **Test Generation**:
   ```bash
   cd server
   npm run render:local
   ```

6. **(Optional) Add Example Files**: Add sample YAML/PDF to `server/templates/` for documentation

### Template Testing

Test all themes locally:
```bash
cd server
npm run render:local
```

This generates PDFs for all themes and saves them to `server/test-output/`.

### RenderCV Resources

- Official Documentation: https://docs.rendercv.com/
- GitHub Repository: https://github.com/sinaatalay/rendercv
- Theme Gallery: https://docs.rendercv.com/user_guide/themes/

## Troubleshooting Guide

This section covers common issues and their solutions when setting up or using LiveCV.

### RenderCV Installation Issues

#### Problem: `rendercv: command not found`

**Cause**: RenderCV is not installed or not in PATH

**Solutions**:

1. Install RenderCV using pip:
   ```bash
   pip install rendercv
   ```

2. If using Python 3.x specifically:
   ```bash
   pip3 install rendercv
   ```

3. Verify installation:
   ```bash
   rendercv --version
   ```

4. If still not found, check Python PATH:
   ```bash
   python3 -m pip show rendercv
   ```

#### Problem: `Python version too old`

**Cause**: RenderCV requires Python 3.8 or higher

**Solution**:

1. Check your Python version:
   ```bash
   python3 --version
   ```

2. If below 3.8, install a newer version:
   - **macOS**: `brew install python@3.11`
   - **Ubuntu/Debian**: `sudo apt install python3.11`
   - **Windows**: Download from https://www.python.org/downloads/

3. Reinstall RenderCV with the new Python version:
   ```bash
   python3.11 -m pip install rendercv
   ```

#### Problem: `Permission denied when installing RenderCV`

**Cause**: Insufficient permissions for system-wide installation

**Solution**:

1. Install for current user only:
   ```bash
   pip install --user rendercv
   ```

2. Or use sudo (not recommended):
   ```bash
   sudo pip install rendercv
   ```

3. Or use a virtual environment (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install rendercv
   ```

### Appwrite Connection Issues

#### Problem: `Failed to connect to Appwrite`

**Cause**: Incorrect endpoint or network issues

**Solutions**:

1. Verify Appwrite endpoint in `.env`:
   ```bash
   # Should be exactly:
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   ```

2. Check if Appwrite is accessible:
   ```bash
   curl https://cloud.appwrite.io/v1/health
   ```

3. Verify firewall/proxy settings aren't blocking the connection

4. Check Appwrite status: https://status.appwrite.io/

#### Problem: `Invalid API key or Project ID`

**Cause**: Incorrect credentials in environment variables

**Solutions**:

1. Verify credentials in Appwrite Console:
   - Go to https://cloud.appwrite.io/console
   - Select your project
   - Check Project ID in Settings
   - Verify API key in Settings > API Keys

2. Ensure no extra spaces in `.env` file:
   ```bash
   # Wrong:
   APPWRITE_PROJECT_ID = your-id-here
   
   # Correct:
   APPWRITE_PROJECT_ID=your-id-here
   ```

3. Regenerate API key if necessary:
   - Go to Project Settings > API Keys
   - Create new key with required scopes:
     - `databases.*`
     - `storage.*`
     - `users.read`

4. Restart server after updating `.env`:
   ```bash
   cd server
   npm run dev
   ```

#### Problem: `Collection or Bucket not found`

**Cause**: Database collections or storage buckets not created

**Solutions**:

1. Create required collections in Appwrite Console:
   - Go to Databases > Create Collection
   - Create `resumes` collection
   - Create `users` collection

2. Create required storage buckets:
   - Go to Storage > Create Bucket
   - Create `resume-pdfs` bucket
   - Create `resume-yamls` bucket

3. Update `.env` with actual bucket IDs:
   ```bash
   APPWRITE_BUCKET_PDFS=actual-bucket-id-here
   APPWRITE_BUCKET_YAMLS=actual-bucket-id-here
   ```

4. Verify IDs match between client and server `.env` files

### PDF Generation Errors

#### Problem: `PDF generation failed` or `RenderCV error`

**Cause**: Invalid YAML structure or RenderCV issues

**Solutions**:

1. Check server logs for detailed error:
   ```bash
   cd server
   npm run dev
   # Look for RenderCV error messages
   ```

2. Test RenderCV directly with sample YAML:
   ```bash
   cd server/templates
   rendercv render John_Doe_ClassicTheme_CV.yaml
   ```

3. Validate YAML syntax:
   ```bash
   cd server
   node test_yaml_validation.js
   ```

4. Check for missing required fields:
   - `cv.name` (required)
   - `cv.email` (required)
   - `design.theme` (required)

5. Verify theme name is valid:
   - Valid: `classic`, `moderncv`, `sb2nov`, `engineeringresumes`
   - Invalid: `Classic`, `modern-cv`, `engineering_resumes`

#### Problem: `PDF preview not loading in browser`

**Cause**: Browser PDF viewer issues or CORS problems

**Solutions**:

1. Check browser console for errors (F12)

2. Try downloading PDF instead of previewing

3. Verify CORS configuration in `server/server.js`:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

4. Clear browser cache and reload

5. Try a different browser (Chrome, Firefox, Safari)

#### Problem: `PDF generation is very slow`

**Cause**: No caching or large resume content

**Solutions**:

1. Verify caching is enabled in `rendercvService.js`

2. Check cache statistics:
   ```bash
   curl http://localhost:5001/api/render/cache/stats
   ```

3. Reduce resume content size (very long descriptions)

4. Check server resources (CPU, memory)

5. Consider increasing cache TTL in `rendercvService.js`:
   ```javascript
   const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour
   ```

### Frontend Issues

#### Problem: `Cannot connect to backend API`

**Cause**: Incorrect API URL or server not running

**Solutions**:

1. Verify server is running:
   ```bash
   cd server
   npm run dev
   # Should see: Server running on port 5001
   ```

2. Check `VITE_API_URL` in `client/.env`:
   ```bash
   VITE_API_URL=http://localhost:5001
   ```

3. Test API directly:
   ```bash
   curl http://localhost:5001/api/render/health
   ```

4. Check for port conflicts:
   ```bash
   lsof -i :5001  # macOS/Linux
   netstat -ano | findstr :5001  # Windows
   ```

#### Problem: `Authentication not working`

**Cause**: Appwrite session issues or configuration mismatch

**Solutions**:

1. Clear browser cookies and local storage

2. Verify Appwrite configuration matches between client and server

3. Check Appwrite Console > Auth settings:
   - Email/Password auth enabled
   - OAuth providers configured (if using)

4. Test authentication directly in Appwrite Console

5. Check browser console for detailed error messages

#### Problem: `Resume limit warning not appearing`

**Cause**: Frontend not receiving resume count from backend

**Solutions**:

1. Check API response includes count:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5001/api/resume/user/all
   ```

2. Verify `ResumeLimitWarningModal` component is imported

3. Check browser console for React errors

4. Verify `resumeLimitService.js` is working:
   ```bash
   # Check server logs when creating resume
   ```

### Environment Configuration Issues

#### Problem: `Environment variables not loading`

**Cause**: `.env` file not in correct location or syntax errors

**Solutions**:

1. Verify `.env` file location:
   - Server: `server/.env`
   - Client: `client/.env`

2. Check for syntax errors:
   ```bash
   # Wrong:
   PORT = 5001
   APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1"
   
   # Correct:
   PORT=5001
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   ```

3. Restart development servers after changing `.env`

4. Verify `.env` is not in `.gitignore` (it should be!)

5. Use `.env.example` files as reference

#### Problem: `CORS errors in browser console`

**Cause**: Frontend URL not whitelisted in server CORS config

**Solutions**:

1. Update `FRONTEND_URL` in `server/.env`:
   ```bash
   FRONTEND_URL=http://localhost:5173
   ```

2. Verify CORS middleware in `server/server.js`

3. Check browser is using correct frontend URL

4. Clear browser cache and reload

### Database/Storage Issues

#### Problem: `Resume not saving to database`

**Cause**: Appwrite permissions or database configuration

**Solutions**:

1. Check Appwrite Console > Database > Resumes collection:
   - Verify collection exists
   - Check permissions (users should have read/write)

2. Check server logs for Appwrite errors

3. Verify API key has `databases.*` scope

4. Test database connection:
   ```bash
   cd server
   node server/config/validateConfig.js
   ```

#### Problem: `File upload failed`

**Cause**: Storage bucket permissions or size limits

**Solutions**:

1. Check Appwrite Console > Storage > Buckets:
   - Verify buckets exist
   - Check file size limits (increase if needed)
   - Verify permissions

2. Check file size:
   ```bash
   # PDFs should be < 5MB typically
   ```

3. Verify API key has `storage.*` scope

4. Check server logs for detailed error

### Performance Issues

#### Problem: `Application is slow`

**Cause**: Various performance bottlenecks

**Solutions**:

1. Enable PDF caching (should be default)

2. Optimize resume content (reduce text length)

3. Check network latency to Appwrite

4. Monitor server resources:
   ```bash
   top  # Linux/macOS
   # Check CPU and memory usage
   ```

5. Consider upgrading Appwrite plan if on free tier

6. Use production build for frontend:
   ```bash
   cd client
   npm run build
   npm run preview
   ```

### Getting Help

If you're still experiencing issues:

1. **Check Server Logs**: Most errors are logged with details
   ```bash
   cd server
   npm run dev
   # Watch for error messages
   ```

2. **Check Browser Console**: Frontend errors appear here (F12)

3. **Verify Configuration**: Run validation script
   ```bash
   cd server
   node config/validateConfig.js
   ```

4. **Test Core Functionality**: Run integration tests
   ```bash
   cd server
   npm run test:integration
   ```

5. **Check Documentation**:
   - RenderCV: https://docs.rendercv.com/
   - Appwrite: https://appwrite.io/docs
   - Node.js: https://nodejs.org/docs/

6. **Create GitHub Issue**: Include:
   - Error messages from logs
   - Steps to reproduce
   - Environment details (OS, Node version, Python version)
   - Configuration (without sensitive data)

### Quick Diagnostic Checklist

Run through this checklist to identify issues quickly:

- [ ] Python 3.8+ installed: `python3 --version`
- [ ] RenderCV installed: `rendercv --version`
- [ ] Node.js 14+ installed: `node --version`
- [ ] Server dependencies installed: `cd server && npm install`
- [ ] Client dependencies installed: `cd client && npm install`
- [ ] Server `.env` file exists and configured
- [ ] Client `.env` file exists and configured
- [ ] Appwrite project created and accessible
- [ ] Appwrite collections created (resumes, users)
- [ ] Appwrite buckets created (resume-pdfs, resume-yamls)
- [ ] Server starts without errors: `cd server && npm run dev`
- [ ] Client starts without errors: `cd client && npm run dev`
- [ ] Can access frontend: http://localhost:5173
- [ ] Can access backend health: http://localhost:5001/api/render/health
- [ ] RenderCV test works: `cd server && npm run render:local`

## Live Collaboration

LiveCV supports real-time collaboration through Socket.IO. When multiple users are editing the same resume, changes are synchronized in real-time.

The Socket.IO connection is established in the `ResumeBuilder` component and managed through the `useSocketIo` hook.

## Appwrite Backend - Complete Cloud Infrastructure

LiveCV uses **Appwrite** as its complete backend infrastructure, handling:

### 🔐 Authentication & User Management
- **Email/Password Authentication**: Secure user signup and login
- **OAuth Integration**: Sign in with Google or GitHub
- **Session Management**: Automatic session handling and token refresh
- **User Profiles**: Store and manage user information

### 💾 Database (Resume Storage)
Appwrite Database stores all resume metadata:
- **Collection: `resumes`**
  - User ID (owner)
  - Resume name
  - Theme (classic, moderncv, etc.)
  - YAML content
  - PDF URL and file metadata
  - Creation and update timestamps
  - Content hash for change detection

**Features:**
- Document-based NoSQL database
- Real-time queries
- User-specific permissions (users can only access their own resumes)
- Automatic indexing
- Version tracking

### 📦 Cloud Storage (File Management)
Appwrite Storage handles all resume files:

**Bucket: `resume-pdfs`**
- Stores generated PDF files
- User can download anytime
- Secure URLs with expiration
- File size tracking

**Bucket: `resume-yamls`**
- Stores YAML source files
- Can regenerate PDFs from YAML
- Enables resume editing/versioning
- Text-based for easy storage

**Features:**
- Automatic file compression
- CDN integration for fast delivery
- User-specific file permissions
- Antivirus scanning
- Encryption at rest

### 🔄 Complete Workflow with Appwrite

```
User Signs Up (Appwrite Auth)
  ↓
User Creates Resume (Frontend Form)
  ↓
Backend Checks Resume Limit (5 max)
  ├── If at limit → Show warning modal
  ├── User confirms → Delete oldest resume
  └── Continue with creation
  ↓
Backend Generates YAML
  ↓
RenderCV Creates PDF
  ↓
Backend Saves to Appwrite:
  ├── YAML → Storage Bucket (resume-yamls)
  ├── PDF → Storage Bucket (resume-pdfs)
  └── Metadata → Database (resumes collection)
  ↓
User Can:
  ├── View PDF instantly (CDN URL)
  ├── Download PDF
  ├── Edit resume (loads from database)
  ├── See resume count (X/5 resumes)
  └── Access from any device
```

### 🛡️ Security & Permissions

**Document-Level Security:**
```javascript
Permission.read(Role.user(userId))    // Only owner can read
Permission.update(Role.user(userId))  // Only owner can update
Permission.delete(Role.user(userId))  // Only owner can delete
```

**Storage Security:**
- Each file has user-specific read/write permissions
- Files are encrypted at rest
- Secure HTTPS URLs only
- Optional file expiration

### 📊 Key Features

1. **Resume Limit Management**: Each user can save up to 5 resumes
   - Automatic cleanup of oldest resumes when limit is reached
   - Warning modal before deletion with download option
   - Visual indicator showing resume count (e.g., "4/5 resumes")
   - Prevents storage bloat while keeping recent work
   - Oldest resume determined by `updatedAt` timestamp
   - Associated PDF and YAML files automatically deleted from storage

2. **Resume Versioning**: Track changes over time
   - Content hash for change detection
   - Update timestamps
   - Can revert to previous versions

3. **Multi-Device Access**: 
   - Resumes stored in cloud
   - Access from any device
   - No data loss on logout

4. **Fast Delivery**: 
   - PDF URLs served via CDN
   - Instant downloads
   - Cached for performance

### 🚀 Setup Appwrite

1. **Create Appwrite Account**: https://cloud.appwrite.io
2. **Create Project**: Get your Project ID
3. **Generate API Key**: 
   - Required scopes: `databases.*`, `storage.*`, `users.read`
4. **Create Database**: `livecv-production`
5. **Create Collections**:
   - `resumes` with attributes (see APPWRITE_SETUP_GUIDE.md)
   - `users` for additional user data
6. **Create Storage Buckets**:
   - `resume-pdfs` (PDF files)
   - `resume-yamls` (YAML files)
7. **Setup OAuth** (Optional):
   - Enable Google OAuth
   - Enable GitHub OAuth

**Detailed Setup**: See `APPWRITE_SETUP_GUIDE.md` for step-by-step instructions

### 📈 Appwrite vs Traditional Backend

| Feature | Appwrite | Traditional Backend |
|---------|----------|-------------------|
| Setup Time | ~30 minutes | Days/weeks |
| Authentication | Built-in OAuth | Need to implement |
| Database | NoSQL ready | Need to setup |
| File Storage | Built-in CDN | Need S3/storage |
| Security | Document-level | Manual implementation |
| Scaling | Automatic | Manual configuration |
| Cost | Free tier available | Server costs |

### 🔧 Appwrite Service Functions

**Backend** (`server/services/appwriteService.js`):
- `saveResumeMetadata()` - Save resume to database
- `updateResumeMetadata()` - Update existing resume
- `getResumeMetadata()` - Retrieve resume by ID
- `listUserResumes()` - Get all user's resumes
- `deleteResumeMetadata()` - Delete resume
- `uploadPDF()` - Upload PDF to storage
- `uploadYAML()` - Upload YAML to storage
- `downloadFile()` - Download file from storage
- `deleteFile()` - Delete file from storage

**Frontend** (`client/src/contexts/AuthContext.tsx`):
- User authentication
- Session management
- OAuth login (Google/GitHub)
- User profile access

### 💡 Why Appwrite?

1. **Fast Development**: Pre-built auth, database, storage
2. **Secure by Default**: Built-in encryption and permissions
3. **Scalable**: Handles thousands of users
4. **Cost-Effective**: Free tier for development
5. **Developer-Friendly**: Great documentation and SDKs
6. **Open Source**: Self-hostable if needed

**LiveCV + Appwrite = Complete SaaS Application** ✨

## Resume Limit Management

LiveCV implements a smart 5-resume limit per user to ensure optimal storage usage and encourage users to maintain their most relevant resumes.

### How It Works

1. **Automatic Enforcement**: When you attempt to create a 6th resume, the system automatically identifies your oldest resume (based on last update time)

2. **User Warning**: Before deletion, a warning modal appears showing:
   - Which resume will be deleted (name and last updated date)
   - Option to download the resume before it's deleted
   - "Cancel" button to abort the operation
   - "Continue" button to proceed with creation

3. **Smart Cleanup**: Upon confirmation:
   - The oldest resume metadata is deleted from the database
   - Associated PDF file is removed from Appwrite storage
   - Associated YAML file is removed from Appwrite storage
   - New resume is created successfully

4. **Visual Indicators**: 
   - Dashboard shows resume count: "4/5 resumes"
   - Color-coded indicator when approaching limit
   - Remaining slots displayed clearly

### User Experience

```
Dashboard View:
┌─────────────────────────────────┐
│  My Resumes              [4/5]  │ ← Resume count indicator
├─────────────────────────────────┤
│  □ Software Engineer Resume     │
│  □ Frontend Developer Resume    │
│  □ Full Stack Resume            │
│  □ Senior Developer Resume      │
└─────────────────────────────────┘

When creating 5th resume:
┌─────────────────────────────────┐
│  ⚠️  Resume Limit Warning       │
├─────────────────────────────────┤
│  You have reached the maximum   │
│  of 5 resumes. Creating a new   │
│  resume will delete:            │
│                                 │
│  "Software Engineer Resume"     │
│  Last updated: 2 months ago     │
│                                 │
│  [Download First] [Cancel]      │
│  [Continue]                     │
└─────────────────────────────────┘
```

### Why 5 Resumes?

- **Focus on Quality**: Encourages maintaining tailored, up-to-date resumes
- **Storage Efficiency**: Prevents unlimited storage usage
- **Best Practice**: Most job seekers need 2-3 tailored versions
- **Easy Management**: Keeps dashboard clean and organized

### Technical Implementation

The resume limit is enforced by `resumeLimitService.js`:
- Queries user resumes ordered by `updatedAt` timestamp
- Identifies oldest resume when limit is reached
- Deletes resume document and associated files atomically
- Handles errors gracefully (e.g., file already deleted)
- Logs all deletion operations for audit trail

**Note**: The limit applies per user account. Each user has their own independent 5-resume quota.

## RenderCV YAML → Typst → PDF Pipeline

LiveCV now uses **RenderCV** for professional PDF generation. This pipeline provides:

### Architecture Overview

```
┌─────────────────┐
│  React Frontend │
│  (Form Inputs)  │
└────────┬────────┘
         │ Resume JSON
         │ (debounced 800ms)
         ▼
┌─────────────────┐
│  API Gateway    │
│ POST /api/render│
│   /:id/preview  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   jsonToYamlMapper.js           │
│   • Maps JSON → RenderCV YAML   │
│   • Handles theme configuration │
│   • Validates structure         │
└────────┬────────────────────────┘
         │ YAML Content
         ▼
┌─────────────────────────────────┐
│   rendercvService.js            │
│   • Content hash for caching    │
│   • Execute RenderCV CLI        │
│   • In-memory cache (1hr TTL)   │
└────────┬────────────────────────┘
         │
         ├──→ Cache Hit? → Return PDF
         │
         └──→ Cache Miss ↓
              ┌─────────────────┐
              │  RenderCV CLI   │
              │  (Python)       │
              │  • YAML → Typst │
              │  • Typst → PDF  │
              └────────┬────────┘
                       │ PDF Buffer
                       ▼
              ┌─────────────────┐
              │  Cache Storage  │
              │  & Stream PDF   │
              └─────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  React <iframe> │
              │  Live Preview   │
              └─────────────────┘
```

### Key Components

#### Backend

**1. `utils/jsonToYamlMapper.js`**
- Converts frontend resume JSON to RenderCV YAML schema
- Supports themes: `classic`, `moderncv`, `sb2nov`, `engineeringresumes`
- Handles date formatting, social networks, and nested structures
- Validates YAML before rendering

**2. `services/rendercvService.js`**
- Executes RenderCV CLI with timeout protection
- SHA-256 content hashing for cache keys
- In-memory caching with `node-cache` (1-hour TTL)
- Automatic cleanup of temporary files
- Cache statistics tracking

**3. `controllers/renderController.js`**
- `previewPDF`: Streams PDF for iframe preview
- `downloadPDF`: Downloads PDF with custom filename
- `generatePDF`: Generates PDF from raw JSON
- `getYAML`: Returns YAML representation for debugging

**4. `routes/renderRoute.js`**
- `GET /api/render/:id/preview?theme=classic` - Live preview
- `GET /api/render/:id/download?theme=classic` - Download PDF
- `POST /api/render/generate` - Generate from JSON
- `GET /api/render/health` - Health check

**5. `services/appwriteService.js` (Optional)**
- Stores YAML content in Appwrite Database
- Uploads compiled PDFs to Appwrite Storage
- Tracks PDF metadata (theme, size, hash)
- Enables "download later" functionality

#### Frontend

**1. `hooks/useDebouncedPreview.ts`**
- Custom React hook for debounced PDF generation
- 800ms delay after user stops typing
- Automatic cleanup of blob URLs
- Abort controller for request cancellation
- Loading and error states

**2. Updated `ResumeBuilder.tsx`**
- Toggle between HTML and PDF preview modes
- RenderCV theme selector (Classic, ModernCV, etc.)
- Live PDF iframe preview
- Debounced preview generation
- Download functionality

### Usage Examples

#### Testing RenderCV Locally

```bash
# Navigate to server directory
cd server

# Run local test script
npm run render:local
```

This will:
- Check if RenderCV is installed
- Generate PDFs for all 4 themes
- Save YAML and PDF outputs to `server/test-output/`
- Display cache statistics

#### API Usage

**Preview PDF:**
```bash
curl -X GET "http://localhost:5001/api/render/{resumeId}/preview?theme=classic" \
  -H "Authorization: Bearer {token}" \
  --output preview.pdf
```

**Generate PDF from JSON:**
```bash
curl -X POST "http://localhost:5001/api/render/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": {...},
    "theme": "classic",
    "fileName": "John_Doe_Resume.pdf"
  }' \
  --output resume.pdf
```

**Get YAML representation:**
```bash
curl -X GET "http://localhost:5001/api/render/{resumeId}/yaml?theme=moderncv" \
  -H "Authorization: Bearer {token}"
```

### Performance

- **First render**: ~2-5 seconds (depends on resume complexity)
- **Cached renders**: <50ms (instant)
- **Debounce delay**: 800ms (configurable)
- **Cache TTL**: 1 hour
- **Concurrent requests**: Handled via queue (can add worker pool)

### Available Themes

1. **classic** - Traditional two-column layout with blue accents
2. **moderncv** - Modern design with sidebar
3. **sb2nov** - Popular among software engineers
4. **engineeringresumes** - Optimized for technical roles

### Troubleshooting

**RenderCV not installed:**
```bash
pip install rendercv
# or
cd server && npm run setup:rendercv
```

**Permission errors on temp files:**
```bash
# Ensure /tmp directory is writable
chmod 777 /tmp
```

**PDF not generating:**
- Check RenderCV installation: `rendercv --version`
- Check server logs for YAML validation errors
- Test locally: `npm run render:local`
- Verify Python version: `python3 --version` (3.8+ required)

### Migration from HTML Templates

The system now supports **both** rendering modes:

1. **PDF Mode** (RenderCV): Professional, ATS-optimized PDFs
2. **HTML Mode** (Legacy): Browser-rendered HTML templates

Toggle between modes using the preview mode selector in the UI.

### Future Enhancements

- [ ] Worker thread pool for concurrent rendering
- [ ] Redis-based distributed caching
- [ ] Custom Typst templates
- [ ] Real-time collaboration on PDF annotations
- [ ] PDF versioning and history
- [ ] Batch PDF generation API

## License

[MIT](LICENSE)