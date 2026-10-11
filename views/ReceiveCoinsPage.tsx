'use client';

import React from 'react';
import { AppHeader } from '@/components/common/AppHeader';
import { ReceiveCoinsCard } from '@/components/wallet/ReceiveCoinsCard';
import { useAuth } from '@/hooks/useAuth';

interface ReceiveCoinsPageProps {
  onBack: () => void;
}

export const ReceiveCoinsPage: React.FC<ReceiveCoinsPageProps> = ({ onBack }) => {
  const { userProfile } = useAuth();

  const userId = userProfile ? userProfile.userId : '...';
  const userName = userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'User';

  return (
    <div className="min-h-screen bg-[#191F2C] text-white flex flex-col justify-between max-w-md mx-auto shadow-2xl">
      <AppHeader title="Receive Coins" showBack onBack={onBack} />

      <div className="flex-1 p-4 flex items-center justify-center">
        <ReceiveCoinsCard userId={userId} userName={userName} />
      </div>
    </div>
  );
};

export default ReceiveCoinsPage;
