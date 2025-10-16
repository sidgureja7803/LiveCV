export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  htmlStructure: string;
}

export interface ResumeData {
  id?: string;
  templateId?: string;
  userId?: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    title?: string;
    linkedIn?: string;
    github?: string;
    website?: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  liveLink?: string;
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  text: string; // Raw text content for the ATS analysis
}

export interface ATSScore {
  overallScore: number;
  keywordMatches: number;
  totalKeywords: number;
  suggestions: string[];
  missingSkills: string[];
} 