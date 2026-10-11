'use client';

import React, { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { formatCoins, formatDate } from '@/lib/formatters';
import { AppInput } from '../common/AppInput';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  currentUid: string;
  isLoading?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  currentUid,
  isLoading = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter((tx) => {
    const isSender = tx.senderUid === currentUid;
    const isCredit = !isSender || tx.transactionType === 'buy' || tx.transactionType === 'bonus';

    if (filter === 'credit' && !isCredit) return false;
    if (filter === 'debit' && isCredit) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTxId = tx.transactionId.toLowerCase().includes(q);
      const matchSender = (tx.senderUserId || '').toLowerCase().includes(q);
      const matchRecipient = (tx.recipientUserId || '').toLowerCase().includes(q);
      const matchNote = (tx.note || '').toLowerCase().includes(q);
      return matchTxId || matchSender || matchRecipient || matchNote;
    }

    return true;
  });

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4 text-left">
      <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#20244F]">Transaction History</h3>
          <p className="text-xs text-gray-500">
            Real-time record of all your coin operations
          </p>
        </div>
        <div className="px-3 py-1 bg-blue-50 text-[#397EF5] font-bold text-xs rounded-full">
          {filtered.length} Records
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <AppInput
          placeholder="Search by Tx ID, name or note..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-gray-400" />}
        />

        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'credit', label: 'Credits (+)' },
            { id: 'debit', label: 'Debits (-)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex-1 py-2 text-center rounded-lg transition-all ${
                filter === tab.id
                  ? 'bg-white text-[#397EF5] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      {isLoading ? (
        <div className="py-8 text-center text-xs text-gray-400">
          Loading transactions...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-400">
          No transactions match your query.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((tx) => {
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
                className="bg-gray-50/70 border border-gray-100 hover:border-gray-200 rounded-2xl p-3.5 space-y-2 transition-all"
              >
                <div className="flex items-center justify-between">
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
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 mr-0.5" />
                      Completed
                    </span>
                  </div>
                </div>

                {/* Additional Tx Details */}
                <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                  <span>Tx ID: {tx.transactionId}</span>
                  {tx.fee > 0 && <span>Fee: {tx.fee} Coins</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
