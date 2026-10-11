'use client';

import React, { useState } from 'react';
import { AppInput } from '../common/AppInput';
import { PasswordInput } from './PasswordInput';
import { TermsCheckbox } from './TermsCheckbox';
import { AppButton } from '../common/AppButton';
import { loginWithUserIdOrEmail, sendPasswordReset } from '@/services/authService';
import { ToastMessage } from '../common/ToastMessage';
import { UserCheck, KeyRound, UserPlus } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onGoToRegister,
}) => {
  const [identifier, setIdentifier] = useState(''); // Public User ID (PL18753) or email
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; terms?: string }>({});

  const validate = () => {
    const errs: { identifier?: string; password?: string; terms?: string } = {};
    if (!identifier.trim()) {
      errs.identifier = 'User ID or Gmail ID is required';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    if (!termsAccepted) {
      errs.terms = 'You must accept the terms to continue';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await loginWithUserIdOrEmail(identifier, password);
      setToast({ type: 'success', msg: 'Login successful! Welcome back to phoneG.' });
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err.message || 'Invalid User ID or Password';
      setToast({ type: 'error', msg });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!identifier.trim()) {
      setToast({ type: 'info', msg: 'Please enter your User ID or Gmail ID first.' });
      return;
    }
    setLoading(true);
    try {
      await sendPasswordReset(identifier);
      setToast({
        type: 'success',
        msg: 'Password reset link sent to registered email.',
      });
    } catch (err: any) {
      setToast({ type: 'error', msg: err.message || 'Failed to send reset link.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotUserId = () => {
    setToast({
      type: 'info',
      msg: 'Your User ID is in format PLxxxxx (e.g. PL18753) sent during registration, or use your Gmail ID to log in.',
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {toast && (
        <ToastMessage
          type={toast.type}
          message={toast.msg}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-[#111111] p-5 text-center text-white border-b border-gray-800">
        <h2 className="text-xl font-bold tracking-tight">Login & Registration</h2>
        <p className="text-xs text-gray-400 mt-1">Access your phoneG wallet and coin history</p>
      </div>

      <div className="p-6 space-y-5">
        <div className="text-left">
          <h3 className="text-lg font-bold text-[#20244F]">Login to Continue</h3>
          <p className="text-xs text-gray-500">Enter your PL User ID or Gmail address</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AppInput
            label="User ID / Gmail ID"
            placeholder="e.g. PL18753 or name@gmail.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={errors.identifier}
            leftIcon={<UserCheck className="w-4 h-4 text-gray-400" />}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your account password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <TermsCheckbox
            checked={termsAccepted}
            onChange={setTermsAccepted}
            error={errors.terms}
          />

          <AppButton type="submit" isLoading={loading} variant="primary">
            LOGIN
          </AppButton>
        </form>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
          <button
            type="button"
            onClick={handleForgotUserId}
            className="text-[#397EF5] hover:underline font-medium"
          >
            Forgot User ID?
          </button>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-[#397EF5] hover:underline font-medium flex items-center space-x-1"
          >
            <KeyRound className="w-3 h-3 inline" />
            <span>Forgot Password?</span>
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400 font-semibold">OR</span>
          </div>
        </div>

        {/* Registration Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 text-center space-y-2">
          <p className="text-xs font-semibold text-[#20244F]">
            Don't have a phoneG account yet?
          </p>
          <AppButton
            type="button"
            variant="danger"
            onClick={onGoToRegister}
            icon={<UserPlus className="w-4 h-4" />}
          >
            REGISTER NEW ACCOUNT
          </AppButton>
        </div>
      </div>
    </div>
  );
};
