'use client';

import React from 'react';
import { AppHeader } from '@/components/common/AppHeader';
import { AppButton } from '@/components/common/AppButton';
import { AlertCircle } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-screen bg-[#191F2C] text-white flex flex-col justify-between max-w-md mx-auto shadow-2xl">
      <AppHeader title="Page Not Found" />

      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold">404 - Screen Not Found</h2>
        <p className="text-xs text-gray-400 max-w-xs">
          The requested screen or feature could not be found. Return to your phoneG dashboard.
        </p>
        <AppButton variant="primary" onClick={onGoHome} className="max-w-xs">
          RETURN TO DASHBOARD
        </AppButton>
      </div>
    </div>
  );
};

export default NotFoundPage;
