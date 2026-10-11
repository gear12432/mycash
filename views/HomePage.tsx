'use client';

import React, { useState } from 'react';
import { AppHeader } from '@/components/common/AppHeader';
import { WalletBalanceCard } from '@/components/dashboard/WalletBalanceCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { logoutUser } from '@/services/authService';
import { ToastMessage } from '@/components/common/ToastMessage';
import { User, LogOut, ShieldCheck } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { userProfile, currentUser } = useAuth();
  const { wallet, transactions, loadingWallet, loadingTransactions } = useWallet();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);

  const balance = wallet ? wallet.coinBalance : 0;
  const userId = userProfile ? userProfile.userId : '...';
  const userName = userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'User';

  const handleLogout = async () => {
    try {
      await logoutUser();
      setToast({ type: 'info', msg: 'Logged out successfully.' });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#191F2C] text-white flex flex-col justify-between max-w-md mx-auto shadow-2xl relative pb-8">
      {toast && (
        <ToastMessage
          type={toast.type}
          message={toast.msg}
          onClose={() => setToast(null)}
        />
      )}

      <AppHeader
        title="phoneG Dashboard"
        showNotification
        onNotificationClick={() =>
          setToast({ type: 'info', msg: 'No new notifications right now.' })
        }
        rightAction={
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-full bg-[#397EF5] text-white font-bold text-xs flex items-center justify-center border-2 border-gray-700 hover:ring-2 hover:ring-[#397EF5] transition-all"
            aria-label="Profile menu"
          >
            {userProfile?.firstName?.[0] || <User className="w-4 h-4" />}
          </button>
        }
      />

      {showProfileMenu && (
        <div className="absolute top-14 right-4 z-50 w-56 bg-[#111111] border border-gray-800 rounded-2xl shadow-2xl p-3 text-left space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="px-2 py-1.5 border-b border-gray-800">
            <p className="text-xs font-bold text-white truncate">{userName}</p>
            <p className="text-[10px] font-mono text-[#397EF5]">ID: {userId}</p>
          </div>

          <button
            onClick={() => {
              setShowProfileMenu(false);
              onNavigate('profile');
            }}
            className="w-full text-left px-2.5 py-2 hover:bg-gray-800 rounded-xl text-xs font-medium text-gray-200 flex items-center space-x-2"
          >
            <User className="w-4 h-4 text-[#397EF5]" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => {
              setShowProfileMenu(false);
              onNavigate('kyc');
            }}
            className="w-full text-left px-2.5 py-2 hover:bg-gray-800 rounded-xl text-xs font-medium text-gray-200 flex items-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>KYC Status</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-2.5 py-2 hover:bg-red-950/40 text-red-400 rounded-xl text-xs font-medium flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      )}

      <div className="p-4 space-y-5">
        <WalletBalanceCard
          balance={balance}
          userId={userId}
          isLoading={loadingWallet}
          onAddCoins={() => onNavigate('buy')}
          onSendCoins={() => onNavigate('send')}
          onReceiveCoins={() => onNavigate('receive')}
        />

        <QuickActions
          onNavigate={onNavigate}
          kycStatus={userProfile?.kycStatus}
        />

        <RecentTransactions
          transactions={transactions}
          currentUid={currentUser?.uid || ''}
          isLoading={loadingTransactions}
          onViewAll={() => onNavigate('transactions')}
        />
      </div>
    </div>
  );
};

export default HomePage;
