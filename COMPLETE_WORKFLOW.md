# LiveCV Complete Workflow Documentation

## 🎯 Architecture Overview

### Template Storage

**BACKEND (`server/templates/`):**
- **PDF Files**: Pre-rendered example resumes
- **YAML Files**: Template data/structure for each theme
- **Purpose**: Source of truth for resume generation and sample data

**FRONTEND (`client/public/images/`):**
- **PNG Preview Images**: Template thumbnails for display
- **Purpose**: Fast loading preview images for the dashboard

### Why This Architecture?

1. **Backend templates** = Actual resume generation engine
2. **Frontend images** = User interface/preview only
3. **Separation of concerns** = Clean, maintainable code

---

## 📱 Complete User Flow

### Step 1: Dashboard - Template Selection

**Location:** `/dashboard`

**What User Sees:**
- 5 template cards with real preview images
- Template names (RenderCV, TechPro, Deedy, etc.)
- Category badges (Modern, Professional, Creative)
- Hover actions: Preview (👁️) and Use Template (➕)

**What Happens:**
```javascript
// When user clicks "Use Template" (green + icon):
1. Fetch YAML data from backend: GET /api/templates/yaml/{theme}
2. Parse YAML into ResumeData format
3. Store in localStorage as 'templateData'
4. Navigate to: /builder?template={theme}
```

**Code Flow:**
```typescript
handleUseTemplate(template) {
  // 1. Fetch YAML
  fetch(`${API}/api/templates/yaml/${template.theme}`)
  
  // 2. Store data
  localStorage.setItem('templateData', JSON.stringify({
    theme: template.theme,
    yamlData: data.data,
    templateName: template.name
  }))
  
  // 3. Navigate
  navigate(`/builder?template=${template.theme}`)
}
```

---

### Step 2: Resume Builder - Edit & Compile

**Location:** `/builder?template={theme}`

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  [🏠 LiveCV]  [HTML|PDF] [Theme ▼] [Compile]   │
├──────────────────┬──────────────────────────────┤
│  Left Panel      │  Right Panel                 │
│  (Editor)        │  (Live Preview)              │
│                  │                              │
│  📝 Personal Info│  [PDF Preview]               │
│  📝 Experience   │                              │
│  📝 Education    │  Shows compiled              │
│  📝 Skills       │  resume after                │
│  📝 Projects     │  clicking Compile            │
│                  │                              │
└──────────────────┴──────────────────────────────┘
```

**What Happens on Load:**
```typescript
useEffect(() => {
  // 1. Get template data from localStorage
  const templateData = localStorage.getItem('templateData')
  
  // 2. Parse YAML data
  const yamlCV = templateData.yamlData.cv
  
  // 3. Convert to ResumeData format
  const convertedData = {
    personalInfo: {
      fullName: yamlCV.name,
      email: yamlCV.email,
      phone: yamlCV.phone,
      // ... etc
    },
    experience: yamlCV.sections.experience.map(...),
    education: yamlCV.sections.education.map(...),
    // ... etc
  }
  
  // 4. Auto-fill form fields
  setResumeData(convertedData)
  
  // 5. Set theme
  setRendercvTheme(templateData.theme)
  
  // 6. Clear localStorage
  localStorage.removeItem('templateData')
}, [])
```

**User Actions:**

1. **Edit Fields** (Left Panel)
   - Personal Information
   - Work Experience
   - Education
   - Skills
   - Projects
   - All fields are editable

2. **Click "Compile" Button**
   ```typescript
   handleSaveResume(true) // true = generate PDF
   
   // This will:
   // 1. Save resume data to database
   // 2. Send to backend for PDF generation
   // 3. Generate PDF using RenderCV
   // 4. Display PDF in right panel
   ```

3. **View Live Preview** (Right Panel)
   - Shows compiled PDF after clicking Compile
   - Updates with new changes after re-compiling
   - Can scroll through multi-page resumes

---

## 🔧 Technical Implementation

### Frontend Components

**Dashboard.tsx:**
```typescript
// Fetches templates from backend
fetchTemplates() → GET /api/templates

// Displays 5 template cards with images
templates.map(template => <TemplateCard />)

// Handles template selection
handleUseTemplate(template) {
  // Fetch YAML
  // Store in localStorage
  // Navigate to builder
}
```

**ResumeBuilder.tsx:**
```typescript
// Loads YAML data on mount
useEffect(() => {
  const templateData = localStorage.getItem('templateData')
  // Convert YAML to ResumeData
  // Auto-fill form
}, [])

// Compile button handler
handleSaveResume(generatePdf = true) {
  // Save to backend
  // Generate PDF
  // Update preview
}
```

**TemplateSelector.tsx:**
```typescript
// Alternative template selection page
// Shows templates with detailed info
// Click to select → Navigate to builder
```

### Backend API Endpoints

**GET /api/templates**
```javascript
// Returns all 5 templates
{
  success: true,
  count: 5,
  templates: [
    {
      id: "classic",
      name: "Classic Theme",
      category: "professional",
      pdfUrl: "/api/templates/John_Doe_ClassicTheme_CV.pdf",
      yamlUrl: "/api/templates/John_Doe_ClassicTheme_CV.yaml"
    },
    // ... 4 more
  ]
}
```

**GET /api/templates/yaml/:theme**
```javascript
// Returns parsed YAML data
{
  success: true,
  theme: "classic",
  data: {
    cv: {
      name: "John Doe",
      email: "john.doe@example.com",
      sections: {
        experience: [...],
        education: [...],
        // ... etc
      }
    },
    design: { ... }
  }
}
```

**POST /api/resume/save**
```javascript
// Saves resume and generates PDF
{
  resumeData: { ... },
  theme: "classic",
  generatePdf: true
}

// Returns:
{
  success: true,
  resume: { _id: "...", ... },
  pdf: {
    url: "http://localhost:5001/generated/resume.pdf"
  }
}
```

---

## 🎨 YAML to ResumeData Conversion

### YAML Structure:
```yaml
cv:
  name: John Doe
  email: john.doe@example.com
  phone: +1-609-999-9995
  location: Location
  social_networks:
    - network: LinkedIn
      username: john.doe
  sections:
    education:
      - institution: Stanford University
        degree: PhD
        area: Computer Science
        start_date: 2023-09
        end_date: present
    experience:
      - company: Company C
        position: Summer Intern
        start_date: 2024-06
        end_date: 2024-09
        highlights:
          - Developed deep learning models
```

### Converted ResumeData:
```typescript
{
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-609-999-9995",
    address: "Location",
    linkedIn: "john.doe",
    github: ""
  },
  education: [
    {
      id: "1",
      institution: "Stanford University",
      degree: "PhD",
      fieldOfStudy: "Computer Science",
      startDate: "2023-09",
      endDate: "present",
      gpa: ""
    }
  ],
  experience: [
    {
      id: "1",
      company: "Company C",
      position: "Summer Intern",
      startDate: "2024-06",
      endDate: "2024-09",
      current: false,
      description: "• Developed deep learning models"
    }
  ]
}
```

---

## 🚀 Testing the Complete Workflow

### 1. Start Servers

```bash
# Terminal 1 - Backend
cd server
npm start
# Should start on port 5001

# Terminal 2 - Frontend
cd client
npm run dev
# Should start on port 5173
```

### 2. Test Dashboard

```
1. Navigate to http://localhost:5173/dashboard
2. Verify you see 5 templates with real images
3. Hover over a template
4. See Preview (eye) and Use (plus) buttons
```

### 3. Test Template Selection

```
1. Click green "+" button on any template
2. Check browser console:
   - "📄 Loading YAML data for template: {theme}"
   - "✅ YAML data loaded: {...}"
3. Should redirect to /builder?template={theme}
```

### 4. Test Resume Builder

```
1. On builder page, verify:
   - Left panel has form fields
   - Fields are auto-filled with YAML data
   - Right panel shows placeholder
   
2. Edit some fields (change name, add experience)

3. Click "Compile" button:
   - Button shows "Compiling..."
   - Spinner animation
   
4. Wait for compilation:
   - Right panel updates with PDF preview
   - Can scroll through resume
   - See your changes reflected
```

### 5. Test Edit & Recompile

```
1. Make changes in left panel
2. Click "Compile" again
3. PDF preview updates with new changes
```

---

## 📊 Data Flow Diagram

```
┌──────────────┐
│  Dashboard   │
│  (5 Templates│
│   w/ Images) │
└──────┬───────┘
       │ User clicks "Use Template"
       ↓
┌──────────────┐
│ Fetch YAML   │ ← Backend: /api/templates/yaml/:theme
│ from Backend │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ localStorage │
│ templateData │
└──────┬───────┘
       │ Navigate to /builder
       ↓
┌──────────────┐
│ Resume       │
│ Builder      │
│  Load Data   │
└──────┬───────┘
       │ Convert YAML → ResumeData
       ↓
┌──────────────┐
│ Auto-fill    │
│ Form Fields  │
└──────┬───────┘
       │ User edits
       ↓
┌──────────────┐
│ Click        │
│ "Compile"    │
└──────┬───────┘
       │ Send to backend
       ↓
┌──────────────┐
│ Backend      │ ← RenderCV generates PDF
│ PDF Gen      │
└──────┬───────┘
       │ Return PDF URL
       ↓
┌──────────────┐
│ Display PDF  │
│ in Preview   │
└──────────────┘
```

---

## ✅ Success Criteria

Everything is working when:

- ✅ Dashboard shows 5 templates with real preview images
- ✅ Clicking template loads YAML data
- ✅ Builder auto-fills with template data
- ✅ "Compile" button generates PDF
- ✅ PDF preview shows in right panel
- ✅ Editing and recompiling works
- ✅ No console errors
- ✅ Smooth user experience

---

## 🐛 Common Issues & Solutions

### Templates Don't Load
**Problem:** No templates show on dashboard
**Solution:** 
- Check backend is running
- Verify `/api/templates` returns data
- Check browser console for errors

### YAML Auto-fill Doesn't Work
**Problem:** Form fields are empty in builder
**Solution:**
- Check localStorage has templateData
- Verify YAML parsing in console
- Check conversion logic in useEffect

### Compile Button Does Nothing
**Problem:** PDF doesn't generate
**Solution:**
- Verify backend API is reachable
- Check server console for errors
- Ensure RenderCV is installed on backend

### Preview Doesn't Update
**Problem:** Changes don't reflect in PDF
**Solution:**
- Click "Compile" after making changes
- Check network tab for API calls
- Verify backend PDF generation

---

## 🎓 Summary

**Template Architecture:**
- Backend = Data & Generation
- Frontend = Preview Images
- Clean separation of concerns

**User Workflow:**
1. Dashboard → Select template
2. Auto-fill from YAML
3. Edit fields
4. Click Compile
5. View PDF preview
6. Download or share

**Key Features:**
- Real template previews
- Auto-fill from YAML
- Live PDF compilation
- Editable form fields
- Professional UI/UX

---

**Made with ❤️ by Cascade AI**
