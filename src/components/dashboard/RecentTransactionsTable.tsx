import React from 'react';
import { CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MerchantIcon } from '../common/MerchantIcon';
import { StatusBadge } from '../common/StatusBadge';

export const RecentTransactionsTable: React.FC = () => {
  const { transactions, navigateTo, selectTransaction } = useApp();

  // Top 5 recent transactions
  const recentList = transactions.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Recent Transactions</h3>
        </div>

        <button
          onClick={() => navigateTo('transactions')}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0070BA] hover:text-blue-700 hover:underline transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              <th className="pb-3 pr-4">Date & Time</th>
              <th className="pb-3 pr-4">Description</th>
              <th className="pb-3 pr-4">Amount</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {recentList.map((tx) => (
              <tr
                key={tx.id}
                onClick={() => selectTransaction(tx.id)}
                className="group hover:bg-blue-50/60 cursor-pointer transition-colors"
              >
                <td className="py-3.5 pr-4 text-slate-500 whitespace-nowrap text-xs">
                  {tx.date}
                </td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2.5">
                    <MerchantIcon name={tx.merchant} className="w-6 h-6 shrink-0" />
                    <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {tx.merchant}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 pr-4 font-bold text-slate-900 whitespace-nowrap">
                  ${tx.amount.toFixed(2)}
                </td>
                <td className="py-3.5 pr-4 whitespace-nowrap">
                  <StatusBadge status={tx.status} />
                </td>
                <td className="py-3.5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                    {tx.source === 'PayPal' ? (
                      <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                        <span className="text-[10px] font-black italic bg-blue-100 px-1 rounded text-blue-700">PP</span>
                        PayPal
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                        Demo
                      </span>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
