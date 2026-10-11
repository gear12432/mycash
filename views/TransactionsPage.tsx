'use client';

import React from 'react';
import { AppHeader } from '@/components/common/AppHeader';
import { TransactionList } from '@/components/wallet/TransactionList';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';

interface TransactionsPageProps {
  onBack: () => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onBack }) => {
  const { currentUser } = useAuth();
  const { transactions, loadingTransactions } = useWallet();

  return (
    <div className="min-h-screen bg-[#191F2C] text-[#20244F] flex flex-col justify-between max-w-md mx-auto shadow-2xl">
      <AppHeader title="History" showBack onBack={onBack} />

      <div className="flex-1 p-4">
        <TransactionList
          transactions={transactions}
          currentUid={currentUser?.uid || ''}
          isLoading={loadingTransactions}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;
