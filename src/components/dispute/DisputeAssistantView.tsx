import React, { useState } from 'react';
import {
  Scale,
  FileText,
  Paperclip,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  Upload
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DisputeAssistantView: React.FC = () => {
  const { transactions, showToast } = useApp();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<string>(transactions[0]?.id || 'PP-8F7K2D1');
  const [disputeCategory, setDisputeCategory] = useState<string>('Item Not Received');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [uploadedEvidence, setUploadedEvidence] = useState<string[]>([
    'order_confirmation_email.pdf',
    'merchant_chat_screenshot.png'
  ]);

  const selectedTx = transactions.find((t) => t.id === selectedTxId) || transactions[0];

  const generatedDossierText = `DISPUTE DOSSIER - PAYPAL RESOLUTION CENTER
Case Reference: DISP-${selectedTx.id}
Transaction ID: ${selectedTx.id}
Merchant: ${selectedTx.merchant}
Disputed Amount: $${selectedTx.amount.toFixed(2)} USD
Dispute Type: ${disputeCategory}

FACTUAL TIMELINE & STATEMENT:
1. Transaction was authorized on ${selectedTx.date} for $${selectedTx.amount.toFixed(2)}.
2. The buyer attempted direct merchant resolution on multiple occasions without satisfactory resolution.
3. As of today, the merchant has failed to fulfill the contractual terms or deliver valid proof of delivery.
4. Requesting immediate full reversal and buyer protection claim review.

SUPPORTING EVIDENCE ATTACHED:
• Merchant order invoice confirmation
• Communication logs with customer support`;

  const handleCopySummary = () => {
    navigator.clipboard?.writeText(generatedDossierText);
    setCopiedSummary(true);
    showToast('Dispute summary dossier copied to clipboard!');
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleSimulateUpload = () => {
    const filename = `evidence_doc_${Date.now().toString().slice(-4)}.png`;
    setUploadedEvidence((prev) => [...prev, filename]);
    showToast(`Uploaded ${filename} to dispute file.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner matching Image 5 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#003087] via-[#0070BA] to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-md">
            <Scale className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Need to dispute a transaction?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              ResolveAI helps you prepare a strong dispute with the right information and evidence before escalating to PayPal.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowWizard(true)}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-[#0070BA] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] shrink-0"
        >
          <span>Start a Dispute</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dispute Tools Section matching Image 5 */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Dispute Tools</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tool 1: Generate Dispute Summary */}
          <div
            onClick={() => setShowWizard(true)}
            className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-200 shadow-xs p-5 cursor-pointer transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
              Generate Dispute Summary
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Create a clear and accurate dispute description formatted for PayPal claim evaluators.
            </p>
          </div>

          {/* Tool 2: Organize Evidence */}
          <div
            onClick={() => setShowWizard(true)}
            className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-200 shadow-xs p-5 cursor-pointer transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Paperclip className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
              Organize Evidence
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Upload and manage supporting files (screenshots, receipts, merchant chats).
            </p>
          </div>

          {/* Tool 3: PayPal Resolution Guide */}
          <div
            onClick={() => setShowWizard(true)}
            className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-200 shadow-xs p-5 cursor-pointer transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ExternalLink className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
              PayPal Resolution Guide
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Step-by-step process on the official PayPal platform and negotiation timelines.
            </p>
          </div>
        </div>
      </div>

      {/* Guided Dispute Wizard & Evidence Workspace */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0070BA]" />
            <h3 className="font-bold text-slate-900 text-base">Dispute Dossier Builder</h3>
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
            AI-Assisted
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Transaction to Dispute</label>
              <select
                value={selectedTxId}
                onChange={(e) => setSelectedTxId(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0070BA]"
              >
                {transactions.slice(0, 10).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} — {t.merchant} (${t.amount.toFixed(2)}) • {t.date}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Dispute Reason Category</label>
              <select
                value={disputeCategory}
                onChange={(e) => setDisputeCategory(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0070BA]"
              >
                <option value="Item Not Received">Item Not Received / Service Undelivered</option>
                <option value="Significantly Not as Described">Significantly Not as Described / Damaged</option>
                <option value="Unauthorized Transaction">Unauthorized Activity / Billing Anomaly</option>
                <option value="Duplicate Billing">Duplicate Charge for Same Purchase</option>
              </select>
            </div>

            {/* Evidence Checklist */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-xs text-slate-800 mb-2 flex items-center justify-between">
                <span>Evidence Checklist</span>
                <button
                  onClick={handleSimulateUpload}
                  className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>+ Attach File</span>
                </button>
              </h4>

              <div className="space-y-1.5 text-xs">
                {uploadedEvidence.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium truncate max-w-xs">{file}</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Generated Dossier Preview */}
          <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-cyan-300">Generated Statement Preview</span>
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
              </div>

              <pre className="mt-3 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-56">
                {generatedDossierText}
              </pre>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Ready for PayPal Resolution Center submission</span>
              <a
                href="https://www.sandbox.paypal.com/disputes"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Open PayPal Sandbox</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
