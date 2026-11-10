export type NavigationTab =
  | 'dashboard'
  | 'ai-assistant'
  | 'transactions'
  | 'transaction-detail'
  | 'fraud-detection'
  | 'refund-center'
  | 'dispute-assistant'
  | 'multi-agent'
  | 'settings'
  | 'auth-landing'
  | 'auth-signin'
  | 'auth-signup'
  | 'auth-forgot';

export type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded';
export type TransactionSource = 'PayPal' | 'Demo' | 'Unavailable';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface TimelineStep {
  title: string;
  description: string;
  time: string;
  status: 'completed' | 'current' | 'pending';
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  merchantKey: 'amazon' | 'flipkart' | 'netflix' | 'gaming' | 'google' | 'apple' | 'spotify' | 'other';
  amount: number;
  currency: string;
  status: TransactionStatus;
  source: TransactionSource;
  paymentMethod: string;
  expectedCompletion?: string;
  riskLevel: RiskLevel;
  riskScore: number; // e.g. 2 out of 10
  riskDescription?: string;
  aiExplanation?: string;
  possibleReasons?: string[];
  recommendedActions?: string[];
  timeline: TimelineStep[];
  receiptNumber?: string;
  flaggedReason?: string;
}

export interface RiskSignal {
  id: string;
  title: string;
  subtitle: string;
  severity: 'High' | 'Medium' | 'Low' | 'Info';
  iconType: 'warning' | 'alert' | 'info';
  amount?: string;
  transactionId?: string;
}

export type AIAgentId = 'coordinator' | 'detective' | 'guardian' | 'refund' | 'dispute';

export interface AIAgent {
  id: AIAgentId;
  name: string;
  title: string;
  description: string;
  accentColor: string;
  status: 'Active' | 'Standby' | 'Analyzing';
  specialty: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  agentId?: AIAgentId;
  agentName?: string;
  timestamp: string;
  text: string;
  reasons?: string[];
  actions?: string[];
  confidenceScore?: number;
}

export interface SavedConversation {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  agentId: AIAgentId;
  messages: ChatMessage[];
}

export interface RefundRecord {
  id: string;
  transactionId: string;
  merchant: string;
  amount: number;
  currency: string;
  requestedDate: string;
  status: 'In Progress' | 'Completed' | 'Denied';
  currentStep: 1 | 2 | 3 | 4; // 1: Submitted, 2: Under Review, 3: Processing, 4: Refunded
  estimatedResolution: string;
  guidance: string;
}

export interface DisputeDraft {
  id: string;
  transactionId: string;
  merchant: string;
  amount: number;
  reason: string;
  explanation: string;
  evidenceFiles: { name: string; size: string; type: string }[];
  status: 'Draft' | 'Ready' | 'Submitted';
  generatedSummary?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  accountType: 'Personal Account' | 'Premier Account' | 'Business Account';
  avatarInitials: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  theme: 'Light' | 'System' | 'Dark';
  notificationsEnabled: boolean;
}

export interface PayPalSandboxConfig {
  connected: boolean;
  environment: 'Sandbox' | 'Live';
  clientId: string;
  linkedDate: string;
  lastSync: string;
  permissions: string[];
}
