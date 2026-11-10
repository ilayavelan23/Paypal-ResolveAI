import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  AlertOctagon,
  TrendingUp,
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/RiskBadge';

export const FraudDetectionView: React.FC = () => {
  const { transactions, selectTransaction, showToast } = useApp();
  const [selectedFlaggedTx, setSelectedFlaggedTx] = useState<any | null>(null);

  // Filter flagged transactions
  const flaggedList = transactions.filter((t) => t.riskLevel === 'High' || t.riskLevel === 'Medium').slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* 4 Risk KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Risky Transactions */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4" />
              Risky Transactions
            </span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">3</span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-rose-600 tracking-tight">3</p>
            <p className="text-[11px] text-slate-400 mt-0.5">High anomaly patterns</p>
          </div>
        </div>

        {/* Medium Risk */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Medium Risk
            </span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">5</span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-amber-600 tracking-tight">5</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Require user confirmation</p>
          </div>
        </div>

        {/* Low Risk */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Low Risk
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">8</span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-blue-600 tracking-tight">8</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Verified normal activity</p>
          </div>
        </div>

        {/* Overall Risk */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-tr from-amber-500/10 via-amber-50 to-white border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Overall Risk
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-amber-700 tracking-tight">Medium</p>
              <p className="text-[11px] text-amber-600/80 mt-0.5">Controlled status</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              🛡️
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Risk Activity Multi-line Chart & Risk Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 30-Day Multi-tier Risk Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Risk Activity (Last 30 Days)</h3>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Medium
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Low
              </span>
            </div>
          </div>

          {/* SVG Chart with 3 lines */}
          <div className="relative w-full h-44 sm:h-52">
            <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
              {/* Horizontal grid lines */}
              {[0, 3, 6, 9, 12, 15].map((val) => {
                const y = 180 - 25 - (val / 15) * (180 - 50);
                return (
                  <g key={val}>
                    <line x1="40" y1={y} x2="460" y2={y} stroke="#F1F5F9" strokeDasharray="3 3" />
                    <text x="30" y={y + 3} fill="#94A3B8" fontSize="9" textAnchor="end">{val}</text>
                  </g>
                );
              })}

              {/* High Risk Line (Red) */}
              <path
                d="M 40 145 C 90 142, 140 135, 190 130 C 240 128, 290 120, 340 115 C 390 100, 440 110, 460 105"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="340" cy="115" r="3.5" fill="#EF4444" />
              <circle cx="460" cy="105" r="3.5" fill="#EF4444" />

              {/* Medium Risk Line (Amber) */}
              <path
                d="M 40 130 C 90 120, 140 110, 190 125 C 240 135, 290 90, 340 95 C 390 85, 440 90, 460 80"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="290" cy="90" r="3.5" fill="#F59E0B" />
              <circle cx="460" cy="80" r="3.5" fill="#F59E0B" />

              {/* Low Risk Line (Blue) */}
              <path
                d="M 40 110 C 90 95, 140 85, 190 60 C 240 90, 290 50, 340 40 C 390 35, 440 60, 460 50"
                fill="none"
                stroke="#0070BA"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="340" cy="40" r="3.5" fill="#0070BA" />
              <circle cx="460" cy="50" r="3.5" fill="#0070BA" />

              {/* X Axis Dates */}
              {['Oct 10', 'Oct 14', 'Oct 18', 'Oct 22', 'Oct 26', 'Oct 30', 'Nov 03', 'Nov 07'].map((d, i) => (
                <text
                  key={i}
                  x={40 + (i / 7) * 420}
                  y={180 - 6}
                  fill="#64748B"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {d}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Right: Risk Insights */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Risk Insights</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="text-xs font-bold text-amber-950">2 possible duplicate payments</h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">Identical authorizations detected within short windows.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200/80 flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-950">Unusual payment frequency</h4>
                  <p className="text-[11px] text-rose-800 mt-0.5">5 payments dispatched in under 10 minutes.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-950">High amount transaction ($999.00)</h4>
                  <p className="text-[11px] text-blue-800 mt-0.5">Purchase exceeds usual daily category volume.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                2FA Protection Active
              </span>
              <span className="text-[10px] text-slate-400">Audited in Real-Time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Flagged Transactions</h3>
          </div>
          <span className="text-xs text-slate-500">Showing top flagged security items</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {flaggedList.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-xs">
                    {tx.date}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {tx.merchant}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <RiskBadge level={tx.riskLevel} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    {tx.flaggedReason || 'Unusual payment frequency or velocity spike'}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => selectTransaction(tx.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
