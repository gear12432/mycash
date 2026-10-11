'use client';

import React from 'react';
import { AppHeader } from '@/components/common/AppHeader';
import { LoginForm } from '@/components/auth/LoginForm';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
  onBackToSplash: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onBackToSplash,
}) => {
  return (
    <div className="min-h-screen bg-[#191F2C] text-white flex flex-col justify-between max-w-md mx-auto shadow-2xl">
      <AppHeader title="Login & Registration" showBack onBack={onBackToSplash} />

      <div className="flex-1 p-4 flex items-center justify-center">
        <LoginForm
          onLoginSuccess={onLoginSuccess}
          onGoToRegister={onGoToRegister}
        />
      </div>

      <div className="p-4 text-center text-xs text-gray-500">
        Protected by phoneG Firebase ABAC Security Rules
      </div>
    </div>
  );
};

export default LoginPage;
