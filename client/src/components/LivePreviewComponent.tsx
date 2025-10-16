import React, { useEffect, useRef, useState } from 'react';

interface LivePreviewComponentProps {
  htmlContent: string;
  style?: React.CSSProperties;
  className?: string;
  onContentLoad?: () => void;
}

/**
 * LivePreviewComponent - A component that renders HTML content in an iframe
 * 
 * This component safely renders HTML content in an iframe, allowing for live preview
 * of resume templates with proper styling and layout. It also supports live updates
 * when the htmlContent prop changes.
 */
const LivePreviewComponent: React.FC<LivePreviewComponentProps> = ({
  htmlContent,
  style = {},
  className = '',
  onContentLoad,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // Keep previous HTML content to compare for changes
  const prevHtmlContentRef = useRef<string>('');

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Function to update iframe content
    const updateIframeContent = () => {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDocument) return;

      // Check if content has changed to avoid unnecessary rerender
      const contentChanged = prevHtmlContentRef.current !== htmlContent;
      if (!contentChanged && isLoaded) return;
      
      prevHtmlContentRef.current = htmlContent;

      // Before writing to iframe, temporarily store the scroll position
      const scrollPosition = iframeDocument.body ? iframeDocument.body.scrollTop : 0;

      // Write the HTML content to the iframe
      iframeDocument.open();
      iframeDocument.write(htmlContent);
      iframeDocument.close();

      // After content is loaded, adjust height and restore scroll position if needed
      const handleLoad = () => {
        if (!iframe.contentDocument?.body) return;
        
        // Adjust iframe height to content
        const height = iframe.contentDocument.body.scrollHeight;
        iframe.style.height = `${height}px`;
        
        // Restore scroll position if this is an update
        if (isLoaded && contentChanged) {
          iframe.contentDocument.body.scrollTop = scrollPosition;
        }
        
        setIsLoaded(true);
        if (onContentLoad) onContentLoad();
      };
      
      // If the document already has images, set up load event handlers
      const images = iframeDocument.querySelectorAll('img');
      if (images.length > 0) {
        let loadedImages = 0;
        images.forEach(img => {
          if (img.complete) {
            loadedImages++;
            if (loadedImages === images.length) handleLoad();
          } else {
            img.addEventListener('load', () => {
              loadedImages++;
              if (loadedImages === images.length) handleLoad();
            }, { once: true });
            img.addEventListener('error', () => {
              loadedImages++;
              if (loadedImages === images.length) handleLoad();
            }, { once: true });
          }
        });
      } else {
        // No images, so handle load immediately
        handleLoad();
      }
    };

    // Update iframe content initially
    updateIframeContent();

    // Add resize observer to handle dynamic content changes
    if (iframe.contentWindow && iframe.contentDocument?.body) {
      const resizeObserver = new ResizeObserver(() => {
        if (iframe.contentDocument?.body) {
          iframe.style.height = `${iframe.contentDocument.body.scrollHeight}px`;
        }
      });
      
      resizeObserver.observe(iframe.contentDocument.body);
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [htmlContent, isLoaded, onContentLoad]);

  return (
    <iframe
      ref={iframeRef}
      className={`w-full border-0 ${className}`}
      style={{ 
        backgroundColor: 'white',
        minHeight: '1100px', // Default minimum height
        transition: 'all 0.2s ease', // Smooth transition for height changes
        ...style 
      }}
      title="Resume Preview"
      sandbox="allow-same-origin allow-scripts"
    />
  );
};

export default LivePreviewComponent;
