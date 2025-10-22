import React, { useState, useRef, useEffect } from 'react';

interface ResizablePanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth?: number; // percentage
  minLeftWidth?: number; // percentage
  maxLeftWidth?: number; // percentage
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 50,
  minLeftWidth = 30,
  maxLeftWidth = 70
}) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startResizing = () => {
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Clamp the width between min and max
      const clampedWidth = Math.min(Math.max(newLeftWidth, minLeftWidth), maxLeftWidth);
      setLeftWidth(clampedWidth);
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  return (
    <div ref={containerRef} className="flex h-full overflow-hidden relative">
      {/* Left Panel */}
      <div
        style={{ width: `${leftWidth}%` }}
        className="flex-shrink-0 overflow-y-auto"
      >
        {leftPanel}
      </div>

      {/* Resizer Handle */}
      <div
        onMouseDown={startResizing}
        className={`w-1 cursor-col-resize hover:bg-indigo-500 transition-colors relative group ${
          isResizing ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        {/* Visual indicator */}
        <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-indigo-500/20" />
        
        {/* Drag handle icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      {/* Right Panel */}
      <div
        style={{ width: `${100 - leftWidth}%` }}
        className="flex-1 overflow-y-auto"
      >
        {rightPanel}
      </div>
    </div>
  );
};

export default ResizablePanel;
