import React, { useState, useRef, useEffect, useCallback } from "react";

interface ResizablePanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth?: number; // percentage
  minLeftWidth?: number; // percentage
  maxLeftWidth?: number; // percentage
  onResize?: (leftWidth: number) => void;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 50,
  minLeftWidth = 30,
  maxLeftWidth = 70,
  onResize,
}) => {
  // Load saved width from localStorage or use default
  const [leftWidth, setLeftWidth] = useState(() => {
    const saved = localStorage.getItem("resumeBuilder_panelWidth");
    return saved ? parseFloat(saved) : defaultLeftWidth;
  });
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateWidth = useCallback(
    (newWidth: number) => {
      const clampedWidth = Math.min(
        Math.max(newWidth, minLeftWidth),
        maxLeftWidth
      );
      setLeftWidth(clampedWidth);

      // Save to localStorage
      localStorage.setItem("resumeBuilder_panelWidth", clampedWidth.toString());

      // Call onResize callback
      onResize?.(clampedWidth);
    },
    [minLeftWidth, maxLeftWidth, onResize]
  );

  const startResizing = useCallback(() => {
    setIsResizing(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const resize = useCallback(
    (clientX: number) => {
      if (isResizing && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth =
          ((clientX - containerRect.left) / containerRect.width) * 100;
        updateWidth(newLeftWidth);
      }
    },
    [isResizing, updateWidth]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      resize(e.clientX);
    },
    [resize]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length > 0) {
        resize(e.touches[0].clientX);
      }
    },
    [resize]
  );

  useEffect(() => {
    if (isResizing) {
      // Mouse events
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopResizing);

      // Touch events for mobile support
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", stopResizing);
    } else {
      // Mouse events
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResizing);

      // Touch events
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopResizing);
    }

    return () => {
      // Cleanup
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResizing);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopResizing);
    };
  }, [isResizing, handleMouseMove, handleTouchMove, stopResizing]);

  return (
    <div ref={containerRef} className="flex h-full overflow-hidden relative">
      {/* Left Panel */}
      <div
        style={{
          width: `${leftWidth}%`,
          transition: isResizing ? "none" : "width 0.2s ease-in-out",
        }}
        className="flex-shrink-0 overflow-hidden"
      >
        {leftPanel}
      </div>

      {/* Resizer Handle */}
      <div
        onMouseDown={startResizing}
        onTouchStart={startResizing}
        className={`w-2 cursor-col-resize hover:bg-indigo-500 transition-all duration-200 relative group flex-shrink-0 ${
          isResizing
            ? "bg-indigo-500 w-3"
            : "bg-gray-300 dark:bg-gray-600 hover:w-3"
        }`}
      >
        {/* Visual indicator */}
        <div className="absolute inset-y-0 -left-2 -right-2 group-hover:bg-indigo-500/10 transition-colors" />

        {/* Drag handle dots */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="flex flex-col space-y-1">
            <div className="w-1 h-1 bg-gray-400 group-hover:bg-indigo-500 rounded-full transition-colors"></div>
            <div className="w-1 h-1 bg-gray-400 group-hover:bg-indigo-500 rounded-full transition-colors"></div>
            <div className="w-1 h-1 bg-gray-400 group-hover:bg-indigo-500 rounded-full transition-colors"></div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div
        style={{
          width: `${100 - leftWidth}%`,
          transition: isResizing ? "none" : "width 0.2s ease-in-out",
        }}
        className="flex-1 overflow-hidden"
      >
        {rightPanel}
      </div>
    </div>
  );
};

export default ResizablePanel;
