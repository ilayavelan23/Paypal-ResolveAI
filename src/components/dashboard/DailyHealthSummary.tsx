import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DailyHealthSummary: React.FC = () => {
  const { navigateTo } = useApp();
  const score = 92;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
              Daily Payment-Health Summary
            </h3>
            <p className="text-[11px] text-slate-500">AI-generated insights for your account</p>
          </div>
        </div>

        {/* Circular Donut + Checklist Grid */}
        <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
          {/* Circular Donut */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-100"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 leading-none">{score}%</span>
              <span className="text-[10px] font-semibold text-slate-500 mt-1">Health Score</span>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Most transactions are successful</span>
            </div>
            <div
              onClick={() => navigateTo('fraud-detection')}
              className="flex items-center gap-2 text-slate-700 hover:text-amber-700 cursor-pointer transition-colors"
            >
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-medium underline decoration-amber-300">3 transactions need attention</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>No critical fraud detected</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Payment activity is within normal range</span>
            </div>
          </div>
        </div>
      </div>

      {/* ResolveAI Insight Box */}
      <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-150/60 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#0070BA] shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-slate-900">ResolveAI Insight: </span>
          <span className="text-slate-600">
            Your payment activity looks healthy. Review the 3 flagged transactions to keep your account secure.
          </span>
        </div>
      </div>
    </div>
  );
};
