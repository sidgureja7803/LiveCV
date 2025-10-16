import React, { useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

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
  const [zoom, setZoom] = React.useState(100);

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

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleFullscreen = () => {
    const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
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
        <div className="flex-1 bg-gray-800 overflow-auto">
          <div
            className="h-full flex items-center justify-center p-4"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <iframe
              id="pdf-iframe"
              src={pdfUrl}
              className="w-full h-full bg-white rounded shadow-2xl"
              title="PDF Preview"
              style={{ minHeight: '800px' }}
            />
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
