'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { AppRoutes } from '@/routes/AppRoutes';

export default function Home() {
  return (
    <AuthProvider>
      <WalletProvider>
        <AppRoutes />
      </WalletProvider>
    </AuthProvider>
  );
}
