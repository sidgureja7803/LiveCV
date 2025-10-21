# Resume Creation Workflow Guide

## 📝 How LiveCV Works (React → YAML → PDF)

### Architecture Overview

```
User Input (Frontend)
    ↓
Resume Data (React State)
    ↓
API Call to Backend
    ↓
Convert to YAML (jsonToYamlMapper.js)
    ↓
RenderCV Process (rendercvService.js)
    ↓
Generate PDF
    ↓
Save to Appwrite (Database + Storage)
    ↓
Return PDF URL to Frontend
    ↓
Display in LiveResumeViewer
```

---

## 🔄 Complete Workflow

### Step 1: User Edits Resume (Frontend)
**File:** `/client/src/pages/ResumeBuilder.tsx`

```tsx
const [resumeData, setResumeData] = useState<ResumeData>({
  personalInfo: { name, email, phone, ... },
  experience: [...],
  education: [...],
  skills: [...],
  projects: [...]
});
```

User makes changes in the form → React state updates in real-time

### Step 2: Trigger PDF Generation
**File:** `/client/src/hooks/useDebouncedPreview.ts`

When user edits:
1. Debounced hook waits 1000ms (avoid too many requests)
2. Calls `apiService.generatePDF(resumeData, theme)`

### Step 3: Backend Receives Data
**File:** `/server/routes/renderRoute.js`

```javascript
POST /api/render/generate-pdf
Body: { resumeData, theme: 'classic' }
```

### Step 4: Convert JSON to YAML
**File:** `/server/utils/jsonToYamlMapper.js`

```javascript
const yaml = require('js-yaml');
const yamlContent = yaml.dump(mappedData);
```

Converts React form data to RenderCV-compatible YAML format

### Step 5: Generate PDF with RenderCV
**File:** `/server/services/rendercvService.js`

```javascript
// Save YAML file
await fs.writeFile('resume.yaml', yamlContent);

// Run RenderCV command
exec(`rendercv render resume.yaml --use-local-latex-command pdflatex`);

// Read generated PDF
const pdfBuffer = await fs.readFile('resume.pdf');
```

### Step 6: Save to Appwrite
**File:** `/server/services/appwriteService.js`

```javascript
// Save PDF to storage bucket
const pdfFile = await uploadPDF(pdfBuffer, fileName, userId);

// Save YAML to storage bucket  
const yamlFile = await uploadYAML(yamlContent, fileName, userId);

// Save metadata to database
const document = await saveResumeMetadata({
  userId,
  name: resumeData.name,
  theme: 'classic',
  yamlContent,
  lastPdfUrl: pdfFile.url,
  lastPdfFileSize: pdfFile.fileSize,
  createdAt: new Date(),
  updatedAt: new Date()
}, userId);
```

**Database Structure:**
```
Collection: resumes
{
  $id: "unique_doc_id",
  userId: "user_123",
  name: "John Doe Resume",
  theme: "classic",
  yamlContent: "cv:\n  name: John...",
  lastPdfUrl: "https://cloud.appwrite.io/v1/storage/.../view",
  lastPdfFileSize: 45678,
  contentHash: "abc123...",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

**Storage Buckets:**
- `resume-pdfs`: PDF files
- `resume-yamls`: YAML files

### Step 7: Return PDF URL
**Backend Response:**
```json
{
  "success": true,
  "pdfUrl": "https://cloud.appwrite.io/v1/storage/buckets/.../view",
  "documentId": "resume_doc_123",
  "yaml": "cv:\n  name: John Doe..."
}
```

### Step 8: Display PDF Preview
**File:** `/client/src/components/LiveResumeViewer.tsx`

```tsx
<iframe
  src={pdfUrl}
  className="w-full h-full"
/>
```

Shows live PDF preview as user types!

---

## 💾 Saving Last 5 Resumes

### Current Implementation
Appwrite already saves ALL resumes per user:
```javascript
// Get user's resumes
const resumes = await listUserResumes(userId);
// Returns array of all resume documents
```

### To Limit to Last 5
Add this logic in `appwriteService.js`:

```javascript
async function saveResumeWithLimit(resumeData, userId) {
  // Get all user resumes
  const resumes = await listUserResumes(userId);
  
  // If user has 5+ resumes, delete oldest
  if (resumes.length >= 5) {
    const oldest = resumes[resumes.length - 1];
    await deleteResumeMetadata(oldest.$id);
    
    // Also delete files from storage
    if (oldest.pdfFileId) {
      await deleteFile(APPWRITE_CONFIG.buckets.pdfs, oldest.pdfFileId);
    }
    if (oldest.yamlFileId) {
      await deleteFile(APPWRITE_CONFIG.buckets.yamls, oldest.yamlFileId);
    }
  }
  
  // Save new resume
  return await saveResumeMetadata(resumeData, userId);
}
```

---

## 🎨 Templates

### Available in `/server/templates/`:
- `John_Doe_ClassicTheme_CV.yaml` → `John_Doe_ClassicTheme_CV.pdf`
- `John_Doe_ModerncvTheme_CV.yaml` → `John_Doe_ModerncvTheme_CV.pdf`
- `John_Doe_Sb2novTheme_CV.yaml` → `John_Doe_Sb2novTheme_CV.pdf`
- etc.

These are example templates that RenderCV can generate.

### Theme Selection
User selects theme → Backend uses corresponding RenderCV theme:
```javascript
const themes = {
  'classic': 'classic',
  'modern': 'moderncv',
  'sb2nov': 'sb2nov',
  'engineering': 'engineeringresumes'
};
```

---

## 🔐 User Permissions

Appwrite automatically handles permissions:
```javascript
Permission.read(Role.user(userId))      // Only user can read
Permission.update(Role.user(userId))    // Only user can update
Permission.delete(Role.user(userId))    // Only user can delete
```

Each resume is private to the user who created it!

---

## 📊 Live Preview Flow

```
User types in form
    ↓ (1 second delay)
Resume data updated
    ↓
API call to /generate-pdf
    ↓
Backend generates PDF
    ↓
Returns PDF URL
    ↓
Frontend updates iframe src
    ↓
PDF displays instantly!
```

**Performance:**
- Debounced to prevent lag
- Caches previous PDFs
- Shows loading state during generation

---

## ✅ What's Already Working

1. ✅ React form for editing resume data
2. ✅ Live preview with debouncing
3. ✅ YAML conversion
4. ✅ PDF generation with RenderCV
5. ✅ Appwrite integration (save/load/delete)
6. ✅ User-specific resume storage
7. ✅ Multiple theme support

## 🚀 To Make It Live

1. **Setup Appwrite** (follow APPWRITE_SETUP_GUIDE.md)
   - Create project
   - Create database & collections
   - Create storage buckets
   - Setup OAuth (Google/GitHub)

2. **Set Environment Variables** (see .env.example files)
   - Frontend: VITE_APPWRITE_*
   - Backend: APPWRITE_*

3. **Test the workflow:**
   - Login → Dashboard → Create Resume
   - Edit details → See live preview
   - Download PDF → Check Appwrite storage
   - Reload page → Resume loads from Appwrite

---

Your workflow is **already implemented correctly**! 
Just need to configure Appwrite to enable cloud storage. 🎉
