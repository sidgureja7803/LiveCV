# LiveCV - Resume Builder with ATS Optimization

LiveCV is a modern resume builder application that helps job seekers create professional resumes optimized for Applicant Tracking Systems (ATS). Now powered by **RenderCV** for high-quality, Typst-based PDF generation.

## Features

- **RenderCV Integration**: Professional PDF generation using Typst rendering engine
- **Live PDF Preview**: Real-time debounced preview as you edit
- **Multiple Themes**: Classic, ModernCV, SB2Nov, and Engineering resume styles
- **ATS Optimization**: Score analysis and keyword matching
- **Job Description Matching**: AI-powered resume tailoring
- **Real-time Collaboration**: Socket.IO-powered live editing
- **Dual Preview Modes**: Toggle between HTML and PDF preview
- **Smart Caching**: In-memory PDF caching for instant previews
- **Dashboard**: Manage multiple resumes with version history

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
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173

# Optional: Appwrite for resume persistence
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
APPWRITE_DATABASE_ID=livecv-db
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

## Authentication

LiveCV uses Clerk for authentication. To set up authentication:

1. Create an account on [Clerk](https://clerk.dev/)
2. Create a new application in Clerk dashboard
3. Get your API keys (Publishable Key and Secret Key)
4. Add them to your environment variables as described above

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