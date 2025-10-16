import React from 'react';

interface LoadingOverlayProps {
  isLoading?: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading = true, 
  message = 'Loading...' 
}) => {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl flex flex-col items-center max-w-md w-full">
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {message}
        </h3>
      </div>
    </div>
  );
};

export default LoadingOverlay;
