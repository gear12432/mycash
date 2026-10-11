'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SplashPage } from '@/views/SplashPage';
import { LoginPage } from '@/views/LoginPage';
import { RegisterPage } from '@/views/RegisterPage';
import { HomePage } from '@/views/HomePage';
import { BuyCoinsPage } from '@/views/BuyCoinsPage';
import { SendCoinsPage } from '@/views/SendCoinsPage';
import { ReceiveCoinsPage } from '@/views/ReceiveCoinsPage';
import { TransactionsPage } from '@/views/TransactionsPage';
import { ProfilePage } from '@/views/ProfilePage';
import { KycStatusPage } from '@/views/KycStatusPage';
import { NotFoundPage } from '@/views/NotFoundPage';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { CircularProgress } from '@/components/common/CircularProgress';

export const AppRoutes: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('splash');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191F2C] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-[#397EF5] text-white font-black text-2xl flex items-center justify-center shadow-2xl mb-4 animate-bounce">
          pG
        </div>
        <CircularProgress size="md" color="text-[#397EF5]" />
        <p className="mt-3 text-xs text-gray-400 font-medium">Loading phoneG application...</p>
      </div>
    );
  }

  // Unauthenticated user views
  if (!currentUser) {
    if (currentPage === 'register') {
      return (
        <RegisterPage
          onBackToLogin={() => setCurrentPage('login')}
          onRegistrationComplete={() => setCurrentPage('home')}
        />
      );
    }

    if (currentPage === 'login') {
      return (
        <LoginPage
          onLoginSuccess={() => setCurrentPage('home')}
          onGoToRegister={() => setCurrentPage('register')}
          onBackToSplash={() => setCurrentPage('splash')}
        />
      );
    }

    return (
      <SplashPage
        onGetStarted={() => setCurrentPage('login')}
      />
    );
  }

  // Authenticated User Views (Protected)
  return (
    <ProtectedRoute onUnauthorized={() => setCurrentPage('login')}>
      {(() => {
        switch (currentPage) {
          case 'splash':
          case 'login':
          case 'register':
          case 'home':
            return <HomePage onNavigate={(page) => setCurrentPage(page)} />;
          case 'buy':
            return (
              <BuyCoinsPage
                onBack={() => setCurrentPage('home')}
                onSuccess={() => setCurrentPage('home')}
              />
            );
          case 'send':
            return (
              <SendCoinsPage
                onBack={() => setCurrentPage('home')}
                onSuccess={() => setCurrentPage('home')}
              />
            );
          case 'receive':
            return <ReceiveCoinsPage onBack={() => setCurrentPage('home')} />;
          case 'transactions':
            return <TransactionsPage onBack={() => setCurrentPage('home')} />;
          case 'profile':
            return <ProfilePage onBack={() => setCurrentPage('home')} />;
          case 'kyc':
            return <KycStatusPage onBack={() => setCurrentPage('home')} />;
          default:
            return <NotFoundPage onGoHome={() => setCurrentPage('home')} />;
        }
      })()}
    </ProtectedRoute>
  );
};
