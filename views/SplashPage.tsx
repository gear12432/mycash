'use client';

import React from 'react';
import { AppHeader } from '@/components/common/AppHeader';
import { AppButton } from '@/components/common/AppButton';
import { Coins, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface SplashPageProps {
  onGetStarted: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[#191F2C] text-white flex flex-col justify-between max-w-md mx-auto shadow-2xl overflow-hidden relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#397EF5]/15 rounded-full blur-3xl pointer-events-none" />

      <AppHeader title="Welcome to phoneG" showMenu />

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 relative z-10">
        <div className="relative group">
          <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-[#202778] via-[#397EF5] to-indigo-500 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full bg-[#111111] rounded-full flex flex-col items-center justify-center p-4">
              <div className="w-16 h-16 rounded-2xl bg-[#397EF5] flex items-center justify-center text-white text-2xl font-black shadow-lg mb-2">
                pG
              </div>
              <Coins className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-lg uppercase tracking-wider flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Wallet</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-white">
            phone<span className="text-[#397EF5]">G</span>
          </h1>
          <p className="text-sm font-medium text-gray-300 max-w-xs mx-auto leading-relaxed">
            Easy way for all your transactions
          </p>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Buy, send, and receive digital coins instantly with zero transfer fees and total transparency.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-left">
          <div className="bg-[#111111]/80 border border-gray-800 p-3 rounded-2xl flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-[11px] font-semibold text-gray-300">
              Instant Transfers
            </span>
          </div>
          <div className="bg-[#111111]/80 border border-gray-800 p-3 rounded-2xl flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-[11px] font-semibold text-gray-300">
              Firebase Security
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-[#111111] border-t border-gray-800 space-y-3 relative z-10">
        <AppButton
          variant="primary"
          onClick={onGetStarted}
          icon={<ArrowRight className="w-5 h-5" />}
          className="py-4 text-base font-bold shadow-xl shadow-[#397EF5]/20"
        >
          GET STARTED
        </AppButton>
        <p className="text-[10px] text-gray-500 text-center">
          By continuing you agree to phoneG Terms & Conditions.
        </p>
      </div>
    </div>
  );
};

export default SplashPage;
