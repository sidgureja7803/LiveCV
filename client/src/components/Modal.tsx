import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  closeOnOverlayClick = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Handle escape key press
    const handleEscKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose, closeOnOverlayClick]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Overlay with dark opacity */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />
      
      {/* Modal content */}
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl relative z-50 max-h-[95vh] overflow-auto w-full max-w-4xl transform transition-all ${className}`}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
