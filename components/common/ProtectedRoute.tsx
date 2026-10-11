'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CircularProgress } from './CircularProgress';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onUnauthorized?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  onUnauthorized,
}) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191F2C] flex flex-col items-center justify-center p-4">
        <CircularProgress size="lg" color="text-[#397EF5]" />
        <p className="mt-4 text-xs text-gray-400 font-medium">Verifying phoneG security session...</p>
      </div>
    );
  }

  if (!currentUser) {
    if (onUnauthorized) {
      onUnauthorized();
    }
    return null;
  }

  return <>{children}</>;
};
