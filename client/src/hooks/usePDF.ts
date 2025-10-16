/**
 * React Hook for PDF Generation
 */

import { useState } from 'react';
import { apiService } from '../services/api';
import type { GeneratePdfRequest, GeneratePdfResponse } from '../services/api';

export interface PDFHookResult {
  generatePDF: (request: GeneratePdfRequest) => Promise<GeneratePdfResponse>;
  generateAndDownload: (html: string, fileName?: string) => Promise<string>;
  isGenerating: boolean;
  error: string | null;
}

export const usePDF = (): PDFHookResult => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = async (request: GeneratePdfRequest): Promise<GeneratePdfResponse> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await apiService.generatePdf(request);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAndDownload = async (html: string, fileName: string = 'resume'): Promise<string> => {
    try {
      const response = await generatePDF({ html, fileName });
      
      // Trigger download
      const link = document.createElement('a');
      link.href = response.url;
      link.download = `${fileName}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return response.url;
    } catch (err) {
      console.error('PDF download failed:', err);
      throw err;
    }
  };

  return {
    generatePDF,
    generateAndDownload,
    isGenerating,
    error
  };
}; 