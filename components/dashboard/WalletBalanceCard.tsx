'use client';

import React from 'react';
import { formatCoins } from '@/lib/formatters';
import { Coins, Plus, Send, Download } from 'lucide-react';

interface WalletBalanceCardProps {
  balance: number;
  userId: string; // e.g. PL18753
  onAddCoins: () => void;
  onSendCoins: () => void;
  onReceiveCoins: () => void;
  isLoading?: boolean;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  balance,
  userId,
  onAddCoins,
  onSendCoins,
  onReceiveCoins,
  isLoading = false,
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-[#202778] via-[#1a2068] to-[#12164a] text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-blue-900/40">
      {/* Subtle Background Glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#397EF5]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between space-y-6">
        {/* Header line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block">
                Total Coin Balance
              </span>
              <span className="text-xs font-mono font-semibold text-gray-300">
                User ID: {userId || 'Loading...'}
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Active
          </span>
        </div>

        {/* Balance Display */}
        <div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black tracking-tight text-white">
              {isLoading ? '...' : formatCoins(balance)}
            </span>
            <span className="text-sm font-extrabold text-amber-400 tracking-wide">
              phoneG COINS
            </span>
          </div>
          <p className="text-[11px] text-gray-300 mt-1">
            Approx. Value: ₹{formatCoins(balance)} INR
          </p>
        </div>

        {/* Quick Card Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
          <button
            onClick={onAddCoins}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#397EF5] hover:bg-[#2e6cd8] active:scale-95 transition-all text-white font-semibold text-xs shadow-md"
          >
            <Plus className="w-4 h-4 mb-1" />
            <span>Buy Coins</span>
          </button>

          <button
            onClick={onSendCoins}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white font-semibold text-xs backdrop-blur-md"
          >
            <Send className="w-4 h-4 mb-1 text-blue-300" />
            <span>Send Coins</span>
          </button>

          <button
            onClick={onReceiveCoins}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white font-semibold text-xs backdrop-blur-md"
          >
            <Download className="w-4 h-4 mb-1 text-emerald-300" />
            <span>Receive</span>
          </button>
        </div>
      </div>
    </div>
  );
};
