'use client';

import React from 'react';
import { Transaction } from '@/types/transaction';
import { formatCoins, formatDate } from '@/lib/formatters';
import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Gift, ChevronRight } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
  currentUid: string;
  onViewAll: () => void;
  isLoading?: boolean;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  currentUid,
  onViewAll,
  isLoading = false,
}) => {
  const recent = transactions.slice(0, 5);

  return (
    <div className="w-full space-y-3 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#20244F] uppercase tracking-wider">
          Recent Transactions
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[#397EF5] hover:underline flex items-center"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl p-6 text-center text-xs text-gray-400 border border-gray-100 shadow-xs">
          Loading recent transactions...
        </div>
      ) : recent.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center space-y-2 border border-gray-100 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#397EF5] mx-auto flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-[#20244F]">No transactions yet</p>
          <p className="text-[11px] text-gray-400">
            Buy or send coins to see your transaction history here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((tx) => {
            const isSender = tx.senderUid === currentUid;
            const isBuy = tx.transactionType === 'buy';
            const isBonus = tx.transactionType === 'bonus';

            let icon = <ArrowUpRight className="w-4 h-4 text-red-500" />;
            let iconBg = 'bg-red-50';
            let amountPrefix = '-';
            let amountColor = 'text-red-600';
            let title = `Sent to ${tx.recipientUserId || 'User'}`;

            if (isBuy) {
              icon = <ShoppingBag className="w-4 h-4 text-[#397EF5]" />;
              iconBg = 'bg-blue-50';
              amountPrefix = '+';
              amountColor = 'text-[#397EF5]';
              title = 'Bought phoneG Coins';
            } else if (!isSender || isBonus) {
              icon = <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
              iconBg = 'bg-emerald-50';
              amountPrefix = '+';
              amountColor = 'text-emerald-600';
              title = isBonus
                ? 'Welcome Bonus Coins'
                : `Received from ${tx.senderUserId || 'User'}`;
            }

            return (
              <div
                key={tx.transactionId}
                className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs hover:border-gray-200 transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 overflow-hidden pr-2">
                  <div
                    className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}
                  >
                    {icon}
                  </div>

                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#20244F] truncate">{title}</p>
                    <p className="text-[10px] text-gray-400">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-extrabold ${amountColor}`}>
                    {amountPrefix}
                    {formatCoins(tx.coinAmount)}
                  </p>
                  <p className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                    {tx.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
