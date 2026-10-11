import React from 'react';
import { CircularProgress } from './CircularProgress';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Processing transaction...',
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#191F2C]/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center justify-center p-6 bg-[#111111] border border-gray-800 rounded-2xl shadow-2xl max-w-xs text-center">
        <CircularProgress size="lg" color="text-[#397EF5]" />
        <p className="mt-4 text-sm font-medium text-white">{message}</p>
        <p className="mt-1 text-xs text-gray-400">Please do not refresh or close the page.</p>
      </div>
    </div>
  );
};
