import React, { useState, useEffect, useRef } from 'react';
import LivePreviewComponent from './LivePreviewComponent';

interface LiveResumeViewerProps {
  htmlContent: string;
  onDownloadPdf?: () => void;
  isDownloading?: boolean;
  className?: string;
  showUpdateIndicator?: boolean;
}


const LiveResumeViewer: React.FC<LiveResumeViewerProps> = ({
  htmlContent,
  onDownloadPdf,
  isDownloading = false,
  className = '',
  showUpdateIndicator = true,
}) => {
  

  const [showUpdateBadge, setShowUpdateBadge] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const prevHtmlContentRef = useRef<string>('');

  // Effect to show update indicator when htmlContent changes
  useEffect(() => {
    // Only trigger if there's previous content and it's different
    if (prevHtmlContentRef.current && prevHtmlContentRef.current !== htmlContent) {
      setShowUpdateBadge(true);
      setUpdateCount(prev => prev + 1);

      // Hide the indicator after 2 seconds
      const timer = setTimeout(() => {
        setShowUpdateBadge(false);
      }, 2000);

      return () => clearTimeout(timer);
    }

    prevHtmlContentRef.current = htmlContent;
  }, [htmlContent]);
  
  // Handler for when content is loaded in the LivePreviewComponent
  const handleContentLoad = () => {
    console.log('Resume preview content loaded');
    // You could add additional logic here if needed when content loads
  };

  const [zoom, setZoom] = useState(100);
  const [showControls, setShowControls] = useState(true);

  // Handle zoom change
  const handleZoomChange = (zoomLevel: number) => {
    setZoom(Math.min(Math.max(50, zoomLevel), 200)); // Clamp between 50% and 200%
  };

  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(!showControls);
  };

  // Detect if user is on a mobile device
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Effect to check screen size on mount and window resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobileView(window.innerWidth < 768); // Tailwind's md breakpoint
    };
    
    // Check on mount
    checkIsMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <div className={`live-resume-viewer relative ${className}`}>
      {/* Update indicator - Responsive positioning */}
      {showUpdateIndicator && showUpdateBadge && (
        <div className="absolute top-4 md:right-12 right-4 z-20 transition-all duration-500 animate-pulse">
          <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg flex items-center space-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Preview updated</span>
          </div>
        </div>
      )}

      {/* Update count badge - Hidden on smallest screens */}
      {showUpdateIndicator && updateCount > 0 && (
        <div className="absolute top-4 left-4 z-20 hidden xs:flex">
          <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded font-medium flex items-center space-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Updates: {updateCount}</span>
          </div>
        </div>
      )}

      {/* Zoom controls - Enhanced for mobile with larger touch targets */}
      {showControls && (
        <div className={`absolute top-0 right-0 z-10 bg-gray-800/80 backdrop-blur-sm p-2 ${isMobileView ? 'rounded-bl-lg' : 'rounded-bl-lg'} flex items-center space-x-2`}>
          <button
            onClick={() => handleZoomChange(zoom - 10)}
            disabled={zoom <= 50}
            className="text-white p-1 md:p-1.5 rounded hover:bg-gray-700 disabled:opacity-50 touch-manipulation"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <span className="text-white text-xs md:text-sm font-medium">{zoom}%</span>
          
          <button 
            onClick={() => handleZoomChange(zoom + 10)} 
            disabled={zoom >= 200}
            className="text-white p-1 md:p-1.5 rounded hover:bg-gray-700 disabled:opacity-50 touch-manipulation"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          {onDownloadPdf && (
            <button 
              onClick={onDownloadPdf} 
              disabled={isDownloading}
              className="text-white p-1 md:p-1.5 rounded hover:bg-gray-700 disabled:opacity-50 touch-manipulation"
              title="Download as PDF"
              aria-label="Download as PDF"
            >
              {isDownloading ? (
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
            </button>
          )}
          
          {/* Mobile-only full screen toggle */}
          {isMobileView && (
            <button
              onClick={() => {
                // Request fullscreen on the container element
                const container = document.querySelector('.live-resume-viewer');
                if (container instanceof HTMLElement) {
                  if (!document.fullscreenElement) {
                    container.requestFullscreen().catch(err => {
                      console.error(`Error attempting to enable fullscreen: ${err.message}`);
                    });
                  } else {
                    document.exitFullscreen();
                  }
                }
              }}
              className="text-white p-1 rounded hover:bg-gray-700 touch-manipulation"
              title="Toggle fullscreen"
              aria-label="Toggle fullscreen"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2" />
              </svg>
            </button>
          )}
        </div>
      )}
      
      {/* Toggle controls button - Enhanced for touch */}
      <button 
        onClick={toggleControls}
        className="absolute left-0 top-0 z-10 bg-gray-800/80 backdrop-blur-sm p-1 md:p-1.5 rounded-br-lg text-white hover:bg-gray-700 touch-manipulation"
        title={showControls ? "Hide controls" : "Show controls"}
        aria-label={showControls ? "Hide controls" : "Show controls"}
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          {showControls ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg>
      </button>
      
      {/* LivePreview with zoom applied - Mobile optimized */}
      <div className="shadow-2xl overflow-hidden">
        <LivePreviewComponent 
          htmlContent={htmlContent}
          onContentLoad={handleContentLoad}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: isMobileView ? 'top center' : 'top center',
            width: `${100 / (zoom / 100)}%`, // Maintain width when scaled
            marginLeft: 'auto',
            marginRight: 'auto',
            // On mobile, make sure the content is scrollable and visible
            overflowX: isMobileView ? 'auto' : 'visible',
            minHeight: isMobileView ? '100vh' : 'auto',
            // Smooth transitions for zoom
            transition: 'transform 0.2s ease-out',
          }}
        />
      </div>
      
      {/* Mobile orientation hint - Only shown when in portrait mode on small screens */}
      {isMobileView && window.innerHeight > window.innerWidth && (
        <div className="fixed bottom-4 left-0 right-0 mx-auto w-max bg-blue-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs font-medium z-30 flex items-center space-x-2 shadow-lg">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Rotate device for better view</span>
        </div>
      )}
    </div>
  );
};

export default LiveResumeViewer;
