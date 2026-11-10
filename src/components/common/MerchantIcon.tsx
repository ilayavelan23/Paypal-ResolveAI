import React from 'react';
import { ShoppingBag, Gamepad2 } from 'lucide-react';

interface MerchantIconProps {
  name: string;
  className?: string;
}

export const MerchantIcon: React.FC<MerchantIconProps> = ({ name, className = 'w-6 h-6' }) => {
  const lower = name.toLowerCase();

  if (lower.includes('amazon')) {
    return (
      <div className={`rounded-lg bg-black text-white font-bold flex items-center justify-center text-xs shadow-xs ${className}`}>
        <span className="font-serif lowercase font-black text-amber-400">a</span>
      </div>
    );
  }

  if (lower.includes('flipkart')) {
    return (
      <div className={`rounded-lg bg-[#2874F0] text-yellow-300 font-bold flex items-center justify-center text-xs italic shadow-xs ${className}`}>
        <span>f</span>
      </div>
    );
  }

  if (lower.includes('netflix')) {
    return (
      <div className={`rounded-lg bg-black text-[#E50914] font-black flex items-center justify-center text-xs shadow-xs ${className}`}>
        <span>N</span>
      </div>
    );
  }

  if (lower.includes('gaming') || lower.includes('steam') || lower.includes('playstation')) {
    return (
      <div className={`rounded-lg bg-slate-700 text-blue-300 flex items-center justify-center shadow-xs p-1 ${className}`}>
        <Gamepad2 className="w-full h-full" />
      </div>
    );
  }

  if (lower.includes('google')) {
    return (
      <div className={`rounded-lg bg-white border border-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs shadow-xs ${className}`}>
        <span className="text-red-500 font-black">G</span>
      </div>
    );
  }

  if (lower.includes('apple')) {
    return (
      <div className={`rounded-lg bg-zinc-900 text-white font-bold flex items-center justify-center text-xs shadow-xs ${className}`}>
        <span></span>
      </div>
    );
  }

  if (lower.includes('spotify')) {
    return (
      <div className={`rounded-lg bg-[#1DB954] text-black font-bold flex items-center justify-center text-xs shadow-xs ${className}`}>
        <span>♫</span>
      </div>
    );
  }

  return (
    <div className={`rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center p-1 ${className}`}>
      <ShoppingBag className="w-full h-full" />
    </div>
  );
};
