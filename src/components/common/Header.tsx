import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  Menu,
  ArrowLeft,
  User,
  ShieldCheck,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { currentTab, navigateTo, user, sandboxConfig, setIsAuthenticated } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Tab Titles and Subtitles matching reference designs
  const getTabMeta = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Overview of your payments, risks, and AI insights' };
      case 'ai-assistant':
        return { title: 'AI Assistant', subtitle: 'Get help with payments, refunds, disputes and security using multi-agent AI' };
      case 'transactions':
        return { title: 'Transactions', subtitle: 'View, search, and analyze your payment activity' };
      case 'transaction-detail':
        return {
          title: 'Transaction Details',
          subtitle: 'View payment information, AI analysis, and recommended actions',
          hasBack: true
        };
      case 'fraud-detection':
        return { title: 'Fraud Detection', subtitle: 'Monitor suspicious activity and payment risks' };
      case 'refund-center':
        return { title: 'Refund Center', subtitle: 'Track refunds, check eligibility, and get guidance' };
      case 'dispute-assistant':
        return { title: 'Dispute Assistant', subtitle: 'Get help with payment disputes and resolution' };
      case 'multi-agent':
        return { title: 'Multi-Agent AI Workspace', subtitle: 'Inspect autonomous agent coordination, reasoning logs and confidence' };
      case 'settings':
        return { title: 'Settings', subtitle: 'Manage your account, PayPal connection, security, and preferences' };
      default:
        return { title: 'PayPal ResolveAI', subtitle: 'AI-Powered Payment Assistant' };
    }
  };

  const meta = getTabMeta();

  return (
    <header className="sticky top-0 z-30 bg-[#F4F7FC]/90 backdrop-blur-md px-4 sm:px-8 py-4 border-b border-slate-200/70 flex items-center justify-between">
      {/* Left Title / Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {meta.hasBack && (
          <button
            onClick={() => navigateTo('transactions')}
            className="p-1.5 -ml-1 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            title="Back to Transactions"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            {meta.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls: Notifications & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4 relative">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-xs transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-900">Notifications</span>
                <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div
                  onClick={() => { setShowNotifications(false); navigateTo('fraud-detection'); }}
                  className="py-3 flex items-start gap-2.5 hover:bg-slate-50 cursor-pointer rounded-lg px-1 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Possible duplicate payment</p>
                    <p className="text-slate-500 text-[11px]">2 similar payments of $49.99 flagged for Amazon India.</p>
                    <span className="text-[10px] text-slate-400">10 mins ago</span>
                  </div>
                </div>

                <div
                  onClick={() => { setShowNotifications(false); navigateTo('refund-center'); }}
                  className="py-3 flex items-start gap-2.5 hover:bg-slate-50 cursor-pointer rounded-lg px-1 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Refund #RF-784291 is processing</p>
                    <p className="text-slate-500 text-[11px]">Estimated settlement within 1-3 business days.</p>
                    <span className="text-[10px] text-slate-400">2 hours ago</span>
                  </div>
                </div>

                <div
                  onClick={() => { setShowNotifications(false); navigateTo('settings'); }}
                  className="py-3 flex items-start gap-2.5 hover:bg-slate-50 cursor-pointer rounded-lg px-1 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">PayPal Sandbox Token Active</p>
                    <p className="text-slate-500 text-[11px]">Environment sync validated on {sandboxConfig.lastSync}.</p>
                    <span className="text-[10px] text-slate-400">Today</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs transition-colors"
          >
            {/* Avatar Circle with initials "MI" */}
            <div className="w-8 h-8 rounded-full bg-[#0070BA] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user.avatarInitials}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {user.name}
              </div>
              <div className="text-[11px] text-slate-500 leading-tight">
                {user.accountType}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* User Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Account</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setShowProfileMenu(false); navigateTo('settings'); }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Account & Profile
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); navigateTo('settings'); }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  PayPal Connection
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); navigateTo('auth-landing'); }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  View Landing Page
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setIsAuthenticated(false);
                    navigateTo('auth-signin');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
