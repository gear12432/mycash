'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Wallet } from '@/types/wallet';
import { Transaction } from '@/types/transaction';
import { subscribeToWallet } from '@/services/walletService';
import { subscribeToUserTransactions } from '@/services/transactionService';
import { useAuthContext } from './AuthContext';

interface WalletContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  loadingWallet: boolean;
  loadingTransactions: boolean;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  transactions: [],
  loadingWallet: true,
  loadingTransactions: true,
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuthContext();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingWallet, setLoadingWallet] = useState<boolean>(true);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);

  useEffect(() => {
    if (!currentUser) {
      setWallet(null);
      setTransactions([]);
      setLoadingWallet(false);
      setLoadingTransactions(false);
      return;
    }

    setLoadingWallet(true);
    setLoadingTransactions(true);

    // Subscribe to Wallet Balance in real-time
    const unsubWallet = subscribeToWallet(
      currentUser.uid,
      (updatedWallet) => {
        setWallet(updatedWallet);
        setLoadingWallet(false);
      },
      () => setLoadingWallet(false)
    );

    // Subscribe to Transactions in real-time
    const unsubTransactions = subscribeToUserTransactions(
      currentUser.uid,
      (updatedTransactions) => {
        setTransactions(updatedTransactions);
        setLoadingTransactions(false);
      },
      () => setLoadingTransactions(false)
    );

    return () => {
      unsubWallet();
      unsubTransactions();
    };
  }, [currentUser]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions,
        loadingWallet,
        loadingTransactions,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
