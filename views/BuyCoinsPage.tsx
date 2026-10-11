'use client';

import React from 'react';
import { AppHeader } from '@/components/common/AppHeader';
import { BuyCoinsForm } from '@/components/wallet/BuyCoinsForm';
import { useAuth } from '@/hooks/useAuth';

interface BuyCoinsPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const BuyCoinsPage: React.FC<BuyCoinsPageProps> = ({ onBack, onSuccess }) => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-[#191F2C] text-white flex flex-col justify-between max-w-md mx-auto shadow-2xl">
      <AppHeader title="Buy Coins" showBack onBack={onBack} />

      <div className="flex-1 p-4 flex items-center justify-center">
        {currentUser ? (
          <BuyCoinsForm uid={currentUser.uid} onSuccess={onSuccess} />
        ) : (
          <p className="text-xs text-gray-400">Please log in to buy coins.</p>
        )}
      </div>
    </div>
  );
};

export default BuyCoinsPage;
