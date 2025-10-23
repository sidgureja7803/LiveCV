# Design Document

## Overview

This design addresses the critical workflow and user experience issues in the Resume Builder application. The solution focuses on creating a proper two-panel layout with real-time synchronization, resizable interface, collapsible sidebar, and seamless backend integration following the workflow: Frontend Form → Backend YAML → RenderCV PDF → Appwrite Storage.

## Architecture

### Component Hierarchy
```
ResumeBuilder (Main Container)
├── Sidebar (Collapsible Navigation)
├── Header (Controls & Status)
├── ResizablePanel (Main Content)
│   ├── FormEditor (Left Panel)
│   │   ├── SectionTabs
│   │   ├── PersonalInfoForm
│   │   ├── ExperienceForm
│   │   ├── EducationForm
│   │   ├── SkillsForm
│   │   └── ProjectsForm
│   └── PreviewPanel (Right Panel)
│       ├── PreviewModeToggle
│       ├── HTMLPreview
│       ├── PDFPreview
│       └── LoadingStates
└── StatusBar (Save Status & Errors)
```

### Data Flow Architecture
```
User Input → Form State → Debounced API Call → Backend Processing → Storage → Preview Update
     ↓              ↓              ↓                    ↓              ↓           ↓
FormEditor → resumeData → saveResume() → YAML Gen → RenderCV → Appwrite → PDF URL
```

## Components and Interfaces

### 1. ResumeBuilder Container
**Purpose**: Main orchestrator component managing layout, state, and data flow

**Key Properties**:
- `resumeData: ResumeData` - Current resume state
- `resumeId: string | null` - Backend resume identifier
- `sidebarVisible: boolean` - Sidebar visibility state
- `panelSizes: { left: number, right: number }` - Panel width percentages
- `previewMode: 'html' | 'pdf'` - Current preview type
- `saveStatus: 'idle' | 'saving' | 'saved' | 'error'` - Save operation status

**Key Methods**:
- `handleResumeUpdate(data: ResumeData)` - Process form changes
- `toggleSidebar()` - Show/hide sidebar
- `handlePanelResize(leftWidth: number)` - Adjust panel sizes
- `saveResumeData()` - Trigger backend save with debouncing

### 2. FormEditor Component
**Purpose**: Left panel containing organized form sections for resume data input

**Structure**:
```typescript
interface FormEditorProps {
  resumeData: ResumeData;
  onDataChange: (data: ResumeData) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}
```

**Sections**:
- Personal Information (name, contact, links)
- Professional Summary (text area)
- Work Experience (dynamic array with add/remove)
- Education (dynamic array with add/remove)
- Skills (tag-based input)
- Projects (dynamic array with add/remove)

### 3. PreviewPanel Component
**Purpose**: Right panel displaying real-time resume preview in HTML or PDF format

**Structure**:
```typescript
interface PreviewPanelProps {
  resumeData: ResumeData;
  previewMode: 'html' | 'pdf';
  pdfUrl?: string;
  loading: boolean;
  error?: string;
  onModeChange: (mode: 'html' | 'pdf') => void;
  onRetry: () => void;
}
```

**Features**:
- HTML preview with live CSS styling
- PDF preview using react-pdf viewer
- Loading states with progress indicators
- Error handling with retry mechanisms
- Zoom controls for PDF viewing

### 4. ResizablePanel Component
**Purpose**: Container managing the draggable divider between form and preview panels

**Structure**:
```typescript
interface ResizablePanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth: number;
  minLeftWidth: number;
  maxLeftWidth: number;
  onResize: (leftWidth: number) => void;
}
```

**Implementation**:
- Mouse drag handling for divider
- Touch support for mobile devices
- Smooth resize animations
- Persistence of user preferences
- Responsive breakpoint handling

## Data Models

### ResumeData Interface
```typescript
interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedIn?: string;
    github?: string;
  };
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  projects: ProjectEntry[];
}

interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  liveLink?: string;
}
```

### API Response Models
```typescript
interface SaveResumeResponse {
  success: boolean;
  resumeId: string;
  yamlUrl?: string;
  pdfUrl?: string;
  error?: string;
}

interface GeneratePDFResponse {
  success: boolean;
  pdfUrl: string;
  error?: string;
}
```

## Error Handling

### Error Categories
1. **Network Errors**: Connection failures, timeouts
2. **Validation Errors**: Invalid form data, missing required fields
3. **PDF Generation Errors**: RenderCV service failures
4. **Storage Errors**: Appwrite upload/retrieval failures

### Error Handling Strategy
```typescript
interface ErrorState {
  type: 'network' | 'validation' | 'pdf' | 'storage';
  message: string;
  retryable: boolean;
  field?: string; // For validation errors
}
```

**Implementation**:
- Toast notifications for temporary errors
- Inline field validation for form errors
- Retry mechanisms for network failures
- Graceful degradation for PDF preview failures
- Auto-save draft data to prevent loss

## Testing Strategy

### Unit Tests
- Form validation logic
- Data transformation functions
- Error handling utilities
- Component state management

### Integration Tests
- Form-to-preview synchronization
- API call sequences
- Panel resizing behavior
- Sidebar toggle functionality

### End-to-End Tests
- Complete resume creation workflow
- PDF generation and download
- Cross-browser compatibility
- Mobile responsiveness

### Performance Tests
- Debounced API calls efficiency
- Large resume data handling
- PDF rendering performance
- Memory usage optimization

## Implementation Phases

### Phase 1: Layout Foundation
- Fix ResizablePanel component
- Implement proper sidebar toggle
- Establish correct component hierarchy
- Set up responsive design system

### Phase 2: Form System
- Restructure FormEditor with proper sections
- Implement dynamic array management
- Add form validation and error display
- Create reusable form components

### Phase 3: Preview System
- Fix PreviewPanel with proper mode switching
- Implement PDF viewer with controls
- Add loading states and error handling
- Optimize preview update performance

### Phase 4: Backend Integration
- Implement debounced auto-save
- Fix API call sequences
- Add proper error handling
- Implement retry mechanisms

### Phase 5: Polish & Optimization
- Add animations and transitions
- Implement user preference persistence
- Optimize performance and memory usage
- Add comprehensive error recovery