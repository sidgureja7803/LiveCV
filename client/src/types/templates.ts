export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'modern' | 'classic';
  thumbnail: string;
  pdfPreview: string;
  htmlStructure: string;
  cssStyles: string;
  features: string[];
  recommended: string[];
}

export interface TemplateConfig {
  templates: ResumeTemplate[];
  defaultTemplate: string;
}

export interface TemplatePreviewProps {
  template: ResumeTemplate;
  resumeData?: any;
  scale?: number;
} 