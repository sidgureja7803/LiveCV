import type { ResumeTemplate, TemplateConfig } from '../types/templates';

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech and business professionals',
    category: 'modern',
    thumbnail: '/images/template1.png',
    pdfPreview: '/images/template1.png',
    htmlStructure: 'modern-professional',
    cssStyles: 'modern-professional.css',
    features: ['ATS-Optimized', 'Clean Layout', 'Modern Typography'],
    recommended: ['Software Engineers', 'Product Managers', 'Consultants']
  },
  {
    id: 'professional-elegant',
    name: 'Professional Elegant',
    description: 'Sophisticated and elegant layout with refined typography',
    category: 'professional',
    thumbnail: '/images/template2.png',
    pdfPreview: '/images/template2.png',
    htmlStructure: 'professional-elegant',
    cssStyles: 'professional-elegant.css',
    features: ['Elegant Design', 'Professional Typography', 'ATS-Friendly'],
    recommended: ['Business Professionals', 'Finance Specialists', 'Consultants']
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Eye-catching design that showcases creativity and visual skills',
    category: 'creative',
    thumbnail: '/images/template3.png',
    pdfPreview: '/images/template3.png',
    htmlStructure: 'creative-portfolio',
    cssStyles: 'creative-portfolio.css',
    features: ['Visual Impact', 'Portfolio Section', 'Creative Layout'],
    recommended: ['Designers', 'Artists', 'Marketing Professionals']
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