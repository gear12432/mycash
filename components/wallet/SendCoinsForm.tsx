'use client';

import React, { useState } from 'react';
import { AppInput } from '../common/AppInput';
import { AppButton } from '../common/AppButton';
import { getUserByPublicUserId } from '@/services/userService';
import { sendCoins, calculateTransactionFee } from '@/services/transactionService';
import { formatCoins } from '@/lib/formatters';
import { ToastMessage } from '../common/ToastMessage';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { UserProfile } from '@/types/user';
import { Send, UserCheck, ShieldCheck, Search, Info } from 'lucide-react';

interface SendCoinsFormProps {
  senderUid: string;
  senderUserId: string;
  senderName: string;
  currentBalance: number;
  onSuccess: () => void;
}

export const SendCoinsForm: React.FC<SendCoinsFormProps> = ({
  senderUid,
  senderUserId,
  senderName,
  currentBalance,
  onSuccess,
}) => {
  const [recipientInput, setRecipientInput] = useState(''); // Public User ID e.g. PL18753
  const [recipientProfile, setRecipientProfile] = useState<UserProfile | null>(null);
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const [coinAmount, setCoinAmount] = useState('100');
  const [note, setNote] = useState('');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);

  const parsedCoins = parseFloat(coinAmount) || 0;
  const fee = calculateTransactionFee(parsedCoins);
  const totalDeduction = parsedCoins + fee;

  // Resolve Recipient
  const handleVerifyRecipient = async () => {
    const cleanId = recipientInput.trim().toUpperCase();
    if (!cleanId) {
      setResolveError('Enter a valid User ID (e.g. PL18753)');
      return;
    }

    if (cleanId === senderUserId.toUpperCase()) {
      setResolveError('You cannot send coins to your own User ID.');
      setRecipientProfile(null);
      return;
    }

    setResolving(true);
    setResolveError(null);
    try {
      const user = await getUserByPublicUserId(cleanId);
      if (user) {
        setRecipientProfile(user);
      } else {
        setRecipientProfile(null);
        setResolveError(`User ID '${cleanId}' not found. Please check and try again.`);
      }
    } catch (err: any) {
      setResolveError('Error looking up User ID.');
    } finally {
      setResolving(false);
    }
  };

  const handlePrepareSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientProfile) {
      setToast({ type: 'error', msg: 'Please verify recipient User ID first.' });
      return;
    }

    if (parsedCoins <= 0) {
      setToast({ type: 'error', msg: 'Enter a valid coin amount greater than 0.' });
      return;
    }

    if (totalDeduction > currentBalance) {
      setToast({
        type: 'error',
        msg: `Insufficient balance. Required: ${formatCoins(
          totalDeduction
        )} coins, Available: ${formatCoins(currentBalance)} coins.`,
      });
      return;
    }

    setConfirmOpen(true);
  };

  const handleExecuteSend = async () => {
    if (!recipientProfile) return;

    setSending(true);
    try {
      await sendCoins(
        senderUid,
        senderUserId,
        senderName,
        recipientProfile.uid,
        recipientProfile.userId,
        `${recipientProfile.firstName} ${recipientProfile.lastName}`,
        parsedCoins,
        note
      );

      setToast({
        type: 'success',
        msg: `Successfully transferred ${formatCoins(parsedCoins)} coins to ${
          recipientProfile.firstName
        }!`,
      });
      setConfirmOpen(false);

      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: any) {
      console.error('Send coins error:', err);
      setToast({ type: 'error', msg: err.message || 'Transfer failed.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-5 text-left">
      {toast && (
        <ToastMessage
          type={toast.type}
          message={toast.msg}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirm Coin Transfer"
        message={`Are you sure you want to send ${formatCoins(
          parsedCoins
        )} phoneG coins to ${recipientProfile?.firstName} ${recipientProfile?.lastName} (${
          recipientProfile?.userId
        })? Fee: ${fee} coins. Total deduction: ${formatCoins(totalDeduction)} coins.`}
        confirmLabel="YES, TRANSFER NOW"
        cancelLabel="Cancel"
        isLoading={sending}
        onConfirm={handleExecuteSend}
        onCancel={() => setConfirmOpen(false)}
      />

      <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#20244F]">Send phoneG Coins</h3>
          <p className="text-xs text-gray-500">
            Available Balance:{' '}
            <strong className="text-[#397EF5]">{formatCoins(currentBalance)} Coins</strong>
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Send className="w-5 h-5" />
        </div>
      </div>

      <form onSubmit={handlePrepareSend} className="space-y-4">
        {/* Recipient User ID Input with Search */}
        <div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <AppInput
                label="Recipient User ID"
                placeholder="e.g. PL18753"
                value={recipientInput}
                onChange={(e) => {
                  setRecipientInput(e.target.value.toUpperCase());
                  setRecipientProfile(null);
                  setResolveError(null);
                }}
                error={resolveError || undefined}
                leftIcon={<UserCheck className="w-4 h-4" />}
              />
            </div>
            <div className="pt-6">
              <button
                type="button"
                onClick={handleVerifyRecipient}
                disabled={resolving || !recipientInput.trim()}
                className="px-4 py-3 bg-[#397EF5] hover:bg-[#2e6cd8] text-white font-semibold rounded-xl text-xs transition-all flex items-center space-x-1 disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{resolving ? 'Checking...' : 'Verify'}</span>
              </button>
            </div>
          </div>

          {/* Verified Recipient Card */}
          {recipientProfile && (
            <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between animate-in fade-in">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  {recipientProfile.firstName[0]}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#20244F]">
                    {recipientProfile.firstName} {recipientProfile.lastName}
                  </p>
                  <p className="text-[10px] font-mono text-emerald-700">
                    ID: {recipientProfile.userId} • Verified Account
                  </p>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
          )}
        </div>

        {/* Coin Amount Input */}
        <AppInput
          label="Coins to Send"
          placeholder="e.g. 100"
          type="number"
          value={coinAmount}
          onChange={(e) => setCoinAmount(e.target.value)}
          leftIcon={<Send className="w-4 h-4 text-indigo-500" />}
        />

        {/* Note Optional */}
        <AppInput
          label="Transaction Note (Optional)"
          placeholder="e.g. Payment for lunch"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Breakdown Box */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Transfer Amount:</span>
            <span className="font-bold text-[#20244F]">{formatCoins(parsedCoins)} Coins</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee (0.5%):</span>
            <span className="font-bold text-gray-700">{fee} Coins</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-extrabold text-[#20244F]">
            <span>Total Balance Deduction:</span>
            <span className="text-red-600">{formatCoins(totalDeduction)} Coins</span>
          </div>
        </div>

        <AppButton
          type="submit"
          variant="secondary"
          disabled={!recipientProfile}
          icon={<Send className="w-4 h-4" />}
        >
          PROCEED TO SEND COINS
        </AppButton>
      </form>
    </div>
  );
};
