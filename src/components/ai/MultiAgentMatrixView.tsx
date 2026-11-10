import React, { useState } from 'react';
import {
  Bot,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Activity,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Scale,
  Search,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AI_AGENTS } from '../../services/demoData';
import { AIAgentId } from '../../types';

export const MultiAgentMatrixView: React.FC = () => {
  const {
    activeAgent,
    setActiveAgent,
    sendChatMessage,
    latestReasoningChain,
    navigateTo,
    isAiThinking
  } = useApp();

  const [testPrompt, setTestPrompt] = useState('My payment is stuck in pending status. Is it safe or should I request a refund?');

  const handleRunOrchestration = async () => {
    if (!testPrompt.trim() || isAiThinking) return;
    await sendChatMessage(testPrompt);
  };

  const agentIcons: Record<AIAgentId, React.ReactNode> = {
    coordinator: <Bot className="w-5 h-5 text-[#0070BA]" />,
    detective: <Search className="w-5 h-5 text-sky-500" />,
    guardian: <ShieldCheck className="w-5 h-5 text-amber-500" />,
    refund: <RotateCcw className="w-5 h-5 text-rose-500" />,
    dispute: <Scale className="w-5 h-5 text-indigo-500" />
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Topology Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#0070BA]" />
            <h2 className="text-xl font-bold text-slate-900">Multi-Agent AI Topology & Reasoning Engine</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Central AI Coordinator routing domain intents across four autonomous specialist agents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            5 Autonomous Agents Online
          </span>
        </div>
      </div>

      {/* Central Coordinator + 4 Specialists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {AI_AGENTS.map((agent) => {
          const isCoordinator = agent.id === 'coordinator';
          const isSelected = activeAgent === agent.id;

          return (
            <div
              key={agent.id}
              onClick={() => setActiveAgent(agent.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50/70 border-[#0070BA] shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-150 hover:border-blue-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center p-2 shadow-xs"
                    style={{ backgroundColor: `${agent.accentColor}18` }}
                  >
                    {agentIcons[agent.id]}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isSelected ? 'Focused' : agent.status}
                  </span>
                </div>

                <h3 className="font-bold text-xs sm:text-sm text-slate-900">{agent.name}</h3>
                <p className="text-[10px] font-semibold text-blue-600 mb-1">{agent.title}</p>
                <p className="text-[11px] text-slate-500 leading-snug">{agent.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                Domain: <span className="text-slate-700 font-semibold">{agent.specialty}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Multi-Agent Dispatch Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Prompt Dispatcher */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#0070BA]" />
              <h3 className="font-bold text-slate-900 text-base">Test Agent Orchestration</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Dispatch a test prompt to observe how the AI Coordinator classifies intent and delegates to the appropriate specialist.
            </p>

            <textarea
              rows={3}
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0070BA]"
              placeholder="Enter test payment inquiry..."
            />

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                onClick={() => setTestPrompt('Can I get a refund for transaction #PP-8F7K2D1?')}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg"
              >
                Refund Intent
              </button>
              <button
                type="button"
                onClick={() => setTestPrompt('Is this double charge of $49.99 a fraudulent duplicate?')}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg"
              >
                Fraud Intent
              </button>
              <button
                type="button"
                onClick={() => setTestPrompt('Help me draft a formal PayPal dispute dossier for missing item.')}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg"
              >
                Dispute Intent
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handleRunOrchestration}
              disabled={isAiThinking}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#0070BA] hover:bg-blue-700 disabled:opacity-50 text-white shadow-xs flex items-center gap-2 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isAiThinking ? 'Coordinating Agents...' : 'Run Intent Evaluation'}</span>
            </button>

            <button
              onClick={() => navigateTo('ai-assistant')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View in AI Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Reasoning Telemetry Log */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-md text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-cyan-300">Live Agent Reasoning Telemetry</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">JSON-RPC / REST READY</span>
            </div>

            <div className="space-y-3 mt-4 overflow-y-auto max-h-60 pr-1">
              {latestReasoningChain.length === 0 ? (
                <div className="text-xs text-slate-400 font-mono py-6 text-center">
                  Click "Run Intent Evaluation" or send an inquiry to trace multi-agent reasoning steps in real-time.
                </div>
              ) : (
                latestReasoningChain.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-cyan-300">{step.agentName}</span>
                      <span className="text-slate-400">{step.timestamp}</span>
                    </div>
                    <p className="text-slate-300">
                      <span className="text-slate-500">Thought:</span> {step.thought}
                    </p>
                    <p className="text-emerald-400">
                      <span className="text-slate-500">Decision:</span> {step.decision}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>FastAPI modular integration endpoints ready at /api/v1/agents/</span>
            <span className="text-emerald-400 font-semibold">Ready for Python</span>
          </div>
        </div>
      </div>
    </div>
  );
};
