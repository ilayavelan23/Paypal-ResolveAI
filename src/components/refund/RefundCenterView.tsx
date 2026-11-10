import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  Bot,
  HelpCircle,
  Check,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MerchantIcon } from '../common/MerchantIcon';

export const RefundCenterView: React.FC = () => {
  const { activeRefund, transactions, submitRefundRequest, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'my-refunds' | 'eligibility' | 'how-it-works'>('my-refunds');
  const [selectedTxId, setSelectedTxId] = useState<string>(transactions[0]?.id || 'PP-8F7K2D1');
  const [refundReason, setRefundReason] = useState<string>('Item not received or order cancelled');

  const selectedTx = transactions.find((t) => t.id === selectedTxId) || transactions[0];

  const handleCreateRefund = (e: React.FormEvent) => {
    e.preventDefault();
    submitRefundRequest(selectedTx.id, refundReason);
    setActiveTab('my-refunds');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Sub-navigation tabs matching Image 5 */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab('my-refunds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'my-refunds'
              ? 'bg-[#0070BA] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>My Refunds</span>
        </button>

        <button
          onClick={() => setActiveTab('eligibility')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'eligibility'
              ? 'bg-[#0070BA] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Refund Eligibility</span>
        </button>

        <button
          onClick={() => setActiveTab('how-it-works')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'how-it-works'
              ? 'bg-[#0070BA] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>How It Works</span>
        </button>
      </div>

      {/* Tab 1: My Refunds */}
      {activeTab === 'my-refunds' && (
        <div className="space-y-6">
          {/* Active Refund Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-slate-900 text-lg">
                    Refund #{activeRefund.id}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    {activeRefund.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Requested: {activeRefund.requestedDate}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 font-medium">Refund Amount</span>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">
                  ${activeRefund.amount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Merchant info */}
            <div className="py-4 flex items-center gap-3">
              <MerchantIcon name={activeRefund.merchant} className="w-8 h-8" />
              <div>
                <span className="text-xs text-slate-400">Merchant</span>
                <p className="text-sm font-bold text-slate-800">{activeRefund.merchant}</p>
              </div>
            </div>

            {/* Stepper matching reference design */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                {/* Step 1 */}
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="hidden sm:block h-0.5 flex-1 bg-emerald-500"></span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">Request Submitted</h4>
                  <p className="text-[11px] text-slate-500">Nov 06</p>
                </div>

                {/* Step 2 */}
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="hidden sm:block h-0.5 flex-1 bg-blue-500"></span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">Under Review</h4>
                  <p className="text-[11px] text-slate-500">Nov 06</p>
                </div>

                {/* Step 3 (Current) */}
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0070BA] ring-4 ring-blue-100 text-white flex items-center justify-center text-xs font-bold shadow-xs animate-pulse">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="hidden sm:block h-0.5 flex-1 bg-slate-200"></span>
                  </div>
                  <h4 className="text-xs font-bold text-[#0070BA] mt-1">Processing</h4>
                  <p className="text-[11px] text-slate-500">1–3 business days</p>
                </div>

                {/* Step 4 */}
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-400 mt-1">Refunded</h4>
                  <p className="text-[11px] text-slate-400">Final Credit</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Refund Guidance Card */}
          <div className="bg-gradient-to-r from-blue-50/80 via-sky-50/60 to-white rounded-2xl border border-blue-150 p-5 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#003087] to-[#0070BA] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-sm">AI Refund Guidance</h4>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                {activeRefund.guidance}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Eligible for Buyer Protection
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" /> Estimated by {activeRefund.estimatedResolution}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Refund Eligibility Checker */}
      {activeTab === 'eligibility' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-base font-bold text-slate-900">Interactive Refund Eligibility Checker</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select an existing transaction to evaluate refund rules, merchant policy window, and automated filing.
            </p>
          </div>

          <form onSubmit={handleCreateRefund} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Transaction</label>
              <select
                value={selectedTxId}
                onChange={(e) => setSelectedTxId(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0070BA]"
              >
                {transactions.slice(0, 8).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} — {t.merchant} (${t.amount.toFixed(2)}) • {t.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Reason for Refund</label>
              <textarea
                rows={3}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Describe reason (e.g. duplicate charge, damaged item, unauthorized order)..."
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0070BA]"
              />
            </div>

            {/* AI Eligibility Result Preview */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Eligibility Score: 98% (High Likelihood of Instant Approval)</span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-1">
                Transaction initiated within the past 180 days with verified payment credentials.
              </p>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl font-bold text-xs bg-[#0070BA] hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              Request Refund for ${selectedTx.amount.toFixed(2)}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: How It Works */}
      {activeTab === 'how-it-works' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
          <h3 className="text-base font-bold text-slate-900">How PayPal ResolveAI Refunds Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mb-2">1</span>
              <h4 className="font-bold text-xs text-slate-900">Submit Request</h4>
              <p className="text-[11px] text-slate-500 mt-1">Provide the order ID and reason. ResolveAI formats the claim according to PayPal guidelines.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mb-2">2</span>
              <h4 className="font-bold text-xs text-slate-900">Merchant Review</h4>
              <p className="text-[11px] text-slate-500 mt-1">The merchant has 48 hours to acknowledge or dispute the return request.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mb-2">3</span>
              <h4 className="font-bold text-xs text-slate-900">Processing</h4>
              <p className="text-[11px] text-slate-500 mt-1">Once approved, PayPal processes the fund reversal back to your balance or original card in 1-3 business days.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mb-2">4</span>
              <h4 className="font-bold text-xs text-slate-900">Settlement</h4>
              <p className="text-[11px] text-slate-500 mt-1">Credit confirmation receipt is issued and your account balance is updated.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
