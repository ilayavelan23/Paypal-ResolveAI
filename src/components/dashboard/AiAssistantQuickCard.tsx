import React from 'react';
import { Bot, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiAssistantQuickCard: React.FC = () => {
  const { startNewConversation, sendChatMessage, navigateTo } = useApp();

  const samplePrompts = [
    { label: 'Why is my payment pending?', query: 'Why is my $49.99 Amazon payment still pending?' },
    { label: 'Is this transaction safe?', query: 'Is this $49.99 charge safe or suspicious?' },
    { label: 'How can I get a refund?', query: 'How can I get a refund for my recent transaction?' },
    { label: 'Help me with a dispute', query: 'Help me prepare a formal dispute for an undelivered item.' }
  ];

  const handlePromptClick = (prompt: { label: string; query: string }) => {
    startNewConversation(prompt.label);
    sendChatMessage(prompt.query);
    navigateTo('ai-assistant');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#071933] via-[#092248] to-[#040e1d] text-white p-5 border border-blue-900/60 shadow-md">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/15 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-[#091b35] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">AI Assistant</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Online
              </span>
            </div>
            <p className="text-[11px] text-blue-200/80">Chat with ResolveAI</p>
          </div>
        </div>
      </div>

      <p className="relative z-10 text-xs text-slate-300 mt-3 leading-relaxed">
        Get instant help for transactions, refunds, disputes, and more.
      </p>

      {/* CTA Button */}
      <div className="relative z-10 mt-4">
        <button
          onClick={() => {
            startNewConversation();
            navigateTo('ai-assistant');
          }}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Start a new conversation +</span>
        </button>
      </div>

      {/* Try Asking Section */}
      <div className="relative z-10 mt-5 pt-4 border-t border-blue-900/40">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Try asking:</span>
          <Sparkles className="w-3 h-3 text-cyan-400" />
        </div>

        <div className="space-y-1.5">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(p)}
              className="w-full text-left flex items-center justify-between p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-xs text-slate-200 transition-colors group"
            >
              <span className="truncate pr-2">{p.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
