'use client';

import React from 'react';
import { ArrowLeft, Bell, MoreVertical, ShieldCheck, User } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showNotification?: boolean;
  showMenu?: boolean;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showNotification = false,
  showMenu = false,
  onNotificationClick,
  onMenuClick,
  rightAction,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#111111] text-white px-4 py-3.5 border-b border-gray-800 shadow-md">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <button
              onClick={onBack}
              className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-full transition-colors active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#397EF5] flex items-center justify-center font-bold text-white text-xs shadow-sm">
              pG
            </div>
            <h1 className="text-base font-semibold tracking-wide text-white truncate max-w-[200px]">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {rightAction}

          {showNotification && (
            <button
              onClick={onNotificationClick}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#397EF5] rounded-full animate-pulse" />
            </button>
          )}

          {showMenu && (
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
