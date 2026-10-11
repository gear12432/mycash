'use client';

import React from 'react';
import {
  ShoppingBag,
  Send,
  QrCode,
  History,
  User,
  ShieldCheck,
  HelpCircle,
  Settings,
} from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (page: string) => void;
  kycStatus?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNavigate,
  kycStatus = 'under_review',
}) => {
  const actions = [
    {
      id: 'buy',
      title: 'Buy Coins',
      icon: <ShoppingBag className="w-6 h-6 text-[#397EF5]" />,
      bg: 'bg-blue-50',
    },
    {
      id: 'send',
      title: 'Send Coins',
      icon: <Send className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
    },
    {
      id: 'receive',
      title: 'Receive Coins',
      icon: <QrCode className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      id: 'transactions',
      title: 'History',
      icon: <History className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50',
    },
    {
      id: 'profile',
      title: 'My Profile',
      icon: <User className="w-6 h-6 text-cyan-600" />,
      bg: 'bg-cyan-50',
    },
    {
      id: 'kyc',
      title: 'KYC Status',
      icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50',
      badge: kycStatus === 'verified' ? 'Verified' : 'Under Review',
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: <HelpCircle className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings className="w-6 h-6 text-gray-600" />,
      bg: 'bg-gray-100',
    },
  ];

  return (
    <div className="w-full space-y-3 text-left">
      <h3 className="text-sm font-bold text-[#20244F] uppercase tracking-wider">
        Quick Services
      </h3>

      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onNavigate(action.id)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 active:scale-95 space-y-1.5 relative group"
          >
            <div
              className={`w-11 h-11 rounded-xl ${action.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
            >
              {action.icon}
            </div>

            <span className="text-[11px] font-semibold text-[#20244F] text-center leading-tight line-clamp-1">
              {action.title}
            </span>

            {action.badge && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full shadow-2xs">
                {action.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
