import React from 'react';
import { WelcomeBanner } from './WelcomeBanner';
import { MetricCards } from './MetricCards';
import { TransactionOverviewChart } from './TransactionOverviewChart';
import { RiskSignalsCard } from './RiskSignalsCard';
import { RecentTransactionsTable } from './RecentTransactionsTable';
import { AiAssistantQuickCard } from './AiAssistantQuickCard';
import { DailyHealthSummary } from './DailyHealthSummary';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* 4 Metric KPI Cards */}
      <MetricCards onCardClick={() => navigateTo('transactions')} />

      {/* Main Grid: Left 2 cols, Right 1 col on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TransactionOverviewChart />
            <RiskSignalsCard />
          </div>

          <RecentTransactionsTable />
        </div>

        {/* Right Column (1 col wide on desktop) */}
        <div className="space-y-6">
          <AiAssistantQuickCard />
          <DailyHealthSummary />
        </div>
      </div>
    </div>
  );
};
