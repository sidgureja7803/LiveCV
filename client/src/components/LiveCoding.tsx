import React, { useEffect, useState } from 'react';
import useSocketIo, { CursorPosition, TextSelection, UserPresence } from '../hooks/useSocketIo';
import { useAuth } from '../contexts/AuthContext';

interface LiveCodingProps {
  resumeId: string;
  onResumeUpdate?: (data: any) => void;
}

interface CollaboratorCursorProps {
  position: CursorPosition;
  user: UserPresence;
  editorRef: React.RefObject<HTMLDivElement>;
}

// Component to render a collaborator's cursor
const CollaboratorCursor: React.FC<CollaboratorCursorProps> = ({ position, user, editorRef }) => {
  const [cursorPos, setCursorPos] = useState({ top: 0, left: 0 });
  
  useEffect(() => {
    if (!editorRef.current) return;
    
    const calculatePosition = () => {
      const editor = editorRef.current;
      if (!editor) return;
      
      // Find the target element based on sectionId and fieldId
      let targetElement = editor;
      
      if (position.sectionId) {
        const section = editor.querySelector(`[data-section-id="${position.sectionId}"]`);
        if (section) targetElement = section as HTMLElement;
        
        if (position.fieldId && targetElement) {
          const field = targetElement.querySelector(`[data-field-id="${position.fieldId}"]`);
          if (field) targetElement = field as HTMLElement;
        }
      }
      
      // Get target element dimensions
      const rect = targetElement.getBoundingClientRect();
      const editorRect = editor.getBoundingClientRect();
      
      // Calculate position based on row and column
      // This is a simplified calculation - you'll need to adjust based on your editor's font metrics
      const lineHeight = 20; // Estimate line height
      const charWidth = 8; // Estimate character width
      
      const top = rect.top - editorRect.top + (position.row * lineHeight);
      const left = rect.left - editorRect.left + (position.column * charWidth);
      
      setCursorPos({ top, left });
    };
    
    calculatePosition();
    
    // Recalculate on window resize
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [position, editorRef]);
  
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top: `${cursorPos.top}px`,
        left: `${cursorPos.left}px`,
        zIndex: 100
      }}
    >
      {/* Cursor line */}
      <div
        className="w-0.5 h-5 animate-pulse"
        style={{ backgroundColor: user.color || '#FF5733' }}
      />
      
      {/* User label */}
      <div
        className="absolute whitespace-nowrap rounded px-1 py-0.5 text-xs text-white -mt-5 -ml-1"
        style={{ backgroundColor: user.color || '#FF5733' }}
      >
        {user.name}
      </div>
    </div>
  );
};

interface CollaboratorSelectionProps {
  selection: TextSelection;
  user: UserPresence;
  editorRef: React.RefObject<HTMLDivElement>;
}

// Component to render a collaborator's text selection
const CollaboratorSelection: React.FC<CollaboratorSelectionProps> = ({ selection, user, editorRef }) => {
  // In a real implementation, you would calculate the DOM positions of the selection
  // This is a placeholder that would need actual DOM positioning logic
  return (
    <div className="absolute pointer-events-none opacity-30" style={{ backgroundColor: user.color || '#FF5733' }}>
      {/* Selection highlight would go here */}
    </div>
  );
};

// Main component for live coding collaboration
const LiveCoding: React.FC<LiveCodingProps> = ({ resumeId, onResumeUpdate }) => {
  const { user } = useAuth();
  const editorRef = React.useRef<HTMLDivElement>(null);
  
  // Connect to Socket.IO with user information
  const {
    isConnected,
    editorCount,
    activeCursors,
    activeSelections,
    sendCursorUpdate,
    sendSelectionUpdate,
    connectionError,
    reconnect
  } = useSocketIo(
    resumeId, 
    user ? { 
      id: user.id, 
      name: user.fullName,
      email: user.email
    } : undefined
  );
  
  // Function to update cursor position
  const updateCursorPosition = (position: CursorPosition) => {
    sendCursorUpdate(position);
  };
  
  // Function to update text selection
  const updateTextSelection = (selection: TextSelection) => {
    sendSelectionUpdate(selection);
  };
  
  // Set up cursor position tracking in the editor
  useEffect(() => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    
    // Track mouse position in the editor
    const handleMouseMove = (e: MouseEvent) => {
      if (!isConnected) return;
      
      // Only send updates occasionally to avoid flooding
      // In a real implementation, you'd use throttling
      if (Math.random() < 0.1) {
        const rect = editor.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convert to row/column - this is a simplified example
        // You'd need to calculate actual text position based on your editor
        const lineHeight = 20;
        const charWidth = 8;
        const row = Math.floor(y / lineHeight);
        const column = Math.floor(x / charWidth);
        
        // Find what section and field the cursor is in
        let sectionId;
        let fieldId;
        
        // Get element at position
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (element) {
          // Walk up the DOM to find section and field IDs
          let current: HTMLElement | null = element as HTMLElement;
          while (current && current !== editor) {
            if (!sectionId && current.dataset.sectionId) {
              sectionId = current.dataset.sectionId;
            }
            if (!fieldId && current.dataset.fieldId) {
              fieldId = current.dataset.fieldId;
            }
            current = current.parentElement;
          }
        }
        
        updateCursorPosition({ row, column, sectionId, fieldId });
      }
    };
    
    // Track selections in the editor
    const handleSelectionChange = () => {
      if (!isConnected) return;
      
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      if (!range) return;
      
      // Simplified calculation - in a real editor you'd need to map this to your text model
      const text = range.toString();
      if (!text) return;
      
      // This is a simplified example - you'd need proper row/column calculation
      updateTextSelection({
        start: { row: 0, column: 0 },
        end: { row: 0, column: text.length },
        text
      });
    };
    
    editor.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      editor.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [isConnected, updateCursorPosition, updateTextSelection]);
  
  return (
    <div className="relative" ref={editorRef}>
      {/* Connection status indicator */}
      <div className={`fixed top-4 right-4 rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      
      {/* Collaborators count */}
      {editorCount > 1 && (
        <div className="fixed top-4 right-10 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
          {editorCount} {editorCount === 1 ? 'person' : 'people'} editing
        </div>
      )}
      
      {/* Connection error message */}
      {connectionError && (
        <div className="fixed top-12 right-4 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
          {connectionError}
          <button
            className="ml-2 text-red-600 hover:text-red-800"
            onClick={reconnect}
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Render other users' cursors */}
      {Array.from(activeCursors).map(([clientId, { position, user: cursorUser }]) => (
        <CollaboratorCursor
          key={clientId}
          position={position}
          user={cursorUser}
          editorRef={editorRef}
        />
      ))}
      
      {/* Render other users' selections */}
      {Array.from(activeSelections).map(([clientId, { selection, user: selectionUser }]) => (
        <CollaboratorSelection
          key={clientId}
          selection={selection}
          user={selectionUser}
          editorRef={editorRef}
        />
      ))}
      
      {/* Your actual editor content would be children of this component */}
    </div>
  );
};

export default LiveCoding;
