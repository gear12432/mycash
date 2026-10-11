'use client';

import React, { useState } from 'react';
import { AppInput } from '../common/AppInput';
import { AppButton } from '../common/AppButton';
import { buyCoins } from '@/services/walletService';
import { formatCoins, formatCurrency } from '@/lib/formatters';
import { COIN_EXCHANGE_RATE_INR } from '@/lib/constants';
import { ToastMessage } from '../common/ToastMessage';
import { ShoppingBag, CreditCard, Landmark, QrCode, CheckCircle2, ShieldCheck } from 'lucide-react';

interface BuyCoinsFormProps {
  uid: string;
  onSuccess: () => void;
}

export const BuyCoinsForm: React.FC<BuyCoinsFormProps> = ({ uid, onSuccess }) => {
  const [amountInr, setAmountInr] = useState<string>('500');
  const [provider, setProvider] = useState<'UPI' | 'NETBANKING' | 'CARD' | 'MOCK_PG'>('UPI');
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);

  const parsedInr = parseFloat(amountInr) || 0;
  const calculatedCoins = parsedInr * COIN_EXCHANGE_RATE_INR;

  const quickAmounts = [100, 500, 1000, 2500, 5000];

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedInr <= 0) {
      setToast({ type: 'error', msg: 'Please enter a valid amount greater than ₹0.' });
      return;
    }

    setLoading(true);
    try {
      const res = await buyCoins(uid, parsedInr, calculatedCoins, provider);
      setToast({
        type: 'success',
        msg: `Successfully bought ${formatCoins(calculatedCoins)} phoneG coins!`,
      });
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: any) {
      console.error('Buy coins error:', err);
      setToast({ type: 'error', msg: err.message || 'Payment processing failed.' });
    } finally {
      setLoading(false);
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

      <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#20244F]">Buy phoneG Coins</h3>
          <p className="text-xs text-gray-500">1 INR = 1 phoneG Coin • No Hidden Charges</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#397EF5] flex items-center justify-center">
          <ShoppingBag className="w-5 h-5" />
        </div>
      </div>

      <form onSubmit={handleBuy} className="space-y-4">
        {/* INR Amount Input */}
        <AppInput
          label="Enter Amount (INR ₹)"
          placeholder="e.g. 500"
          type="number"
          value={amountInr}
          onChange={(e) => setAmountInr(e.target.value)}
          leftIcon={<span className="font-bold text-gray-500 text-sm">₹</span>}
        />

        {/* Quick Amount Chips */}
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmountInr(amt.toString())}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                amountInr === amt.toString()
                  ? 'bg-[#397EF5] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              +₹{amt}
            </button>
          ))}
        </div>

        {/* Conversion Summary Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              You will receive
            </p>
            <p className="text-xl font-black text-[#397EF5]">
              {formatCoins(calculatedCoins)} COINS
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Total Payable
            </p>
            <p className="text-lg font-bold text-[#20244F]">
              {formatCurrency(parsedInr)}
            </p>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#20244F] uppercase tracking-wider">
            Select Payment Method
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'UPI', name: 'BHIM UPI', icon: <QrCode className="w-4 h-4" /> },
              { id: 'CARD', name: 'Debit/Credit Card', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'NETBANKING', name: 'NetBanking', icon: <Landmark className="w-4 h-4" /> },
              { id: 'MOCK_PG', name: 'Instant PG Simulator', icon: <CheckCircle2 className="w-4 h-4" /> },
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setProvider(method.id as any)}
                className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                  provider === method.id
                    ? 'border-[#397EF5] bg-blue-50/50 text-[#397EF5] font-bold ring-2 ring-[#397EF5]/20'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="p-1.5 rounded-lg bg-white shadow-2xs">
                  {method.icon}
                </div>
                <span className="text-xs font-medium truncate">{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <AppButton
            type="submit"
            variant="primary"
            isLoading={loading}
            icon={<ShieldCheck className="w-4 h-4" />}
          >
            PAY {formatCurrency(parsedInr)} & ADD COINS
          </AppButton>
        </div>
      </form>
    </div>
  );
};
