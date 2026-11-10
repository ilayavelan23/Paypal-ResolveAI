import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Eye,
  MoreHorizontal,
  ShieldCheck,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MetricCards } from '../dashboard/MetricCards';
import { MerchantIcon } from '../common/MerchantIcon';
import { StatusBadge } from '../common/StatusBadge';

export const TransactionsView: React.FC = () => {
  const { transactions, selectTransaction } = useApp();
  const [activeSourceFilter, setActiveSourceFilter] = useState<'All' | 'PayPal' | 'Demo' | 'Unavailable'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');

  // Filter & Search Logic
  const filteredTransactions = transactions.filter((tx) => {
    // Source filter
    if (activeSourceFilter === 'PayPal' && tx.source !== 'PayPal') return false;
    if (activeSourceFilter === 'Demo' && tx.source !== 'Demo') return false;
    if (activeSourceFilter === 'Unavailable' && tx.source !== 'Unavailable') return false;

    // Status filter
    if (statusFilter !== 'All' && tx.status !== statusFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesMerchant = tx.merchant.toLowerCase().includes(q);
      const matchesId = tx.id.toLowerCase().includes(q);
      const matchesAmt = tx.amount.toString().includes(q);
      if (!matchesMerchant && !matchesId && !matchesAmt) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'amount') {
      return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    }
    // Default date sorting
    return sortOrder === 'desc' ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id);
  });

  const paypalCount = transactions.filter((t) => t.source === 'PayPal').length;
  const demoCount = transactions.filter((t) => t.source === 'Demo').length;

  return (
    <div className="space-y-6 pb-12">
      {/* 4 Metric KPI Summary Cards */}
      <MetricCards onCardClick={(type) => {
        if (type === 'all') setStatusFilter('All');
        if (type === 'completed') setStatusFilter('Completed');
        if (type === 'pending') setStatusFilter('Pending');
        if (type === 'failed') setStatusFilter('Failed');
      }} />

      {/* Main Transactions Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 sm:p-6 space-y-5">
        {/* Top Control Bar: Tabs & Date Dropdown */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Source Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveSourceFilter('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeSourceFilter === 'All'
                  ? 'bg-[#0070BA] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({transactions.length})
            </button>
            <button
              onClick={() => setActiveSourceFilter('PayPal')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeSourceFilter === 'PayPal'
                  ? 'bg-[#0070BA] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              PayPal Data ({paypalCount})
            </button>
            <button
              onClick={() => setActiveSourceFilter('Demo')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeSourceFilter === 'Demo'
                  ? 'bg-[#0070BA] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Simulated ({demoCount})
            </button>
            <button
              onClick={() => setActiveSourceFilter('Unavailable')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeSourceFilter === 'Unavailable'
                  ? 'bg-[#0070BA] text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-100'
              }`}
            >
              Unavailable (0)
            </button>
          </div>

          {/* Date Selector & Export */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors">
              <span>{selectedRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Search & Secondary Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by merchant, amount, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0070BA] focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0070BA]"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            <button
              onClick={() => {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Merchant / Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No transactions match your search or filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => selectTransaction(tx.id)}
                    className="group hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-xs">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <MerchantIcon name={tx.merchant} className="w-6 h-6 shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {tx.merchant}
                          </span>
                          <span className="block text-[10px] text-slate-400">{tx.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      ${tx.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
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
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectTransaction(tx.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details & AI Investigation"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>Showing {filteredTransactions.length} of {transactions.length} transactions</span>
          <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">All Demo Data Clearly Labeled</span>
        </div>
      </div>
    </div>
  );
};
