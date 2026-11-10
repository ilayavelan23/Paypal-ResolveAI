import React from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RiskSignalsCard: React.FC = () => {
  const { riskSignals, navigateTo, selectTransaction } = useApp();

  const handleSignalClick = (txId?: string) => {
    if (txId) {
      selectTransaction(txId);
    } else {
      navigateTo('fraud-detection');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Risk Signals</h3>
          </div>
          <span className="inline-flex items-center text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200/70 px-2.5 py-0.5 rounded-full">
            3 active alerts
          </span>
        </div>

        {/* Signals List */}
        <div className="space-y-3">
          {riskSignals.map((signal) => {
            const isHigh = signal.severity === 'High';
            const isMedium = signal.severity === 'Medium';

            return (
              <div
                key={signal.id}
                onClick={() => handleSignalClick(signal.transactionId)}
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isHigh
                      ? 'bg-rose-100 text-rose-600'
                      : isMedium
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-blue-100 text-blue-600'
                  }`}>
                    {isHigh ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : isMedium ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {signal.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {signal.subtitle}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={() => navigateTo('fraud-detection')}
          className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          View all risk assessments →
        </button>
      </div>
    </div>
  );
};
