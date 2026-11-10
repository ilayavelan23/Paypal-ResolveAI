import React, { useState } from 'react';
import {
  Copy,
  Check,
  Bot,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Scale,
  FileText,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';

export const TransactionDetailView: React.FC = () => {
  const { selectedTransactionId, transactions, navigateTo, submitRefundRequest, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const tx = transactions.find((t) => t.id === selectedTransactionId) || transactions[0];

  const handleCopyId = () => {
    navigator.clipboard?.writeText(tx.id);
    setCopied(true);
    showToast(`Copied ${tx.id} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Upper Grid: 2 Main Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: Transaction Information Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070BA] flex items-center justify-center font-black italic text-lg shadow-xs">
                  P
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      Transaction #{tx.id}
                    </h2>
                    <StatusBadge status={tx.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Payment to {tx.merchant}</p>
                </div>
              </div>
            </div>

            {/* Details Table */}
            <div className="divide-y divide-slate-100 text-xs sm:text-sm mt-3">
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Transaction ID</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <span>{tx.id}</span>
                  <button
                    onClick={handleCopyId}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                    title="Copy Transaction ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Merchant</span>
                <span className="font-semibold text-slate-800">{tx.merchant}</span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Amount</span>
                <span className="font-extrabold text-slate-900">${tx.amount.toFixed(2)} ({tx.currency})</span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Status</span>
                <StatusBadge status={tx.status} />
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Payment Method</span>
                <span className="font-medium text-slate-700">{tx.paymentMethod}</span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Initiated On</span>
                <span className="font-medium text-slate-700">{tx.date}</span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Expected Completion</span>
                <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs">
                  {tx.expectedCompletion || 'Completed'}
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Data Source</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-blue-700 text-xs">PayPal (Sandbox)</span>
                  <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                    Verified Source
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Investigation Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#003087] via-[#0070BA] to-cyan-400 p-0.5 flex items-center justify-center shadow-xs">
                  <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-[#0070BA]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">AI Investigation</h3>
                  <p className="text-xs text-slate-500">
                    Transaction Detective • Analyzing your payment...
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Analysis Complete
              </span>
            </div>

            {/* "What's happening?" box */}
            <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-150/70">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-[#0070BA]" />
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">What's happening?</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {tx.aiExplanation || `Your payment of $${tx.amount.toFixed(2)} to ${tx.merchant} is currently ${tx.status.toLowerCase()}. This usually means PayPal is still processing the transaction or waiting for confirmation from the merchant.`}
              </p>
            </div>

            {/* Two-Column Detail Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Possible Reasons */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <h5 className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
                  Possible Reasons
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {(tx.possibleReasons || [
                    'Merchant is still confirming the order.',
                    'Bank or network delay (usually 5–30 minutes).',
                    'Additional security review (random check).'
                  ]).map((reason, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Actions */}
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/70">
                <h5 className="font-bold text-xs text-emerald-900 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Recommended Actions
                </h5>
                <ol className="space-y-1.5 text-xs text-emerald-800 font-medium">
                  {(tx.recommendedActions || [
                    'Wait for 30 minutes and check the status again.',
                    'Verify if the amount was debited from your account.',
                    'If it remains pending after 1 hour, contact the merchant or open a PayPal inquiry.'
                  ]).map((action, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        {i + 1}
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Risk Assessment Bar */}
          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">Risk Assessment</p>
                <p className="text-[11px] text-slate-500">Based on transaction behavior and account patterns</p>
              </div>
            </div>
            <RiskBadge level={tx.riskLevel} score={tx.riskScore} showScore={true} />
          </div>
        </div>
      </div>

      {/* Lower Grid: 3 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Transaction Timeline */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Transaction Timeline</h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">Track the complete journey of your payment</p>

            {/* Stepper */}
            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {tx.timeline.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';

                return (
                  <div key={idx} className="relative">
                    {/* Circle Indicator */}
                    <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white ${
                      isCompleted
                        ? 'bg-emerald-500 ring-4 ring-emerald-50'
                        : isCurrent
                          ? 'bg-[#0070BA] ring-4 ring-blue-50 animate-pulse'
                          : 'bg-slate-300'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold ${isCurrent ? 'text-[#0070BA]' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">{step.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 2: AI Insight & Recommendations */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#0070BA]" />
              <h3 className="font-bold text-slate-900 text-sm">AI Insight & Recommendations</h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">Real-time resolution roadmap</p>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-150 mb-4">
              <span className="font-bold text-xs text-blue-900">AI Summary</span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                This is a normal pending transaction. No suspicious activity detected. The payment is expected to complete within 30 minutes.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Recommended Next Steps:</span>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Wait and refresh the transaction status.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Ensure sufficient account balance or linked funding source.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>If delayed beyond 1 hour, use the Refund Center or contact support.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Related Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Related Actions</h3>
            <p className="text-[11px] text-slate-500 mb-4">Take action on this transaction</p>

            <div className="space-y-2.5">
              {/* Check Refund Eligibility */}
              <div
                onClick={() => submitRefundRequest(tx.id, 'Standard pending inquiry')}
                className="group flex items-center justify-between p-3 rounded-xl bg-blue-50/60 hover:bg-blue-100/70 border border-blue-150 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                      Check Refund Eligibility
                    </h4>
                    <p className="text-[11px] text-slate-500">See if you can request a refund</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>

              {/* Report a Dispute */}
              <div
                onClick={() => navigateTo('dispute-assistant')}
                className="group flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 hover:bg-indigo-100/70 border border-indigo-150 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                      Report a Dispute
                    </h4>
                    <p className="text-[11px] text-slate-500">Start a dispute with guidance</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>

              {/* View Receipt */}
              <div
                onClick={() => setShowReceiptModal(true)}
                className="group flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-150 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                      View Receipt
                    </h4>
                    <p className="text-[11px] text-slate-500">Download or view transaction receipt</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>

              {/* Contact Support */}
              <div
                onClick={() => navigateTo('ai-assistant')}
                className="group flex items-center justify-between p-3 rounded-xl bg-purple-50/60 hover:bg-purple-100/70 border border-purple-150 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                      Contact Support
                    </h4>
                    <p className="text-[11px] text-slate-500">Get help from PayPal support</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-black italic text-xl">PP</span>
                <span className="font-bold text-base text-slate-900">Transaction Receipt</span>
              </div>
              <span className="text-xs text-slate-400">DEMO RECORD</span>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt Number</span>
                <span className="font-semibold text-slate-800">{tx.receiptNumber || `REC-${tx.id}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Merchant</span>
                <span className="font-bold text-slate-900">{tx.merchant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Date</span>
                <span className="font-medium text-slate-700">{tx.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-medium text-slate-700">{tx.paymentMethod}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between text-sm">
                <span className="font-bold text-slate-900">Total Paid</span>
                <span className="font-black text-[#0070BA]">${tx.amount.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast('Receipt PDF downloaded successfully.');
                  setShowReceiptModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#0070BA] text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
