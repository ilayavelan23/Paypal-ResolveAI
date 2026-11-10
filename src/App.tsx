import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { AiAssistantView } from './components/ai/AiAssistantView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { TransactionDetailView } from './components/transactions/TransactionDetailView';
import { FraudDetectionView } from './components/fraud/FraudDetectionView';
import { RefundCenterView } from './components/refund/RefundCenterView';
import { DisputeAssistantView } from './components/dispute/DisputeAssistantView';
import { MultiAgentMatrixView } from './components/ai/MultiAgentMatrixView';
import { SettingsView } from './components/settings/SettingsView';
import { AuthViews } from './components/auth/AuthViews';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function AppContent() {
  const { currentTab, isAuthenticated, toastMessage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If viewing public auth views or not signed in
  const isAuthView =
    currentTab === 'auth-landing' ||
    currentTab === 'auth-signin' ||
    currentTab === 'auth-signup' ||
    currentTab === 'auth-forgot' ||
    !isAuthenticated;

  if (isAuthView) {
    return <AuthViews />;
  }

  return (
    <div className="min-h-screen bg-[#F4F7FC] flex">
      {/* Sidebar */}
      <Sidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Workspace */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Header */}
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && <DashboardView />}
          {currentTab === 'ai-assistant' && <AiAssistantView />}
          {currentTab === 'transactions' && <TransactionsView />}
          {currentTab === 'transaction-detail' && <TransactionDetailView />}
          {currentTab === 'fraud-detection' && <FraudDetectionView />}
          {currentTab === 'refund-center' && <RefundCenterView />}
          {currentTab === 'dispute-assistant' && <DisputeAssistantView />}
          {currentTab === 'multi-agent' && <MultiAgentMatrixView />}
          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 animate-bounce duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
