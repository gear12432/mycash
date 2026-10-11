'use client';

import React, { useState } from 'react';
import { AppButton } from '../common/AppButton';
import { CheckCircle, Copy, Check, Sparkles, ShieldAlert } from 'lucide-react';

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  userId: string; // e.g. PL18753
  uid: string; // Firebase internal UID
  userName: string;
  onContinueToHome: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  isOpen,
  userId,
  uid,
  userName,
  onContinueToHome,
}) => {
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: 'userId' | 'uid') => {
    navigator.clipboard.writeText(text);
    if (type === 'userId') {
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
    } else {
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#191F2C]/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-5 text-center border border-gray-100 relative overflow-hidden">
        {/* Top Celebration Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-600" />

        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50">
          <CheckCircle className="w-10 h-10 animate-bounce" />
        </div>

        <div>
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-50 text-[#397EF5] text-[11px] font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to phoneG Family</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#20244F]">Registration Successful!</h2>
          <p className="text-xs text-gray-500 mt-1">
            Congratulations {userName}! Your phoneG wallet is now active with 500 bonus coins.
          </p>
        </div>

        {/* Credentials Cards */}
        <div className="space-y-3 text-left">
          {/* Public User ID */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Your Public User ID
              </p>
              <p className="text-lg font-black text-[#397EF5] tracking-wider">{userId}</p>
            </div>
            <button
              onClick={() => copyToClipboard(userId, 'userId')}
              className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-xs font-semibold text-[#20244F] flex items-center space-x-1 transition-all active:scale-95 shadow-2xs"
            >
              {copiedUserId ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Internal UID */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Internal Account UID
              </p>
              <p className="text-xs font-mono font-medium text-gray-700 truncate">{uid}</p>
            </div>
            <button
              onClick={() => copyToClipboard(uid, 'uid')}
              className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-xs font-semibold text-[#20244F] flex items-center space-x-1 transition-all active:scale-95 shadow-2xs flex-shrink-0"
            >
              {copiedUid ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  <span>Copy UID</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-left flex items-start space-x-2">
          <ShieldAlert className="w-4 h-4 text-[#397EF5] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-600 leading-tight">
            Please save your <strong className="text-[#20244F]">User ID ({userId})</strong>. You can use it along with your password to log in anytime.
          </p>
        </div>

        <AppButton variant="primary" onClick={onContinueToHome} className="py-4">
          CONTINUE TO HOME DASHBOARD
        </AppButton>
      </div>
    </div>
  );
};
