import type { ResumeTemplate, TemplateConfig } from '../types/templates';

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'moderncv',
    name: 'ModernCV Resume',
    description: 'A CV/resume theme of RenderCV',
    category: 'modern',
    thumbnail: '/images/John_Doe_ModerncvTheme_CV.png',
    pdfPreview: '/templates/John_Doe_ModerncvTheme_CV.pdf',
    htmlStructure: 'moderncv',
    cssStyles: 'moderncv.css',
    features: ['ATS-Optimized', 'Clean Layout', 'Professional Typography'],
    recommended: ['Software Engineers', 'Product Managers', 'Tech Professionals']
  },
  {
    id: 'classic',
    name: 'RenderCV Resume',
    description: 'A CV/resume theme of RenderCV',
    category: 'professional',
    thumbnail: '/images/John_Doe_ClassicTheme_CV.png',
    pdfPreview: '/templates/John_Doe_ClassicTheme_CV.pdf',
    htmlStructure: 'classic',
    cssStyles: 'classic.css',
    features: ['Elegant Design', 'Professional Typography', 'Classic Style'],
    recommended: ['Business Professionals', 'Finance', 'Management']
  },
  {
    id: 'sb2nov',
    name: 'TechPro Resume',
    description: 'A modern resume template for tech professionals',
    category: 'modern',
    thumbnail: '/images/John_Doe_Sb2novTheme_CV.png',
    pdfPreview: '/templates/John_Doe_Sb2novTheme_CV.pdf',
    htmlStructure: 'sb2nov',
    cssStyles: 'sb2nov.css',
    features: ['Modern Design', 'Tech Focused', 'Compact Layout'],
    recommended: ['Developers', 'Tech Leads', 'Engineers']
  },
  {
    id: 'engineeringclassic',
    name: 'Deedy Resume',
    description: 'Professional Resume for Engineering Students',
    category: 'professional',
    thumbnail: '/images/John_Doe_EngineeringclassicTheme_CV.png',
    pdfPreview: '/templates/John_Doe_EngineeringclassicTheme_CV.pdf',
    htmlStructure: 'engineeringclassic',
    cssStyles: 'engineeringclassic.css',
    features: ['Academic Focus', 'Publications Ready', 'Research Oriented'],
    recommended: ['Engineers', 'Researchers', 'PhD Candidates']
  },
  {
    id: 'engineeringresumes',
    name: 'Engineering Resume',
    description: 'Specialized template optimized for engineering positions',
    category: 'modern',
    thumbnail: '/images/John_Doe_EngineeringresumesTheme_CV.png',
    pdfPreview: '/templates/John_Doe_EngineeringresumesTheme_CV.pdf',
    htmlStructure: 'engineeringresumes',
    cssStyles: 'engineeringresumes.css',
    features: ['Technical Projects', 'Skills Highlighted', 'Clean Format'],
    recommended: ['Software Engineers', 'Hardware Engineers', 'Technical Roles']
  }
];

export const TEMPLATE_CONFIG: TemplateConfig = {
  templates: RESUME_TEMPLATES,
  defaultTemplate: 'modern-professional'
};

export const getTemplateById = (id: string): ResumeTemplate | undefined => {
  return RESUME_TEMPLATES.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): ResumeTemplate[] => {
  return RESUME_TEMPLATES.filter(template => template.category === category);
}; 