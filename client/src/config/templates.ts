import type { ResumeTemplate, TemplateConfig } from '../types/templates';

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech and business professionals',
    category: 'modern',
    thumbnail: '/images/template1.png',
    pdfPreview: '/images/template1.png',
    htmlStructure: 'moderncv',
    cssStyles: 'moderncv.css',
    features: ['ATS-Optimized', 'Clean Layout', '+1 more'],
    recommended: ['Software Engineers', 'Product Managers', 'Tech Professionals']
  },
  {
    id: 'professional-elegant',
    name: 'Professional Elegant',
    description: 'Sophisticated and elegant layout with refined typography',
    category: 'professional',
    thumbnail: '/images/template2.png',
    pdfPreview: '/images/template2.png',
    htmlStructure: 'classic',
    cssStyles: 'classic.css',
    features: ['Elegant Design', 'Professional Typography', '+1 more'],
    recommended: ['Business Professionals', 'Finance', 'Management']
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Eye-catching design that showcases creativity and visual skills',
    category: 'creative',
    thumbnail: '/images/template3.png',
    pdfPreview: '/images/template3.png',
    htmlStructure: 'sb2nov',
    cssStyles: 'sb2nov.css',
    features: ['Visual Impact', 'Portfolio Section', '+1 more'],
    recommended: ['Designers', 'Artists', 'Marketing']
  },
  {
    id: 'engineering-classic',
    name: 'Engineering Classic',
    description: 'Traditional academic and engineering focused resume template',
    category: 'professional',
    thumbnail: '/images/template4.png',
    pdfPreview: '/images/template4.png',
    htmlStructure: 'engineeringclassic',
    cssStyles: 'engineeringclassic.css',
    features: ['Academic Focus', 'Publications Ready', '+1 more'],
    recommended: ['Engineers', 'Researchers', 'PhD Candidates']
  },
  {
    id: 'engineering-resumes',
    name: 'Engineering Resumes',
    description: 'Specialized template optimized for engineering positions',
    category: 'modern',
    thumbnail: '/images/template5.png',
    pdfPreview: '/images/template5.png',
    htmlStructure: 'engineeringresumes',
    cssStyles: 'engineeringresumes.css',
    features: ['Technical Projects', 'Skills Highlighted', '+1 more'],
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