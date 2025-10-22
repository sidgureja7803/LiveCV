import { ResumeData } from '../types';

/**
 * API Service for LiveCV
 * Handles communication with the backend server
 */

// Check for both API URL environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';
console.log('[API Service] Using API URL:', API_BASE_URL);

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  endpoints: {
    atsScore: '/api/ats/score',
    generatePdf: '/api/resume/generate-pdf',
    // Resume endpoints
    createResume: '/api/resume',
    updateResume: (id: string) => `/api/resume/${id}`,
    getResume: (id: string) => `/api/resume/${id}`,
    getUserResumes: '/api/resume/user/all',
    // User endpoints
    getUserProfile: '/api/user/profile',
    updateUserProfile: '/api/user/profile',
    // GitHub integration
    connectGithub: '/api/user/github/connect',
    disconnectGithub: '/api/user/github/disconnect',
    getGithubProfile: (username: string) => `/api/user/github/${username}`,
  }
};

export interface ATSScoreRequest {
  resumeText: string;
  jobDescriptionText?: string;
  templateName?: string;
}

export interface ATSScoreResponse {
  score: number;
  feedback: string[];
  metadata: {
    timestamp: string;
    requestId: string;
    analysis: {
      wordCount: number;
      sectionsFound: number;
      totalSections: number;
      rawScore: number;
      maxPossible: number;
    };
  };
}

export interface GeneratePdfRequest {
  html: string;
  fileName: string;
}

export interface GeneratePdfResponse {
  success: boolean;
  url: string;
  data: {
    fileName: string;
    pdfUrl: string;
    s3Key: string;
    s3Bucket: string;
    fileSize: number;
    uploadedAt: string;
  };
  metadata: {
    requestId: string;
    processingTime: {
      total: number;
      pdfGeneration: number;
      s3Upload: number;
    };
    timestamp: string;
  };
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      console.log(`[API] ${options.method || 'GET'} ${url}`);
      const response = await fetch(url, { ...defaultOptions, ...options });

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorData?.error || `HTTP ${response.status}: ${response.statusText}`;
          console.error(`[API Error] ${response.status}:`, errorData);
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          console.error(`[API Error] ${response.status}: Could not parse error response`);
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error(`[API] Request failed to ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Calculate ATS score for resume
   */
  async calculateATSScore(request: ATSScoreRequest): Promise<ATSScoreResponse> {
    return this.makeRequest<ATSScoreResponse>(
      API_CONFIG.endpoints.atsScore,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  /**
   * Generate PDF from HTML
   */
  async generatePdf(html: string, fileName?: string): Promise<Blob> {
    const request = {
      html,
      fileName: fileName || 'resume.pdf'
    };
    
    const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.generatePdf}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate PDF: ${response.statusText}`);
    }
    
    return response.blob();
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      // Try to make a simple request to see if the API is responsive
      const response = await fetch(`${this.baseUrl}/api/ats-score`, {
        method: 'OPTIONS',
      });
      
      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Resume methods
  async createResume(resumeData: ResumeData, templateId?: string): Promise<{ resume: ResumeData & { _id: string } }> {
    return this.makeRequest(API_CONFIG.endpoints.createResume, {
      method: 'POST',
      body: JSON.stringify({ resumeData, templateId }),
    });
  }

  async updateResume(id: string, resumeData: ResumeData): Promise<{ resume: ResumeData }> {
    return this.makeRequest(API_CONFIG.endpoints.updateResume(id), {
      method: 'PUT',
      body: JSON.stringify(resumeData),
    });
  }
  
  /**
   * Save resume and generate PDF
   * @param id Resume ID
   * @param resumeData Resume data
   * @param theme Optional theme name
   * @returns Resume data and PDF info
   */
  async saveResumeWithPDF(id: string, resumeData: ResumeData, theme?: string): Promise<{ 
    resume: ResumeData, 
    pdf?: {
      url: string;
      fileName: string;
      fileSize: number;
    };
    pdfError?: string;
  }> {
    const endpoint = `${API_CONFIG.endpoints.updateResume(id)}/save-with-pdf${theme ? `?theme=${theme}` : ''}`;
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(resumeData),
    });
  }

  async getResume(id: string): Promise<{ resume: ResumeData }> {
    return this.makeRequest(API_CONFIG.endpoints.getResume(id));
  }

  async getUserResumes(): Promise<{ resumes: (ResumeData & { _id: string })[] }> {
    return this.makeRequest(API_CONFIG.endpoints.getUserResumes);
  }
  
  // User profile methods
  async getUserProfile(): Promise<any> {
    return this.makeRequest(API_CONFIG.endpoints.getUserProfile);
  }
  
  async updateUserProfile(profileData: any): Promise<any> {
    return this.makeRequest(API_CONFIG.endpoints.updateUserProfile, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }
  
  // GitHub integration methods
  async connectGithub(githubUsername: string): Promise<any> {
    return this.makeRequest(API_CONFIG.endpoints.connectGithub, {
      method: 'POST',
      body: JSON.stringify({ githubUsername }),
    });
  }
  
  async disconnectGithub(): Promise<any> {
    return this.makeRequest(API_CONFIG.endpoints.disconnectGithub, {
      method: 'POST'
    });
  }
  
  async getGithubProfile(username: string): Promise<any> {
    return this.makeRequest(API_CONFIG.endpoints.getGithubProfile(username));
  }
}

export const apiService = new ApiService();
export default apiService; 