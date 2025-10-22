import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Menu, Layers } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sectionManagerOpen, setSectionManagerOpen] = useState(false);
  
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
  
  // Use debounced PDF preview hook
  const { 
    loading: pdfLoading, 
    error: pdfError, 
    pdfUrl, 
    lastUpdated,
    triggerPreview,
    clearPreview
  } = useDebouncedPreview(resumeId, resumeData, rendercvTheme, {
    delay: 800,
    enabled: previewMode === 'pdf' && resumeId !== null
  });
  
  // Use download PDF hook
  const { downloading, downloadPDF } = useDownloadPDF();
  
  // Load template data from localStorage if available (from Dashboard template selection)
  useEffect(() => {
    setIsLoading(true);
    
    // Set the selected template based on URL param
    if (templateId) {
      setSelectedTemplateId(templateId);
      
      // Extract theme from URL query params
      const urlParams = new URLSearchParams(window.location.search);
      const themeParam = urlParams.get('template');
      if (themeParam) {
        setRendercvTheme(themeParam);
      }
    }
    
    // Check if there's template data in localStorage
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
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }, 800);
    
    return () => {
      clearTimeout(timer);
      isMounted.current = false;
    };
  }, [templateId]);
  
  // Get the current template object
  const currentTemplate = getTemplateById(selectedTemplateId);
  
  // Handle template change
  const handleTemplateChange = (newTemplateId: string) => {
    setIsLoading(true);
    setSelectedTemplateId(newTemplateId);
    
    // Simulate template loading delay
    setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }, 500);
  };
  
  // Update preview HTML whenever resume data or template changes
  useEffect(() => {
    if (currentTemplate) {
      // Set loading state while generating HTML
      setIsLoading(true);
      
      // Try to load the template from public directory first
      const loadAndProcessTemplate = async () => {
        try {
          // Load the template HTML
          const templateHtml = await TemplateService.loadTemplateHTML(currentTemplate.htmlStructure);
          
          if (templateHtml) {
            // Process the template with data
            const processedHtml = TemplateService.processTemplateWithData(templateHtml, resumeData);
            setPreviewHtml(processedHtml);
          } else {
            // Fall back to generated HTML if loading fails
            const generatedHtml = TemplateService.generateTemplateHTML(currentTemplate, resumeData);
            setPreviewHtml(generatedHtml);
          }
        } catch (error) {
          console.error("Error loading template:", error);
          // Fall back to generated HTML
          const generatedHtml = TemplateService.generateTemplateHTML(currentTemplate, resumeData);
          setPreviewHtml(generatedHtml);
        } finally {
          // Turn off loading state
          setIsLoading(false);
        }
      };
      
      loadAndProcessTemplate();
    }
  }, [resumeData, currentTemplate]);
  
  const handleResumeUpdate = (newData: ResumeData) => {
    setResumeData(newData);
    
    // If we have a resumeId, we can use socket.io to broadcast changes
    if (resumeId) {
      // The LiveCoding component will handle the socket communication
      // We just need to make sure it's included in the component tree
    }
  };
    
    const handleSaveResume = async (generatePdf = false) => {
    try {
      // Show loading state
      setIsLoading(true);
      
      let savedResumeId;
      let pdfUrl;
      
      if (resumeId) {
        // If we're generating PDF along with the save
        if (generatePdf) {
          const result = await apiService.saveResumeWithPDF(resumeId, resumeData, rendercvTheme);
          savedResumeId = resumeId;
          
          // Check if PDF was generated successfully
          if (result.pdf) {
            pdfUrl = result.pdf.url;
            // Trigger preview update
            triggerPreview();
          } else if (result.pdfError) {
            console.error('PDF generation error:', result.pdfError);
          }
        } else {
          // Just update resume without PDF
          await apiService.updateResume(resumeId, resumeData);
          savedResumeId = resumeId;
        }
      } else {
        // Create new resume
        const { resume } = await apiService.createResume(resumeData, templateId || 'modern-professional');
        savedResumeId = resume._id;
        setResumeId(resume._id);
        
        // If we want to generate PDF immediately after creating
        if (generatePdf && savedResumeId) {
          const result = await apiService.saveResumeWithPDF(savedResumeId, resumeData, rendercvTheme);
          if (result.pdf) {
            pdfUrl = result.pdf.url;
            // Trigger preview update
            triggerPreview();
          }
        }
      }
      
      // Hide loading state
      setIsLoading(false);
      
      // Show success message
      if (generatePdf) {
        alert('Resume saved successfully and PDF generated!');
      } else {
        alert('Resume saved successfully!');
      }
      
      return { savedResumeId, pdfUrl };
    } catch (error) {
      console.error('Failed to save resume:', error);
      setIsLoading(false);
      alert('Failed to save resume. Please try again.');
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

    const handleDownloadPdf = async () => {
      if (!resumeId) {
        alert('Please save your resume first before downloading.');
        return;
      }
      
      try {
        if (previewMode === 'pdf') {
          // Use RenderCV download
          await downloadPDF(resumeId, rendercvTheme, `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
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
      <div className="flex h-screen bg-white dark:bg-[#0F1218] text-gray-900 dark:text-gray-100">
        {/* Sidebar - Toggleable */}
        {sidebarOpen && <Sidebar />}
        
        <main className="flex-1 flex flex-col overflow-hidden">
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
            
            <header className="bg-white dark:bg-[#1A1D26] shadow-sm py-3 px-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-4">
                {/* Sidebar Toggle */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
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
                <div className="flex items-center space-x-1 bg-[#252A36] dark:bg-[#121622] rounded-md p-1">
                  <button
                    onClick={() => setPreviewMode('html')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      previewMode === 'html' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    HTML
                  </button>
                  <button
                    onClick={() => setPreviewMode('pdf')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      previewMode === 'pdf' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:text-white'
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
                        onChange={(e) => setRendercvTheme(e.target.value)}
                        className="bg-[#252A36] dark:bg-[#121622] text-white py-1.5 px-3 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                      >
                        <option value="classic">Classic</option>
                        <option value="moderncv">Modern CV</option>
                        <option value="sb2nov">SB2Nov</option>
                        <option value="engineeringresumes">Engineering</option>
                        <option value="engineeringclassic">Engineering Classic</option>
                      </select>
                    </div>
                    
                    {/* Compile Button */}
                    <button
                      onClick={() => {
                        // Save and generate PDF
                        handleSaveResume(true);
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
                          <span>Compiling...</span>
                        </>
                      ) : (
                        <>
                          <span>Compile</span>
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
                      className="bg-[#252A36] dark:bg-[#121622] text-white py-1.5 px-3 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
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
                leftPanel={
                  <div className="h-full overflow-y-auto p-6 relative bg-white dark:bg-[#1A1D26] border-r border-gray-200 dark:border-gray-800">
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
                    />
                  </div>
                }
                rightPanel={
                  <div className="h-full overflow-y-auto p-6 bg-white dark:bg-[#1A1D26]">
                    <div className="sticky top-8">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resume Preview</h2>
                          {previewMode === 'pdf' && lastUpdated && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              Updated {new Date(lastUpdated).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                        
                        {previewMode === 'pdf' ? (
                          // PDF Preview using iframe
                          <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700" style={{ height: '800px' }}>
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
                              <iframe 
                                src={pdfUrl} 
                                className="w-full h-[calc(100vh-250px)] border-0"
                                title="Resume Preview"
                                data-testid="pdf-preview"
                              />
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
                                  <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Click "Save" or "Compile" to generate PDF preview</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          // HTML Preview
                          <LiveResumeViewer 
                            htmlContent={previewHtml} 
                            onDownloadPdf={handleDownloadPdf}
                            isDownloading={downloading}
                            showUpdateIndicator={true}
                          />
                        )}
                    </div>
                  </div>
                }
                defaultLeftWidth={50}
                minLeftWidth={30}
                maxLeftWidth={70}
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
  );
  };

export default ResumeBuilder;