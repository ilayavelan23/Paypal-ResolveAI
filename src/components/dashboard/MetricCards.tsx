import React from 'react';
import { ArrowLeftRight, CheckCircle2, Clock, XCircle, ArrowUpRight, ArrowDownRight, MoveRight } from 'lucide-react';

interface MetricCardsProps {
  onCardClick?: (filterType: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ onCardClick }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Transactions */}
      <div
        onClick={() => onCardClick?.('all')}
        className="cursor-pointer group p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 shadow-xs hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            +12%
          </span>
        </div>
        <div className="mt-3">
          <p className="text-xs font-medium text-slate-500">Total Transactions</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">42</p>
        </div>
      </div>

      {/* 2. Successful */}
      <div
        onClick={() => onCardClick?.('completed')}
        className="cursor-pointer group p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 shadow-xs hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            +15%
          </span>
        </div>
        <div className="mt-3">
          <p className="text-xs font-medium text-slate-500">Successful</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">34</p>
        </div>
      </div>

      {/* 3. Pending */}
      <div
        onClick={() => onCardClick?.('pending')}
        className="cursor-pointer group p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 hover:border-amber-200 shadow-xs hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            <MoveRight className="w-3 h-3 mr-0.5" />
            0%
          </span>
        </div>
        <div className="mt-3">
          <p className="text-xs font-medium text-slate-500">Pending</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">4</p>
        </div>
      </div>

      {/* 4. Failed */}
      <div
        onClick={() => onCardClick?.('failed')}
        className="cursor-pointer group p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 hover:border-rose-200 shadow-xs hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
            <ArrowDownRight className="w-3 h-3 mr-0.5" />
            -20%
          </span>
        </div>
        <div className="mt-3">
          <p className="text-xs font-medium text-slate-500">Failed</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">4</p>
        </div>
      </div>
    </div>
  );
};
