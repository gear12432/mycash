'use client';

import React, { useState } from 'react';
import { AppInput } from '../common/AppInput';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps extends Omit<React.ComponentProps<typeof AppInput>, 'type' | 'rightIcon'> {
  label?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label = 'Password',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AppInput
      label={label}
      type={showPassword ? 'text' : 'password'}
      leftIcon={<Lock className="w-4 h-4" />}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      }
      {...props}
    />
  );
};
