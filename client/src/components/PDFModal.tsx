import React, { useEffect, useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePDF } from '../hooks/usePDF';
import { Document, Page, pdfjs } from 'react-pdf';

// Set PDF.js worker path
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf-worker/pdf.worker.min.js`;

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  fileName?: string;
  onDownload?: () => void;
}

const PDFModal: React.FC<PDFModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  fileName = 'resume.pdf',
  onDownload
}) => {
  const [zoom, setZoom] = useState(100);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { downloadPDF } = usePDF();

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (onDownload) {
      onDownload();
    } else {
      try {
        // Check if the URL is from Appwrite
        if (pdfUrl.includes('appwrite') || pdfUrl.includes('/api/')) {
          // Use our enhanced download function for Appwrite URLs
          await downloadPDF(pdfUrl, fileName);
        } else {
          // Default download behavior for other URLs
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error('Failed to download PDF:', error);
        // Show a simple alert for user feedback
        alert('Failed to download PDF. Please try again.');
      }
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleFullscreen = () => {
    const pdfContainer = document.getElementById('pdf-container');
    if (pdfContainer?.requestFullscreen) {
      pdfContainer.requestFullscreen();
    }
  };

  // PDF document loading handlers
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setLoading(false);
    setError(error);
    console.error('Error loading PDF:', error);
  };
  
  // Page navigation
  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl h-[90vh] mx-4 bg-gray-900 rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-white truncate max-w-md">
              {fileName}
            </h3>
            <span className="text-sm text-gray-400">
              {zoom}%
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <button
              onClick={handleFullscreen}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-gray-700 mx-2" />

            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-800 overflow-auto" id="pdf-container">
          <div className="h-full flex flex-col items-center justify-center p-4">
            {loading && (
              <div className="flex items-center justify-center h-full w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            )}
            
            {error && (
              <div className="text-red-500 bg-red-100 p-4 rounded-lg shadow-md">
                <h3 className="font-bold">Error loading PDF</h3>
                <p>{error.message}</p>
                <button 
                  onClick={() => setLoading(true)}
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Retry
                </button>
              </div>
            )}
            
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="animate-pulse">Loading PDF...</div>}
              error={<div className="text-red-500">Failed to load PDF.</div>}
              className="mx-auto"
            >
              <div 
                style={{ 
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.2s ease-in-out'
                }}
                className="bg-white shadow-2xl rounded-lg overflow-hidden"
              >
                <Page
                  pageNumber={pageNumber}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  width={600}
                />
              </div>
            </Document>
            
            {numPages && numPages > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-4 bg-gray-700/50 px-4 py-2 rounded-full">
                <button
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 rounded-full hover:bg-gray-700"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-sm text-white font-medium">
                  Page {pageNumber} of {numPages}
                </span>
                
                <button
                  onClick={goToNextPage}
                  disabled={pageNumber >= (numPages || 1)}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 rounded-full hover:bg-gray-700"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-800 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
          <div>
            Press <kbd className="px-2 py-1 bg-gray-700 rounded">Esc</kbd> to close
          </div>
          <div>
            Use zoom controls or <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl</kbd> + Scroll
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFModal;
