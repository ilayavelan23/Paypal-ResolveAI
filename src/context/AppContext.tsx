import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  NavigationTab,
  Transaction,
  RiskSignal,
  RefundRecord,
  SavedConversation,
  UserProfile,
  PayPalSandboxConfig,
  AIAgentId,
  ChatMessage,
  DisputeDraft
} from '../types';
import {
  DEMO_TRANSACTIONS,
  PRIMARY_TRANSACTION_ID,
  RISK_SIGNALS,
  ACTIVE_REFUND,
  SAVED_CONVERSATIONS,
  INITIAL_USER,
  INITIAL_SANDBOX,
  generateFullTransactionsList
} from '../services/demoData';
import { MultiAgentCoordinatorService, AgentReasoningStep } from '../services/aiService';

interface AppContextType {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  navigateTo: (tab: NavigationTab, txId?: string) => void;
  selectedTransactionId: string;
  setSelectedTransactionId: (id: string) => void;
  transactions: Transaction[];
  activeRefund: RefundRecord;
  riskSignals: RiskSignal[];
  user: UserProfile;
  sandboxConfig: PayPalSandboxConfig;
  conversations: SavedConversation[];
  activeConversationId: string;
  activeAgent: AIAgentId;
  setActiveAgent: (agent: AIAgentId) => void;
  isAiThinking: boolean;
  latestReasoningChain: AgentReasoningStep[];
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;

  // Actions
  selectTransaction: (id: string) => void;
  startNewConversation: (customTitle?: string) => void;
  selectConversation: (id: string) => void;
  sendChatMessage: (text: string) => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
  toggleSandboxConnection: (connected: boolean) => void;
  submitRefundRequest: (txId: string, reason: string) => void;
  submitDisputeDraft: (draft: Partial<DisputeDraft>) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string>(PRIMARY_TRANSACTION_ID);
  const [transactions, setTransactions] = useState<Transaction[]>(() => generateFullTransactionsList());
  const [activeRefund, setActiveRefund] = useState<RefundRecord>(ACTIVE_REFUND);
  const [riskSignals, setRiskSignals] = useState<RiskSignal[]>(RISK_SIGNALS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [sandboxConfig, setSandboxConfig] = useState<PayPalSandboxConfig>(INITIAL_SANDBOX);
  const [conversations, setConversations] = useState<SavedConversation[]>(SAVED_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');
  const [activeAgent, setActiveAgent] = useState<AIAgentId>('coordinator');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [latestReasoningChain, setLatestReasoningChain] = useState<AgentReasoningStep[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const navigateTo = (tab: NavigationTab, txId?: string) => {
    if (txId) {
      setSelectedTransactionId(txId);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectTransaction = (id: string) => {
    setSelectedTransactionId(id);
    navigateTo('transaction-detail', id);
  };

  const startNewConversation = (customTitle?: string) => {
    const newId = 'conv-' + Date.now();
    const newConv: SavedConversation = {
      id: newId,
      title: customTitle || 'New Payment Inquiry',
      preview: 'Start asking anything about transactions or disputes...',
      timestamp: 'Just now',
      agentId: 'coordinator',
      messages: [
        {
          id: 'welcome-agent-' + Date.now(),
          sender: 'agent',
          agentId: 'coordinator',
          agentName: 'ResolveAI (AI Coordinator)',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: "Hello! I'm your ResolveAI Payment Assistant. I can coordinate with our Transaction Detective, Fraud Guardian, Refund Assistant, and Dispute Assistant to help you. What payment issue can I solve for you today?"
        }
      ]
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setActiveAgent('coordinator');
    navigateTo('ai-assistant');
  };

  const selectConversation = (id: string) => {
    setActiveConversationId(id);
    const found = conversations.find((c) => c.id === id);
    if (found) {
      setActiveAgent(found.agentId);
    }
  };

  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      timestamp: userTime,
      text
    };

    // Append user message immediately
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            preview: text,
            messages: [...conv.messages, userMsg]
          };
        }
        return conv;
      })
    );

    setIsAiThinking(true);

    try {
      // Simulate real multi-agent coordination step latency
      await new Promise((r) => setTimeout(r, 650));
      const res = await MultiAgentCoordinatorService.processUserQuery(text, activeAgent, selectedTransactionId);

      setLatestReasoningChain(res.reasoningChain);
      setActiveAgent(res.delegatedAgentId);

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              agentId: res.delegatedAgentId,
              messages: [...conv.messages, res.message]
            };
          }
          return conv;
        })
      );
    } finally {
      setIsAiThinking(false);
    }
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    showToast('Profile updated successfully.');
  };

  const toggleSandboxConnection = (connected: boolean) => {
    setSandboxConfig((prev) => ({
      ...prev,
      connected,
      lastSync: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
    showToast(connected ? 'PayPal Sandbox linked successfully.' : 'PayPal Sandbox disconnected.');
  };

  const submitRefundRequest = (txId: string, reason: string) => {
    const targetTx = transactions.find((t) => t.id === txId) || DEMO_TRANSACTIONS[0];
    const newRefund: RefundRecord = {
      id: 'RF-' + Math.floor(100000 + Math.random() * 900000),
      transactionId: targetTx.id,
      merchant: targetTx.merchant,
      amount: targetTx.amount,
      currency: targetTx.currency,
      requestedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'In Progress',
      currentStep: 1, // Request Submitted
      estimatedResolution: 'In 3 business days',
      guidance: `Refund request submitted for ${targetTx.merchant}. AI Refund Assistant is monitoring merchant response.`
    };
    setActiveRefund(newRefund);
    showToast(`Refund request #${newRefund.id} created successfully!`);
    navigateTo('refund-center');
  };

  const submitDisputeDraft = (draft: Partial<DisputeDraft>) => {
    showToast(`Dispute dossier for ${draft.merchant || 'transaction'} successfully compiled!`);
    navigateTo('dispute-assistant');
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        navigateTo,
        selectedTransactionId,
        setSelectedTransactionId,
        transactions,
        activeRefund,
        riskSignals,
        user,
        sandboxConfig,
        conversations,
        activeConversationId,
        activeAgent,
        setActiveAgent,
        isAiThinking,
        latestReasoningChain,
        isAuthenticated,
        setIsAuthenticated,
        selectTransaction,
        startNewConversation,
        selectConversation,
        sendChatMessage,
        updateUser,
        toggleSandboxConnection,
        submitRefundRequest,
        submitDisputeDraft,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
