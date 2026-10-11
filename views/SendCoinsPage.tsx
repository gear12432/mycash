'use client';

import React from 'react';
import { AppHeader } from '@/components/common/AppHeader';
import { SendCoinsForm } from '@/components/wallet/SendCoinsForm';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';

interface SendCoinsPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const SendCoinsPage: React.FC<SendCoinsPageProps> = ({ onBack, onSuccess }) => {
  const { userProfile, currentUser } = useAuth();
  const { wallet } = useWallet();

  const balance = wallet ? wallet.coinBalance : 0;
  const senderUserId = userProfile ? userProfile.userId : '';
  const senderName = userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : '';

  return (
    <div className="min-h-screen bg-[#191F2C] text-white flex flex-col justify-between max-w-md mx-auto shadow-2xl">
      <AppHeader title="Send Coins" showBack onBack={onBack} />

      <div className="flex-1 p-4 flex items-center justify-center">
        {currentUser && userProfile ? (
          <SendCoinsForm
            senderUid={currentUser.uid}
            senderUserId={senderUserId}
            senderName={senderName}
            currentBalance={balance}
            onSuccess={onSuccess}
          />
        ) : (
          <p className="text-xs text-gray-400">Please log in to send coins.</p>
        )}
      </div>
    </div>
  );
};

export default SendCoinsPage;
