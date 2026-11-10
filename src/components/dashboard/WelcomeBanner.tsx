import React from 'react';
import { Sparkles } from 'lucide-react';

export const WelcomeBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50/80 via-sky-50/70 to-indigo-50/60 p-6 sm:p-7 border border-blue-150/70 shadow-xs">
      {/* Decorative background glow & PayPal emblem */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end pr-6 pointer-events-none opacity-20 sm:opacity-85">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36">
          {/* Stylized 3D PayPal Double P Mark */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#003087] via-[#0070BA] to-[#009cde] rounded-3xl rotate-12 blur-xs opacity-75"></div>
          <div className="absolute inset-2 bg-gradient-to-tr from-[#0070BA] to-[#00cfde] rounded-2xl rotate-6 flex items-center justify-center shadow-xl">
            <span className="text-white font-black italic text-4xl sm:text-5xl tracking-tighter">
              P<span className="-ml-2 text-sky-200">P</span>
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Fintech Intelligence Engine</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Welcome to PayPal ResolveAI 👋
        </h2>
        <p className="mt-1 text-sm sm:text-base text-slate-600 leading-relaxed">
          Your intelligent assistant for payments, fraud checks, refunds and disputes.
        </p>
      </div>
    </div>
  );
};
