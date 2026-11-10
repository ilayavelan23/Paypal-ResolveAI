import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  ArrowLeftRight,
  ShieldAlert,
  RotateCcw,
  Scale,
  Settings,
  Bot,
  Sparkles,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile = false, onCloseMobile }) => {
  const { currentTab, navigateTo, sandboxConfig } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-3" /> },
    { id: 'ai-assistant', label: 'AI Assistant', icon: <MessageSquare className="w-4 h-4 mr-3" /> },
    { id: 'transactions', label: 'Transactions', icon: <ArrowLeftRight className="w-4 h-4 mr-3" /> },
    { id: 'fraud-detection', label: 'Fraud Detection', icon: <ShieldAlert className="w-4 h-4 mr-3" /> },
    { id: 'refund-center', label: 'Refund Center', icon: <RotateCcw className="w-4 h-4 mr-3" /> },
    { id: 'dispute-assistant', label: 'Dispute Assistant', icon: <Scale className="w-4 h-4 mr-3" /> },
    { id: 'multi-agent', label: 'Multi-Agent AI', icon: <Layers className="w-4 h-4 mr-3" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4 mr-3" /> }
  ];

  const handleNavClick = (id: NavigationTab) => {
    navigateTo(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#071426] text-white flex flex-col justify-between
        transition-transform duration-300 ease-in-out border-r border-[#15253d]
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header & Brand */}
        <div className="p-5 pb-3">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#003087] via-[#0070BA] to-[#009cde] flex items-center justify-center shadow-md shadow-blue-900/40">
              {/* PayPal double P icon */}
              <div className="text-white font-black italic text-lg tracking-tighter select-none">
                P<span className="-ml-1 text-sky-200">P</span>
              </div>
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                PayPal ResolveAI
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">AI-Powered Payment Assistant</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id ||
                (item.id === 'transactions' && currentTab === 'transaction-detail');

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                    ${isActive
                      ? 'bg-[#0070BA] text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'}
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Middle / Lower Content: Data Source badges & AI Badge */}
        <div className="p-5 pt-0 space-y-5">
          {/* Data Source Block */}
          <div className="bg-[#0b1a30] rounded-xl p-3.5 border border-[#182a46]">
            <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2.5">
              Data Source
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>PayPal Data</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sandboxConfig.connected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
                  {sandboxConfig.connected ? 'Connected' : 'Offline'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>Simulated Data</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-950 text-blue-300 border border-blue-800">
                  Demo
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  <span>Unavailable Data</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
                  N/A
                </span>
              </div>
            </div>
          </div>

          {/* ResolveAI Card */}
          <div
            onClick={() => handleNavClick('multi-agent')}
            className="group relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-[#0c2446] via-[#091b35] to-[#061122] border border-[#1b355a] shadow-lg cursor-pointer hover:border-blue-500/50 transition-all"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/20 transition-colors"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#08182f] rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  ResolveAI
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </h4>
                <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                  Multi-Agent AI for Payments, Refunds & Disputes
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
