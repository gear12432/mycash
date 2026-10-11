import React from 'react';
import { AppButton } from './AppButton';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  variant = 'primary',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4 text-center border border-gray-100">
        <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 text-[#397EF5] flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-[#397EF5]" />
        </div>

        <h3 className="text-lg font-bold text-[#20244F]">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>

        <div className="flex space-x-3 pt-2">
          <AppButton
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="border border-gray-300"
          >
            {cancelLabel}
          </AppButton>

          <AppButton
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </AppButton>
        </div>
      </div>
    </div>
  );
};
