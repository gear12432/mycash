import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastMessageProps {
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

export const ToastMessage: React.FC<ToastMessageProps> = ({
  type = 'info',
  message,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      bg: 'bg-emerald-600',
      icon: <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />,
    },
    error: {
      bg: 'bg-red-600',
      icon: <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />,
    },
    info: {
      bg: 'bg-[#397EF5]',
      icon: <Info className="w-5 h-5 text-white flex-shrink-0" />,
    },
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <div
        className={`${config[type].bg} text-white p-3.5 rounded-xl shadow-xl flex items-center justify-between space-x-3 transition-all duration-300 animate-in fade-in slide-in-from-top-3`}
      >
        <div className="flex items-center space-x-3">
          {config[type].icon}
          <p className="text-xs font-medium leading-tight">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};
