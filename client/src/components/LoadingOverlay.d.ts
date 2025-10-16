import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

declare const LoadingOverlay: React.FC<LoadingOverlayProps>;

export default LoadingOverlay;
