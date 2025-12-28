import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Menu, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ResumeEditor from '../components/ResumeEditor';
import LiveResumeViewer from '../components/LiveResumeViewer';
import LiveCoding from '../components/LiveCoding';
import ResumeToolbar from '../components/ResumeToolbar';
import ResizablePanel from '../components/ResizablePanel';
import SectionManager from '../components/SectionManager';
import { getTemplateById, RESUME_TEMPLATES } from '../config/templates';
import { TemplateService } from '../services/templateService';
import { apiService } from '../services/api';
import { useDebouncedPreview, useDownloadPDF } from '../hooks/useDebouncedPreview';
import type { ResumeData } from '../types';
import type { ResumeTemplate } from '../types/templates';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorBoundary from '../components/ErrorBoundary';
import { parseRenderCVYaml } from '../utils/yamlParser';
import { Document, Page, pdfjs } from 'react-pdf';

// Set PDF.js worker path - using local worker file
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.js';

// Section interface matching ResumeToolbar's requirements
interface Section {
  id: string;
  name: string;
  type: 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';
  visible: boolean;
  order: number;
}

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    address: 'New York, NY',
    linkedIn: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe'
  },
  summary: 'Experienced software engineer with 5+ years of experience in full-stack development...',
  experience: [
    {
      id: '1',
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      startDate: '2021-01',
      endDate: '2024-01',
      current: false,
      description: 'Led development of microservices architecture...'
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2016-09',
      endDate: '2020-05',
      gpa: '3.8'
    }
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'Python'],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Built a full-stack e-commerce platform using React and Node.js',
      technologies: ['React', 'Node.js', 'MongoDB'],
      githubLink: 'github.com/johndoe/ecommerce',
      liveLink: 'example.com'
    }
  ]
};

const ResumeBuilder: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [availableTemplates, setAvailableTemplates] = useState<ResumeTemplate[]>(RESUME_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templateId || 'modern-professional');
  const [rendercvTheme, setRendercvTheme] = useState<string>('classic');
  const [previewMode, setPreviewMode] = useState<'pdf' | 'html'>('pdf');
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('resumeBuilder_sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [sectionManagerOpen, setSectionManagerOpen] = useState(false);
  
  // PDF viewer state
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const [pdfWidth, setPdfWidth] = useState<number>(600);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  
  // Panel size state
  const [panelSizes, setPanelSizes] = useState({ left: 50, right: 50 });
  
  // Section management state
  const [sections, setSections] = useState<Section[]>([
    { id: 'personal', name: 'Personal Information', type: 'personal', visible: true, order: 0 },
    { id: 'summary', name: 'Professional Summary', type: 'summary', visible: true, order: 1 },
    { id: 'experience', name: 'Work Experience', type: 'experience', visible: true, order: 2 },
    { id: 'education', name: 'Education', type: 'education', visible: true, order: 3 },
    { id: 'skills', name: 'Skills', type: 'skills', visible: true, order: 4 },
    { id: 'projects', name: 'Projects', type: 'projects', visible: true, order: 5 },
  ]);
  
  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);
  
  // Use debounced PDF preview hook - enable automatic preview
  const { 
    loading: pdfLoading, 
    error: pdfError, 
    pdfUrl, 
    lastUpdated,
    triggerPreview,
    clearPreview
  } = useDebouncedPreview(resumeId, resumeData, rendercvTheme, {
    delay: 1500, // Increased delay to reduce API calls while still providing live updates
    enabled: true // Enable automatic preview for live updates
  });
  
  // Use download PDF hook
  const { downloading, downloadPDF } = useDownloadPDF();
  
  // Load template data from localStorage if available (from Dashboard template selection)
  useEffect(() => {
    console.log('🔄 ResumeBuilder mounting, templateId:', templateId);
    
    // Set a timeout to ensure loading state is cleared
    const immediateLoadingTimer = setTimeout(() => {
      setIsLoading(false);
      console.log('✅ ResumeBuilder initial load complete');
    }, 100);
    
    // Set the selected template based on URL param
    if (templateId) {
      setSelectedTemplateId(templateId);
      setRendercvTheme(templateId); // Use template ID as theme
      
      // Check if template YAML was loaded
      const templateYaml = localStorage.getItem('selectedTemplateYaml');
      const templateTheme = localStorage.getItem('selectedTemplateTheme');
      
      if (templateYaml) {
        console.log('✅ Loading template YAML from localStorage');
        
        try {
          // Parse YAML to ResumeData
          const parsedData = parseRenderCVYaml(templateYaml);
          
          if (parsedData && Object.keys(parsedData).length > 0) {
            console.log('📋 Parsed template data:', parsedData);
            setResumeData(prev => ({
              ...prev,
              ...parsedData
            }));
            
            if (templateTheme) {
              setRendercvTheme(templateTheme);
            }
            
            console.log('✅ Template data loaded successfully');
          } else {
            console.warn('⚠️ Parsed data is empty, using default data');
          }
          
          // Clear localStorage after loading
          localStorage.removeItem('selectedTemplateYaml');
          localStorage.removeItem('selectedTemplateTheme');
        } catch (error) {
          console.error('❌ Error parsing template YAML:', error);
          // Use default data if parsing fails
          console.log('Using default resume data due to parsing error');
        }
      }
    }
    
    // Check if there's template data in localStorage (legacy support)
    const templateDataStr = localStorage.getItem('templateData');
    if (templateDataStr) {
      try {
        const templateData = JSON.parse(templateDataStr);
        console.log('📄 Loading template data from localStorage:', templateData);
        
        // Convert YAML data to ResumeData format
        if (templateData.yamlData && templateData.yamlData.cv) {
          const yamlCV = templateData.yamlData.cv;
          
          const convertedData: ResumeData = {
            personalInfo: {
              fullName: yamlCV.name || 'John Doe',
              email: yamlCV.email || 'email@example.com',
              phone: yamlCV.phone || '',
              address: yamlCV.location || '',
              linkedIn: yamlCV.social_networks?.find((n: any) => n.network === 'LinkedIn')?.username || '',
              github: yamlCV.social_networks?.find((n: any) => n.network === 'GitHub')?.username || ''
            },
            summary: '',
            experience: yamlCV.sections?.experience?.map((exp: any, index: number) => ({
              id: String(index + 1),
              company: exp.company || '',
              position: exp.position || '',
              startDate: exp.start_date || '',
              endDate: exp.end_date || exp.date || '',
              current: exp.end_date === 'present',
              description: exp.highlights?.join('\n• ') || exp.summary || ''
            })) || [],
            education: yamlCV.sections?.education?.map((edu: any, index: number) => ({
              id: String(index + 1),
              institution: edu.institution || '',
              degree: edu.degree || '',
              fieldOfStudy: edu.area || '',
              startDate: edu.start_date || '',
              endDate: edu.end_date || edu.date || '',
              gpa: edu.highlights?.find((h: string) => h.includes('GPA'))?.match(/\d\.\d/)?.[0] || ''
            })) || [],
            skills: yamlCV.sections?.skills?.flatMap((s: any) => 
              s.details ? s.details.split(',').map((skill: string) => skill.trim()) : []
            ) || [],
            projects: yamlCV.sections?.projects?.map((proj: any, index: number) => ({
              id: String(index + 1),
              name: proj.name || '',
              description: proj.summary || proj.highlights?.join(' ') || '',
              technologies: [],
              githubLink: proj.highlights?.find((h: string) => h.includes('GitHub')) || '',
              liveLink: ''
            })) || []
          };
          
          console.log('✅ Converted YAML data to ResumeData:', convertedData);
          setResumeData(convertedData);
          
          // Set the theme
          if (templateData.theme) {
            setRendercvTheme(templateData.theme);
          }
        }
        
        // Clear the localStorage after loading
        localStorage.removeItem('templateData');
      } catch (error) {
        console.error('❌ Error loading template data:', error);
      }
    }
    
    return () => {
      clearTimeout(immediateLoadingTimer);
    };
  }, [templateId]); // Removed isLoading from dependencies to prevent infinite loop
  
  // Get the current template object
  const currentTemplate = getTemplateById(selectedTemplateId);
  const selectedTemplate = currentTemplate; // Alias for compatibility
  
  // Don't automatically trigger preview when switching modes
  // User must click "Compile" button to generate PDF
  
  // Handle template change
  const handleTemplateChange = (newTemplateId: string) => {
    setSelectedTemplateId(newTemplateId);
    console.log('📝 Template changed to:', newTemplateId);
  };
  
  // Update preview HTML whenever resume data or template changes
  useEffect(() => {
    if (currentTemplate && previewMode === 'html') {
      // Generate HTML directly without trying to load from public directory
      const loadAndProcessTemplate = async () => {
        try {
          // Generate HTML directly
          const generatedHtml = TemplateService.generateTemplateHTML(currentTemplate, resumeData);
          setPreviewHtml(generatedHtml);
          console.log('✅ HTML preview generated');
        } catch (error) {
          console.error("Error generating template:", error);
          // Set empty HTML as fallback
          setPreviewHtml('<div>Error generating preview</div>');
        }
      };
      
      loadAndProcessTemplate();
    } else if (previewMode === 'pdf') {
      // When in PDF mode, we depend on the useDebouncedPreview hook
      // to automatically update the PDF preview when resumeData changes
      console.log('📄 PDF mode active - automatic preview updates enabled');
    }
  }, [resumeData, currentTemplate, previewMode]);
  
  // Calculate PDF width based on container size
  useEffect(() => {
    const updatePdfWidth = () => {
      if (pdfContainerRef.current) {
        const containerWidth = pdfContainerRef.current.offsetWidth;
        // Set PDF width to 90% of container width, max 800px
        const newWidth = Math.min(containerWidth * 0.9, 800);
        setPdfWidth(newWidth);
      }
    };
    
    updatePdfWidth();
    window.addEventListener('resize', updatePdfWidth);
    
    return () => window.removeEventListener('resize', updatePdfWidth);
  }, [sidebarOpen, panelSizes]);
  
  // Auto-save functionality with debouncing
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const debouncedAutoSave = useCallback(async (data: ResumeData) => {
    if (!resumeId) return; // Only auto-save existing resumes
    
    setSaveStatus('saving');
    
    try {
      await apiService.updateResume(resumeId, data);
      setSaveStatus('saved');
      
      // Reset to idle after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('error');
      
      // Reset to idle after 5 seconds
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  }, [resumeId]);

  const handleResumeUpdate = (newData: ResumeData) => {
    setResumeData(newData);
    
    // Clear existing auto-save timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Set new auto-save timeout (2 seconds after user stops typing)
    autoSaveTimeoutRef.current = setTimeout(() => {
      debouncedAutoSave(newData);
    }, 2000);
    
    // If we have a resumeId, we can use socket.io to broadcast changes
    if (resumeId) {
      // The LiveCoding component will handle the socket communication
      // We just need to make sure it's included in the component tree
    }
    
    // For PDF preview mode, the useDebouncedPreview hook will automatically
    // trigger updates thanks to the enabled: true setting
    // No need to manually trigger preview here
  };
    
    const handleSaveResume = async (generatePdf = false) => {
    try {
      let savedResumeId = resumeId;
      
      // Only save to backend if we have valid data and want to persist
      if (!generatePdf || resumeId) {
        if (resumeId) {
          // Update existing resume
          await apiService.updateResume(resumeId, resumeData);
          savedResumeId = resumeId;
        } else {
          // Create new resume
          try {
            const { resume } = await apiService.createResume(resumeData, templateId || 'classic');
            savedResumeId = resume._id;
            setResumeId(resume._id);
          } catch (error) {
            console.warn('Failed to save to backend, continuing with local preview:', error);
            // Continue without saving - we can still generate preview
          }
        }
      }
      
      // Always trigger preview when requested (works with or without backend)
      if (generatePdf) {
        // Update resumeId if we got one from save
        if (savedResumeId && !resumeId) {
          setResumeId(savedResumeId);
        }
        // Trigger preview immediately
        triggerPreview();
      }
      
      // Show success message
      if (generatePdf) {
        console.log('PDF generation triggered!');
      } else {
        console.log('Resume saved successfully!');
      }
      
      return { savedResumeId };
    } catch (error) {
      console.error('Failed to save resume:', error);
      
      // Still try to generate preview even if save failed
      if (generatePdf) {
        console.log('Save failed, but generating preview anyway...');
        triggerPreview();
      } else {
        alert('Failed to save resume. Please try again.');
      }
      
      return { error };
    }
  };
    
    const handleReorderSections = (reorderedSections: typeof sections) => {
    setSections(reorderedSections);
    // TODO: Apply reordering to actual resume data
    console.log('Sections reordered:', reorderedSections);
  };
    
    const handleToggleSectionVisibility = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, visible: !section.visible }
        : section
    ));
    // TODO: Apply visibility changes to resume rendering
    console.log('Section visibility toggled:', sectionId);
  };

  const handleAddSection = (sectionType: string) => {
    // Make sure type is valid for Section type
    const validSectionType = sectionType as any; 
    
    const newSection: Section = {
      id: `${sectionType}-${Date.now()}`,
      name: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
      type: validSectionType,
      visible: true,
      order: sections.length
    };
    setSections(prev => [...prev, newSection]);
    console.log('Section added:', newSection);
  };

  const handleRemoveSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
    console.log('Section removed:', sectionId);
  };

  const handlePanelResize = (leftWidth: number) => {
    setPanelSizes({ left: leftWidth, right: 100 - leftWidth });
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('resumeBuilder_sidebarOpen', JSON.stringify(newState));
  };

    const handleDownloadPdf = async () => {
      try {
        if (previewMode === 'pdf') {
          // Use RenderCV download - works with or without resumeId
          if (resumeId) {
            // If we have a saved resume, download using the ID
            await downloadPDF(resumeId, rendercvTheme, `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
          } else {
            // If no saved resume, generate PDF from current data
            const apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
            const url = `${apiBaseUrl}/api/render/generate`;
            
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
              },
              body: JSON.stringify({
                resumeData,
                theme: rendercvTheme,
                fileName: `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
              })
            });
            
            if (!response.ok) {
              throw new Error('Failed to generate PDF for download');
            }
            
            const pdfBlob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            a.remove();
          }
        } else {
          // Legacy HTML to PDF
          if (!previewHtml) {
            alert('Resume content is not available to generate PDF.');
            return;
          }
          const pdfBlob = await apiService.generatePdf(previewHtml);
          const url = window.URL.createObjectURL(pdfBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${resumeData.personalInfo.fullName.replace(' ', '_')}_Resume.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        }
      } catch (error) {
        console.error('Failed to download PDF:', error);
        alert('Failed to download PDF. Please try again.');
      }
    };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar - Toggleable with smooth transition */}
        {sidebarOpen && (
          <div className="w-64 flex-shrink-0 transition-all duration-300 ease-in-out">
            <Sidebar />
          </div>
        )}
        
        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? '' : 'w-full'}`}>
            {isLoading && <LoadingOverlay message="Loading resume template..." />}
            
            {/* Professional Toolbar */}
            <ResumeToolbar
              onDownload={handleDownloadPdf}
              onSave={handleSaveResume}
              downloading={downloading}
              saving={isLoading}
              sections={sections}
              onReorderSections={handleReorderSections}
              onToggleSectionVisibility={handleToggleSectionVisibility}
            />
            
            <header className="bg-white dark:bg-gray-800 shadow-sm py-3 px-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                {/* Sidebar Toggle */}
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title={sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
                >
                  <Menu className="w-5 h-5" />
                </button>

                <h1 className="text-xl font-bold">Resume Builder</h1>

                {/* Section Manager Button */}
                <button
                  onClick={() => setSectionManagerOpen(true)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
                  title="Manage Sections"
                >
                  <Layers className="w-4 h-4" />
                  <span>Sections</span>
                </button>
                
                {/* Preview Mode Toggle */}
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-md p-1">
                  <button
                    onClick={() => setPreviewMode('html')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      previewMode === 'html' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    HTML
                  </button>
                  <button
                    onClick={() => setPreviewMode('pdf')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      previewMode === 'pdf' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    PDF
                  </button>
                </div>
                
                {/* RenderCV Theme selector (for PDF mode) */}
                {previewMode === 'pdf' && (
                  <>
                    <div className="relative">
                      <select 
                        value={rendercvTheme}
                        onChange={(e) => {
                          setRendercvTheme(e.target.value);
                          // Force a new PDF preview with the updated theme
                          setTimeout(() => triggerPreview(), 100);
                        }}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-1.5 px-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                      >
                        <option value="classic">Classic</option>
                        <option value="moderncv">Modern CV</option>
                        <option value="sb2nov">SB2Nov</option>
                        <option value="engineeringresumes">Engineering</option>
                        <option value="engineeringclassic">Engineering Classic</option>
                      </select>
                    </div>
                    
                    {/* Update PDF Button */}
                    <button
                      onClick={() => {
                        // Force regenerate PDF preview
                        triggerPreview();
                      }}
                      disabled={pdfLoading}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {pdfLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <span>Update PDF</span>
                        </>
                      )}
                    </button>
                  </>
                )}
                
                {/* HTML Template selector (for HTML mode) */}
                {previewMode === 'html' && (
                  <div className="relative">
                    <select 
                      value={selectedTemplateId}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-1.5 px-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                    >
                      {availableTemplates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {pdfLoading && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                )}
              </div>
            </header>
            
            {/* Resizable Panels */}
            <div className="flex-1 flex overflow-hidden">
              <ResizablePanel
                defaultLeftWidth={50}
                minLeftWidth={30}
                maxLeftWidth={70}
                onResize={handlePanelResize}
                leftPanel={
                  <div className="h-full overflow-y-auto p-6 relative bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    {/* LiveCoding component to enable collaborative editing */}
                    {resumeId && (
                      <LiveCoding 
                        resumeId={resumeId}
                        onResumeUpdate={(data) => setResumeData(data as ResumeData)}
                      />
                    )}
                    
                    <div className="mb-4 ml-1">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Resume Editor</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Fill in your details below.</p>
                    </div>
                    
                    <ResumeEditor 
                      resumeData={resumeData} 
                      onResumeChange={handleResumeUpdate}
                      previewHtml={previewHtml}
                      sections={sections}
                    />
                  </div>
                }
                rightPanel={
                  <div className="h-full flex flex-col bg-white dark:bg-gray-800">
                    {/* Preview Header - Fixed */}
                    <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resume Preview</h2>
                          <div className="flex items-center space-x-3">
                            {previewMode === 'pdf' && lastUpdated && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                Updated {new Date(lastUpdated).toLocaleTimeString()}
                              </span>
                            )}
                            {/* Save Status Indicator */}
                            {saveStatus !== 'idle' && (
                              <div className={`flex items-center space-x-2 ${
                                saveStatus === 'saving' ? 'text-yellow-600 dark:text-yellow-400' :
                                saveStatus === 'saved' ? 'text-green-600 dark:text-green-400' :
                                'text-red-600 dark:text-red-400'
                              }`}>
                                {saveStatus === 'saving' && (
                                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                )}
                                {saveStatus === 'saved' && (
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                {saveStatus === 'error' && (
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                                <span className="text-sm">
                                  {saveStatus === 'saving' && 'Saving...'}
                                  {saveStatus === 'saved' && 'Saved'}
                                  {saveStatus === 'error' && 'Save failed'}
                                </span>
                              </div>
                            )}
                            
                            {pdfLoading && (
                              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span className="text-sm">Generating...</span>
                              </div>
                            )}
                          </div>
                        </div>
                    </div>
                    
                    {/* Preview Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6">
                        
                        {previewMode === 'pdf' ? (
                          // PDF Preview with responsive design
                          <div ref={pdfContainerRef} className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 min-h-[600px] h-full w-full">
                            {pdfError && (
                              <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 rounded-lg mb-4">
                                <p className="font-bold">PDF Generation Error</p>
                                <p className="text-sm">{pdfError}</p>
                                <button 
                                  onClick={triggerPreview}
                                  className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                                >
                                  Retry
                                </button>
                              </div>
                            )}
                            
                            {pdfUrl ? (
                              <div className="flex flex-col items-center justify-center w-full">
                                <Document
                                  file={pdfUrl}
                                  onLoadSuccess={({ numPages }) => {
                                    setNumPages(numPages);
                                    setPageNumber(1); // Reset to first page when new PDF loads
                                  }}
                                  onLoadError={(error) => {
                                    console.error('Error loading PDF:', error);
                                  }}
                                  loading={
                                    <div className="flex flex-col items-center justify-center p-12 h-[300px]">
                                      <div className="w-10 h-10 rounded-full border-4 border-gray-300 border-t-indigo-500 animate-spin mb-4"></div>
                                      <p className="text-gray-500 dark:text-gray-400">Loading PDF...</p>
                                    </div>
                                  }
                                  error={
                                    <div className="flex flex-col items-center justify-center p-12 h-[300px]">
                                      <p className="text-red-500">Failed to load PDF. Try again.</p>
                                      <button 
                                        onClick={triggerPreview}
                                        className="mt-4 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
                                      >
                                        Retry
                                      </button>
                                    </div>
                                  }
                                >
                                  <div 
                                    style={{ 
                                      transform: `scale(${pdfZoom / 100})`, 
                                      transformOrigin: 'top center',
                                      transition: 'transform 0.2s ease-in-out'
                                    }}
                                    className="bg-white shadow-xl rounded-lg overflow-hidden"
                                  >
                                    <Page 
                                      pageNumber={pageNumber} 
                                      width={pdfWidth}
                                      renderTextLayer={false}
                                      renderAnnotationLayer={false}
                                    />
                                  </div>
                                </Document>
                                
                                {/* Page navigation */}
                                {numPages && numPages > 1 && (
                                  <div className="flex items-center justify-center mt-4 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                                    <button
                                      onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                                      disabled={pageNumber <= 1}
                                      className="p-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                      aria-label="Previous page"
                                    >
                                      <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    
                                    <span className="mx-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Page {pageNumber} of {numPages}
                                    </span>
                                    
                                    <button
                                      onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                                      disabled={pageNumber >= numPages}
                                      className="p-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                      aria-label="Next page"
                                    >
                                      <ChevronRight className="w-5 h-5" />
                                    </button>
                                  </div>
                                )}
                                
                                {/* Display last update time for PDF */}
                                {lastUpdated && (
                                  <div className="text-center mt-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                      Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                                    </span>
                                  </div>
                                )}
                                
                                {/* Zoom controls */}
                                <div className="flex items-center justify-center mt-2 space-x-3">
                                  <button
                                    onClick={() => setPdfZoom(prev => Math.max(prev - 10, 50))}
                                    disabled={pdfZoom <= 50}
                                    className="p-1 text-xs bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                                    aria-label="Zoom out"
                                  >
                                    -
                                  </button>
                                  
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {pdfZoom}%
                                  </span>
                                  
                                  <button
                                    onClick={() => setPdfZoom(prev => Math.min(prev + 10, 200))}
                                    disabled={pdfZoom >= 200}
                                    className="p-1 text-xs bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                                    aria-label="Zoom in"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ) : pdfLoading ? (
                              <div className="flex flex-col items-center justify-center p-12 h-[600px] bg-gray-50 dark:bg-gray-900">
                                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                                  <svg className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Generating PDF preview...</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center p-12 h-[600px] bg-gray-50 dark:bg-gray-900">
                                <div className="text-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">PDF preview will appear here</p>
                                  <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">Make changes to see live updates</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          // HTML Preview
                          <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                            <LiveResumeViewer 
                              htmlContent={previewHtml} 
                              onDownloadPdf={handleDownloadPdf}
                              isDownloading={downloading}
                              showUpdateIndicator={true}
                            />
                          </div>
                        )}
                    </div>
                  </div>
                }
              />
            </div>
            
            {/* Section Manager Modal */}
            <SectionManager
              sections={sections}
              onReorder={handleReorderSections}
              onToggleVisibility={handleToggleSectionVisibility}
              onAddSection={handleAddSection}
              onRemoveSection={handleRemoveSection}
              isOpen={sectionManagerOpen}
              onClose={() => setSectionManagerOpen(false)}
            />
        </main>
    </div>
    </ErrorBoundary>
  );
  };

export default ResumeBuilder;