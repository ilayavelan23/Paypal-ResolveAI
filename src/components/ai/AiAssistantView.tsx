import React, { useState } from 'react';
import {
  Bot,
  Search,
  Plus,
  Send,
  Paperclip,
  CheckCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Cpu,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AI_AGENTS } from '../../services/demoData';
import { AIAgentId } from '../../types';

export const AiAssistantView: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    startNewConversation,
    sendChatMessage,
    activeAgent,
    setActiveAgent,
    isAiThinking,
    latestReasoningChain,
    navigateTo
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showThinkingDetails, setShowThinkingDetails] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isAiThinking) return;
    const text = inputMessage;
    setInputMessage('');
    await sendChatMessage(text);
  };

  const currentSpecialist = AI_AGENTS.find((a) => a.id === activeAgent) || AI_AGENTS[0];

  return (
    <div className="h-[calc(100vh-140px)] min-h-[640px] flex flex-col lg:flex-row gap-4 pb-4">
      {/* 1. Left Column: Saved Conversations */}
      <div className="w-full lg:w-72 bg-white rounded-2xl border border-slate-100 p-4 shadow-xs flex flex-col shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-sm">Conversations</h3>
          <button
            onClick={() => startNewConversation()}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0070BA] text-white hover:bg-blue-700 shadow-xs transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Conversations List */}
        <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConversationId;
            return (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`p-3 rounded-xl cursor-pointer text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 border border-blue-200/80 shadow-xs'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-xs font-bold truncate pr-2 ${isSelected ? 'text-[#0070BA]' : 'text-slate-800'}`}>
                    {conv.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{conv.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {conv.preview}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Center Column: Live Chat Workspace */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#003087] via-[#0070BA] to-cyan-400 p-0.5 flex items-center justify-center shadow-xs">
              <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#0070BA]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Transaction Assistance</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                AI Coordinator • <span className="font-semibold text-blue-600">{currentSpecialist.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('multi-agent')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 transition-colors shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Agent Architecture</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {activeConv.messages.map((msg) => {
            const isAgent = msg.sender === 'agent';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAgent ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                {isAgent ? (
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-150 flex items-center justify-center text-[#0070BA] shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-[#0070BA] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    MI
                  </div>
                )}

                {/* Content */}
                <div className="space-y-1.5 max-w-[88%] sm:max-w-[80%]">
                  <div className={`flex items-center gap-2 ${isAgent ? '' : 'justify-end'}`}>
                    <span className="text-xs font-bold text-slate-800">
                      {isAgent ? msg.agentName || 'ResolveAI' : 'You'}
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isAgent
                      ? 'bg-slate-50/90 text-slate-800 border border-slate-150'
                      : 'bg-[#0070BA] text-white rounded-tr-xs'
                  }`}>
                    {/* Plain or structured text */}
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Structured Reasons & Actions Cards */}
                    {isAgent && (msg.reasons || msg.actions) && (
                      <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-3">
                        {msg.reasons && (
                          <div className="p-3 bg-white rounded-xl border border-slate-200">
                            <h5 className="font-bold text-xs text-slate-900 mb-1.5 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                              Likely Reasons
                            </h5>
                            <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4">
                              {msg.reasons.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {msg.actions && (
                          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                            <h5 className="font-bold text-xs text-emerald-900 mb-1.5 flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              Recommended Actions
                            </h5>
                            <ol className="space-y-1 text-xs text-emerald-800 list-decimal pl-4">
                              {msg.actions.map((a, i) => (
                                <li key={i}>{a}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* AI Thinking Animation */}
          {isAiThinking && (
            <div className="flex gap-3 mr-auto max-w-lg animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-150 flex items-center justify-center text-[#0070BA]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                <span>{currentSpecialist.name} is inspecting transaction ledger...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask anything about your payments..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isAiThinking}
              className="w-full pl-4 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0070BA] focus:bg-white transition-all shadow-inner"
            />
            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
                title="Attach Receipt or Screenshot"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!inputMessage.trim() || isAiThinking}
                className="p-2 bg-[#0070BA] hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg shadow-sm transition-all"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Right Column: AI Agents Rail */}
      <div className="w-full lg:w-72 bg-white rounded-2xl border border-slate-100 p-4 shadow-xs flex flex-col shrink-0">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#0070BA]" />
            <h3 className="font-bold text-slate-900 text-sm">AI Agents</h3>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            5 Specialists
          </span>
        </div>

        <div className="space-y-2.5 overflow-y-auto flex-1">
          {AI_AGENTS.map((agent) => {
            const isSelected = activeAgent === agent.id;

            return (
              <div
                key={agent.id}
                onClick={() => setActiveAgent(agent.id)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#0070BA] bg-blue-50/50 shadow-xs'
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: agent.accentColor }}
                    />
                    <h4 className="text-xs font-bold text-slate-900">{agent.name}</h4>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isSelected ? 'Active' : agent.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {agent.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Agent Architecture Card */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => navigateTo('multi-agent')}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open Multi-Agent Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
