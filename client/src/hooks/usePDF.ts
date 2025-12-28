/**
 * React Hook for PDF Generation
 */

import { useState } from 'react';
import { apiService } from '../services/api';
import type { GeneratePdfRequest, GeneratePdfResponse } from '../services/api';

export interface PDFHookResult {
  generatePDF: (request: GeneratePdfRequest) => Promise<GeneratePdfResponse>;
  generateAndDownload: (html: string, fileName?: string) => Promise<string>;
  downloadPDF: (url: string, fileName?: string) => Promise<void>;
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
      // Use the render API directly
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/render/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeData: request.html, // This should actually be resumeData object, not HTML
          theme: 'classic',
          fileName: request.fileName
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.statusText}`);
      }
      
      // Return the response for PDF preview
      return {
        success: true,
        url: URL.createObjectURL(await response.blob()),
        data: {
          fileName: request.fileName,
          pdfUrl: URL.createObjectURL(await response.blob()),
          s3Key: '',
          s3Bucket: '',
          fileSize: 0,
          uploadedAt: new Date().toISOString(),
        },
        metadata: {
          requestId: '',
          processingTime: {
            total: 0,
            pdfGeneration: 0,
            s3Upload: 0,
          },
          timestamp: new Date().toISOString(),
        }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  // For downloading from Appwrite
  const downloadPDF = async (url: string, fileName: string = 'resume.pdf'): Promise<void> => {
    try {
      // For Appwrite URLs, we need to handle authentication
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.statusText}`);
      }
      
      // Create a blob URL from the response
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('PDF download failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
      throw err;
    }
  };

  const generateAndDownload = async (html: string, fileName: string = 'resume'): Promise<string> => {
    try {
      const response = await generatePDF({ html, fileName });
      
      // Trigger download using the blob URL
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
    downloadPDF,
    isGenerating,
    error
  };
}; 