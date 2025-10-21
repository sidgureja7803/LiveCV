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

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Python 3.8+ (for RenderCV)
- pip (Python package installer)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/LiveCV.git
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

**Client (.env file in client directory):**
```
VITE_API_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

**Server (.env file in server directory):**
```
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Appwrite Configuration (Required)
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
APPWRITE_DATABASE_ID=livecv-production
APPWRITE_COLLECTION_RESUMES=resumes
APPWRITE_COLLECTION_USERS=users
APPWRITE_BUCKET_PDFS=resume-pdfs
APPWRITE_BUCKET_YAMLS=resume-yamls

# Optional: OpenAI for AI features
OPENAI_API_KEY=your_openai_api_key_here
```

**Frontend (.env file in client directory):**
```
VITE_API_URL=http://localhost:5001
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=livecv-production
```

5. Start the development servers:

```bash
# Start client (in client directory)
npm run dev

# Start server (in server directory)
npm run dev
```

## Adding Resume Templates

Resume templates are stored as EJS files in the `server/views/templates/` directory.

### Template Structure

Each template should be an EJS file with the following structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
  <style>
    /* Template-specific styles */
    body {
      font-family: 'Arial', sans-serif;
      /* More styles... */
    }
    /* Additional styles... */
  </style>
</head>
<body>
  <!-- Template structure with EJS variables -->
  <div class="resume-container">
    <div class="header">
      <h1><%= resumeData.personalInfo.name %></h1>
      <!-- More template content... -->
    </div>
    
    <!-- Other resume sections... -->
  </div>
  
  <!-- Socket.IO Client Script for Real-time Updates -->
  <script src="/socket.io/socket.io.js"></script>
  <script>
    // Connect to Socket.IO server
    const socket = io();
    
    // Listen for resume updates
    socket.on('resumeUpdated', function(data) {
      location.reload();
    });
  </script>
</body>
</html>
```

### Registering a New Template

After creating your template EJS file in `server/views/templates/`, you need to register it in the client-side template configuration:

1. Add your template to `client/src/config/templates.ts`:

```typescript
export const templates = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    thumbnail: '/templates/modern-professional-thumb.jpg',
    description: 'A clean, professional template suitable for corporate roles.'
  },
  {
    id: 'your-template-id', // This should match your EJS filename without extension
    name: 'Your Template Name',
    thumbnail: '/templates/your-template-thumb.jpg',
    description: 'Description of your template'
  },
  // Other templates...
];
```

2. Add a thumbnail image for your template in `client/public/templates/`

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

1. **User Resume Limit**: Each user can save their last 5 resumes
   - Automatic cleanup of older resumes
   - Prevents storage bloat
   - Always shows recent work

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