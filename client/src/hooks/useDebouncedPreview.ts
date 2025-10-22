import { useState, useEffect, useRef, useCallback } from 'react';

interface UseDebouncedPreviewOptions {
  delay?: number;
  enabled?: boolean;
}

interface PreviewState {
  loading: boolean;
  error: string | null;
  pdfUrl: string | null;
  lastUpdated: number | null;
}

/**
 * Custom hook for debounced PDF preview generation
 * Automatically triggers PDF generation after user stops editing
 * 
 * @param resumeId - ID of the resume to preview
 * @param resumeData - Current resume data
 * @param theme - RenderCV theme to use
 * @param options - Configuration options
 * @returns Preview state and control functions
 */
export function useDebouncedPreview(
  resumeId: string | null,
  resumeData: any,
  theme: string = 'classic',
  options: UseDebouncedPreviewOptions = {}
) {
  const { delay = 800, enabled = true } = options;
  
  const [state, setState] = useState<PreviewState>({
    loading: false,
    error: null,
    pdfUrl: null,
    lastUpdated: null
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const previousDataRef = useRef<string>('');
  
  /**
   * Generates PDF preview by calling the backend API
   */
  const generatePreview = useCallback(async () => {
    if (!resumeId || !enabled) return;
    
    // Cancel any pending preview generation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
      const url = `${apiBaseUrl}/api/render/${resumeId}/preview?theme=${theme}`;
      
      console.log(`[Preview] Fetching PDF from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        signal: abortControllerRef.current.signal,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to generate preview' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      // Get PDF blob
      const pdfBlob = await response.blob();
      
      // Create object URL for the PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Revoke old URL to prevent memory leaks
      if (state.pdfUrl) {
        URL.revokeObjectURL(state.pdfUrl);
      }
      
      setState({
        loading: false,
        error: null,
        pdfUrl,
        lastUpdated: Date.now()
      });
      
    } catch (error: any) {
      // Ignore abort errors
      if (error.name === 'AbortError') {
        return;
      }
      
      console.error('[Preview] Error generating PDF:', error);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to generate PDF preview'
      }));
    }
  }, [resumeId, theme, enabled, state.pdfUrl]);
  
  /**
   * Manually trigger preview generation (bypasses debounce)
   */
  const triggerPreview = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    generatePreview();
  }, [generatePreview]);
  
  /**
   * Clear the current preview
   */
  const clearPreview = useCallback(() => {
    if (state.pdfUrl) {
      URL.revokeObjectURL(state.pdfUrl);
    }
    setState({
      loading: false,
      error: null,
      pdfUrl: null,
      lastUpdated: null
    });
  }, [state.pdfUrl]);
  
  /**
   * Debounced effect that triggers preview generation
   */
  useEffect(() => {
    if (!enabled || !resumeId) return;
    
    // Serialize resume data to detect changes
    const currentData = JSON.stringify({ resumeData, theme });
    
    // Skip if data hasn't changed
    if (currentData === previousDataRef.current) {
      return;
    }
    
    previousDataRef.current = currentData;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for debounced preview generation
    timeoutRef.current = setTimeout(() => {
      generatePreview();
    }, delay);
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resumeData, theme, resumeId, delay, enabled, generatePreview]);
  
  /**
   * Cleanup effect - revoke object URLs on unmount
   */
  useEffect(() => {
    return () => {
      if (state.pdfUrl) {
        URL.revokeObjectURL(state.pdfUrl);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [state.pdfUrl]);
  
  return {
    ...state,
    triggerPreview,
    clearPreview,
    isDebouncing: timeoutRef.current !== null
  };
}

/**
 * Hook for downloading PDF
 */
export function useDownloadPDF() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const downloadPDF = useCallback(async (resumeId: string, theme: string = 'classic', fileName?: string) => {
    setDownloading(true);
    setError(null);
    
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
      const url = `${apiBaseUrl}/api/render/${resumeId}/download?theme=${theme}`;
      
      console.log(`[Download] Downloading PDF from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
      
      // Get PDF blob
      const pdfBlob = await response.blob();
      
      // Extract filename from Content-Disposition header or use provided name
      let downloadFileName = fileName;
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match) {
          downloadFileName = match[1];
        }
      }
      
      // Create download link
      const url_object = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url_object;
      a.download = downloadFileName || 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url_object);
      
      setDownloading(false);
      
    } catch (error: any) {
      console.error('[Download] Error:', error);
      setError(error.message || 'Failed to download PDF');
      setDownloading(false);
    }
  }, []);
  
  return {
    downloading,
    error,
    downloadPDF
  };
}

export default useDebouncedPreview;
