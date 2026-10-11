import React from 'react';
import { CircularProgress } from './CircularProgress';

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = true,
  isLoading = false,
  disabled,
  icon,
  className = '',
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-medium rounded-xl px-5 py-3.5 text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none shadow-sm';

  const variantClasses = {
    primary:
      'bg-[#397EF5] hover:bg-[#2e6cd8] text-white shadow-[#397EF5]/20 hover:shadow-[#397EF5]/30 shadow-md',
    secondary:
      'bg-[#202778] hover:bg-[#191f63] text-white shadow-md',
    outline:
      'border-2 border-[#397EF5] text-[#397EF5] hover:bg-[#397EF5]/10 bg-transparent',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20 shadow-md',
    ghost:
      'bg-transparent hover:bg-gray-100 text-[#20244F]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center space-x-2">
          <CircularProgress size="sm" color="text-current" />
          <span>Processing...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center space-x-2">
          {icon && <span>{icon}</span>}
          <span>{children}</span>
        </span>
      )}
    </button>
  );
};
