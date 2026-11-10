import {
  Transaction,
  RiskSignal,
  RefundRecord,
  SavedConversation,
  UserProfile,
  PayPalSandboxConfig,
  AIAgent
} from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'M.B. Ilayavelan',
  email: 'ilayavelan.mb@email.com',
  phone: '+91 98765 43210',
  accountType: 'Personal Account',
  avatarInitials: 'MI',
  isVerified: true,
  twoFactorEnabled: true,
  theme: 'Light',
  notificationsEnabled: true
};

export const INITIAL_SANDBOX: PayPalSandboxConfig = {
  connected: true,
  environment: 'Sandbox',
  clientId: 'Afca-982kL-81204Xp-7sD3',
  linkedDate: 'Nov 05, 2026',
  lastSync: 'Nov 07, 2026, 10:24 AM',
  permissions: ['Create Orders', 'Capture Payments', 'Read Transactions']
};

export const AI_AGENTS: AIAgent[] = [
  {
    id: 'coordinator',
    name: 'AI Coordinator',
    title: 'Central Orchestrator',
    description: 'Routes inquiries and synthesizes multi-agent findings for clear resolution.',
    accentColor: '#0070BA', // PayPal Blue
    status: 'Active',
    specialty: 'Intent Parsing & Multi-Agent Orchestration'
  },
  {
    id: 'detective',
    name: 'Transaction Detective',
    title: 'Deep Payment Forensics',
    description: 'Analyzes payment status, ACH/network delays, and processing bottlenecks.',
    accentColor: '#0284C7', // Sky Cyan
    status: 'Active',
    specialty: 'Timeline Verification & State Diagnostics'
  },
  {
    id: 'guardian',
    name: 'Fraud Guardian',
    title: 'Risk & Anomaly Shield',
    description: 'Checks transaction patterns against velocity spikes and duplicate billing.',
    accentColor: '#D97706', // Amber / Gold
    status: 'Standby',
    specialty: 'Behavioral Anomaly & Risk Scoring'
  },
  {
    id: 'refund',
    name: 'Refund Assistant',
    title: 'Refund Guidance & Tracking',
    description: 'Guides merchant policy eligibility and tracks PayPal refund lifecycles.',
    accentColor: '#EF4444', // Red / Rose
    status: 'Standby',
    specialty: 'Policy Analysis & Lifecycle Tracking'
  },
  {
    id: 'dispute',
    name: 'Dispute Assistant',
    title: 'Resolution Center Advocate',
    description: 'Prepares structured evidence, transaction timelines, and PayPal claims.',
    accentColor: '#6366F1', // Indigo
    status: 'Standby',
    specialty: 'Evidence Assembly & Claim Drafting'
  }
];

export const PRIMARY_TRANSACTION_ID = 'PP-8F7K2D1';

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'PP-8F7K2D1',
    date: 'Nov 07, 2026, 10:24 AM',
    merchant: 'Amazon India',
    merchantKey: 'amazon',
    amount: 49.99,
    currency: 'USD',
    status: 'Pending',
    source: 'PayPal',
    paymentMethod: 'PayPal Balance',
    expectedCompletion: 'Within 30 minutes',
    riskLevel: 'Low',
    riskScore: 2,
    riskDescription: 'Based on transaction behavior and account patterns (Low Risk: 2/10)',
    aiExplanation: 'Your payment of $49.99 to Amazon India is currently pending. This usually means PayPal is still processing the transaction or waiting for confirmation from the merchant.',
    possibleReasons: [
      'Merchant is still confirming the order.',
      'Bank or network delay (usually 5–30 minutes).',
      'Additional security review (random check).'
    ],
    recommendedActions: [
      'Wait for 30 minutes and check the status again.',
      'Verify if the amount was debited from your account.',
      'If it remains pending after 1 hour, contact the merchant or open a PayPal inquiry.'
    ],
    timeline: [
      {
        title: 'Payment Initiated',
        description: 'Your payment request was created.',
        time: 'Nov 07, 10:24 AM',
        status: 'completed'
      },
      {
        title: 'Processing (Current)',
        description: 'PayPal is processing your payment.',
        time: 'Nov 07, 10:24 AM',
        status: 'current'
      },
      {
        title: 'Merchant Confirmation',
        description: 'Waiting for merchant to confirm the payment.',
        time: '—',
        status: 'pending'
      },
      {
        title: 'Payment Completion',
        description: 'Transaction will be marked as completed.',
        time: '—',
        status: 'pending'
      }
    ],
    receiptNumber: 'REC-AMZ-2026-98124'
  },
  {
    id: 'PP-9X3M1A4',
    date: 'Nov 06, 2026, 08:11 PM',
    merchant: 'Flipkart',
    merchantKey: 'flipkart',
    amount: 29.50,
    currency: 'USD',
    status: 'Pending',
    source: 'Demo',
    paymentMethod: 'Visa Debit •••• 1092',
    expectedCompletion: 'Within 45 minutes',
    riskLevel: 'Low',
    riskScore: 1,
    aiExplanation: 'Flipkart order payment authorization awaiting fulfillment ping.',
    possibleReasons: ['Inventory verification hold', 'Standard payment processing batch'],
    recommendedActions: ['Check Flipkart order tracking', 'Allow 45 minutes before requesting cancellation'],
    timeline: [
      { title: 'Payment Initiated', description: 'Order submitted online', time: 'Nov 06, 08:11 PM', status: 'completed' },
      { title: 'Processing (Current)', description: 'Batch authorization in progress', time: 'Nov 06, 08:12 PM', status: 'current' },
      { title: 'Merchant Confirmation', description: 'Order packing confirmation', time: '—', status: 'pending' },
      { title: 'Payment Completion', description: 'Ledger finalized', time: '—', status: 'pending' }
    ]
  },
  {
    id: 'PP-4B2L9K8',
    date: 'Nov 05, 2026, 04:37 PM',
    merchant: 'Netflix Subscription',
    merchantKey: 'netflix',
    amount: 12.99,
    currency: 'USD',
    status: 'Completed',
    source: 'PayPal',
    paymentMethod: 'PayPal Balance',
    riskLevel: 'Low',
    riskScore: 0,
    aiExplanation: 'Recurring monthly streaming subscription payment processed successfully.',
    timeline: [
      { title: 'Payment Initiated', description: 'Recurring billing trigger', time: 'Nov 05, 04:37 PM', status: 'completed' },
      { title: 'Processing', description: 'Direct clearing via PayPal', time: 'Nov 05, 04:37 PM', status: 'completed' },
      { title: 'Merchant Confirmation', description: 'Netflix billing acknowledged', time: 'Nov 05, 04:37 PM', status: 'completed' },
      { title: 'Payment Completion', description: 'Invoice settled', time: 'Nov 05, 04:37 PM', status: 'completed' }
    ],
    receiptNumber: 'REC-NTX-2026-44211'
  },
  {
    id: 'PP-7G1P5E2',
    date: 'Nov 04, 2026, 11:02 AM',
    merchant: 'Gaming Purchase',
    merchantKey: 'gaming',
    amount: 69.99,
    currency: 'USD',
    status: 'Failed',
    source: 'Demo',
    paymentMethod: 'Mastercard •••• 8831',
    riskLevel: 'Medium',
    riskScore: 5,
    flaggedReason: 'Multiple attempts (3 times)',
    aiExplanation: 'Payment declined due to automated 3D Secure timeout or merchant gateway drop.',
    possibleReasons: ['Card security code timeout', 'Merchant server temporary timeout'],
    recommendedActions: ['Retry using PayPal balance', 'Verify 3D Secure SMS token before proceeding'],
    timeline: [
      { title: 'Payment Initiated', description: 'Checkout attempt initiated', time: 'Nov 04, 11:01 AM', status: 'completed' },
      { title: 'Processing', description: 'Contacting issuer network', time: 'Nov 04, 11:02 AM', status: 'completed' },
      { title: 'Failed', description: 'Card issuer returned transaction timeout error code 54', time: 'Nov 04, 11:02 AM', status: 'current' }
    ]
  },
  {
    id: 'PP-2H8Q4N9',
    date: 'Nov 03, 2026, 07:18 PM',
    merchant: 'Google Workspace',
    merchantKey: 'google',
    amount: 14.00,
    currency: 'USD',
    status: 'Completed',
    source: 'Demo',
    paymentMethod: 'PayPal Balance',
    riskLevel: 'Low',
    riskScore: 0,
    aiExplanation: 'Standard Google cloud enterprise email subscription fee.',
    timeline: [
      { title: 'Payment Initiated', description: 'Subscription invoice', time: 'Nov 03, 07:18 PM', status: 'completed' },
      { title: 'Payment Completion', description: 'Payment settled instantly', time: 'Nov 03, 07:18 PM', status: 'completed' }
    ]
  },
  {
    id: 'PP-5V1W9D8',
    date: 'Nov 06, 2026, 09:14 PM',
    merchant: 'Online Store',
    merchantKey: 'other',
    amount: 49.99,
    currency: 'USD',
    status: 'Completed',
    source: 'PayPal',
    paymentMethod: 'Visa •••• 4242',
    riskLevel: 'High',
    riskScore: 8,
    flaggedReason: 'Possible duplicate payment',
    aiExplanation: 'High Risk Alert: Detected 2 identical charges of $49.99 within 90 seconds from the same merchant checkout page.',
    possibleReasons: ['Double-click on checkout button', 'Gateway session retry bug on merchant store'],
    recommendedActions: ['Request immediate refund in Refund Center', 'Open pre-dispute hold if merchant refuses'],
    timeline: [
      { title: 'Payment Initiated', description: 'First duplicate transaction created', time: 'Nov 06, 09:13 PM', status: 'completed' },
      { title: 'Duplicate Detected', description: 'Second identical charge cleared', time: 'Nov 06, 09:14 PM', status: 'completed' }
    ]
  },
  {
    id: 'PP-3K7J2F1',
    date: 'Nov 05, 2026, 03:21 PM',
    merchant: 'Digital Service',
    merchantKey: 'other',
    amount: 199.00,
    currency: 'USD',
    status: 'Completed',
    source: 'Demo',
    paymentMethod: 'PayPal Credit',
    riskLevel: 'Medium',
    riskScore: 6,
    flaggedReason: 'Unusual amount (3x higher)',
    aiExplanation: 'Charge is 320% higher than your average monthly digital service spend.',
    timeline: [
      { title: 'Payment Initiated', description: 'Cloud annual package upgrade', time: 'Nov 05, 03:20 PM', status: 'completed' },
      { title: 'Completed', description: 'Cleared with PayPal credit line', time: 'Nov 05, 03:21 PM', status: 'completed' }
    ]
  },
  {
    id: 'PP-1R9T6Y4',
    date: 'Nov 02, 2026, 02:45 PM',
    merchant: 'Apple Services',
    merchantKey: 'apple',
    amount: 9.99,
    currency: 'USD',
    status: 'Completed',
    source: 'PayPal',
    paymentMethod: 'PayPal Balance',
    riskLevel: 'Low',
    riskScore: 0,
    timeline: [
      { title: 'Payment Initiated', description: 'Apple One recurring payment', time: 'Nov 02, 02:45 PM', status: 'completed' },
      { title: 'Completed', description: 'Cleared', time: 'Nov 02, 02:45 PM', status: 'completed' }
    ]
  },
  {
    id: 'PP-6U4B8C3',
    date: 'Nov 01, 2026, 06:12 PM',
    merchant: 'Spotify USA',
    merchantKey: 'spotify',
    amount: 10.99,
    currency: 'USD',
    status: 'Completed',
    source: 'PayPal',
    paymentMethod: 'PayPal Balance',
    riskLevel: 'Low',
    riskScore: 0,
    timeline: [
      { title: 'Payment Initiated', description: 'Spotify Duo Subscription', time: 'Nov 01, 06:12 PM', status: 'completed' },
      { title: 'Completed', description: 'Processed', time: 'Nov 01, 06:12 PM', status: 'completed' }
    ]
  },
  {
    id: 'PP-0P7A5M9',
    date: 'Oct 30, 2026, 11:15 AM',
    merchant: 'Global Luxury Goods',
    merchantKey: 'other',
    amount: 999.00,
    currency: 'USD',
    status: 'Completed',
    source: 'PayPal',
    paymentMethod: 'Checking Account •••• 9912',
    riskLevel: 'High',
    riskScore: 7,
    flaggedReason: 'High amount transaction ($999.00)',
    aiExplanation: 'High amount transaction: Exceeds standard single-purchase ceiling. Review advised to confirm order authenticity.',
    timeline: [
      { title: 'Payment Initiated', description: 'High ticket designer merchandise', time: 'Oct 30, 11:14 AM', status: 'completed' },
      { title: 'Completed', description: 'Cleared under buyer protection', time: 'Oct 30, 11:15 AM', status: 'completed' }
    ]
  }
];

// Helper to generate the full 42 transactions for complete realistic table browsing
export function generateFullTransactionsList(): Transaction[] {
  const base = [...DEMO_TRANSACTIONS];
  const merchants = [
    { name: 'Amazon Prime', key: 'amazon' as const, amt: 14.99, status: 'Completed' as const, src: 'PayPal' as const },
    { name: 'Flipkart Electronics', key: 'flipkart' as const, amt: 124.50, status: 'Completed' as const, src: 'Demo' as const },
    { name: 'GitHub Copilot', key: 'other' as const, amt: 10.00, status: 'Completed' as const, src: 'PayPal' as const },
    { name: 'Steam Games', key: 'gaming' as const, amt: 44.99, status: 'Completed' as const, src: 'Demo' as const },
    { name: 'Coursera Subscription', key: 'other' as const, amt: 49.00, status: 'Completed' as const, src: 'PayPal' as const },
    { name: 'Uber Technologies', key: 'other' as const, amt: 18.25, status: 'Completed' as const, src: 'Demo' as const },
    { name: 'DoorDash Delivery', key: 'other' as const, amt: 32.80, status: 'Completed' as const, src: 'PayPal' as const },
    { name: 'AirBnB Booking Hold', key: 'other' as const, amt: 215.00, status: 'Pending' as const, src: 'PayPal' as const },
    { name: 'PlayStation Network', key: 'gaming' as const, amt: 79.99, status: 'Failed' as const, src: 'Demo' as const },
    { name: 'Figma Professional', key: 'other' as const, amt: 15.00, status: 'Completed' as const, src: 'PayPal' as const },
    { name: 'DigitalOcean Cloud', key: 'other' as const, amt: 24.00, status: 'Completed' as const, src: 'Demo' as const },
    { name: 'Dropbox Storage', key: 'other' as const, amt: 9.99, status: 'Completed' as const, src: 'PayPal' as const },
    { name: 'OpenAI API Usage', key: 'other' as const, amt: 20.00, status: 'Completed' as const, src: 'Demo' as const },
    { name: 'Nike Direct Store', key: 'other' as const, amt: 110.00, status: 'Completed' as const, src: 'PayPal' as const },
    { name: 'BestBuy Electronics', key: 'other' as const, amt: 64.95, status: 'Completed' as const, src: 'Demo' as const },
    { name: 'Adobe Creative Cloud', key: 'other' as const, amt: 54.99, status: 'Completed' as const, src: 'PayPal' as const }
  ];

  let idCounter = 100;
  for (let i = 0; i < 32; i++) {
    const m = merchants[i % merchants.length];
    idCounter++;
    const day = (28 - (i % 25)).toString().padStart(2, '0');
    base.push({
      id: `PP-TX${idCounter}`,
      date: `Oct ${day}, 2026, 0${(i % 9) + 1}:${(i * 7) % 60} PM`,
      merchant: m.name,
      merchantKey: m.key,
      amount: m.amt + (i % 3 === 0 ? 5 : 0),
      currency: 'USD',
      status: i === 7 || i === 19 ? 'Pending' : (i === 12 || i === 25 ? 'Failed' : 'Completed'),
      source: i % 2 === 0 ? 'PayPal' : 'Demo',
      paymentMethod: i % 3 === 0 ? 'PayPal Balance' : 'Linked Card',
      riskLevel: i === 12 ? 'High' : (i === 7 ? 'Medium' : 'Low'),
      riskScore: i === 12 ? 8 : (i === 7 ? 4 : 1),
      timeline: [
        { title: 'Payment Initiated', description: 'Order created', time: `Oct ${day}, 2026`, status: 'completed' },
        { title: 'Completion', description: 'Ledger finalized', time: `Oct ${day}, 2026`, status: 'completed' }
      ]
    });
  }
  return base;
}

export const RISK_SIGNALS: RiskSignal[] = [
  {
    id: 'sig-1',
    title: 'Possible duplicate payment',
    subtitle: '2 similar payments • $49.99',
    severity: 'High',
    iconType: 'warning',
    amount: '$49.99',
    transactionId: 'PP-5V1W9D8'
  },
  {
    id: 'sig-2',
    title: 'Unusual payment frequency',
    subtitle: '5 payments in 10 minutes',
    severity: 'Medium',
    iconType: 'alert',
    transactionId: 'PP-7G1P5E2'
  },
  {
    id: 'sig-3',
    title: 'High amount transaction',
    subtitle: '$999.00 • Review recommended',
    severity: 'Info',
    iconType: 'info',
    amount: '$999.00',
    transactionId: 'PP-0P7A5M9'
  }
];

export const ACTIVE_REFUND: RefundRecord = {
  id: 'RF-784291',
  transactionId: 'PP-8F7K2D1',
  merchant: 'Amazon India',
  amount: 49.99,
  currency: 'USD',
  requestedDate: 'Nov 06, 2026, 08:20 PM',
  status: 'In Progress',
  currentStep: 3, // Processing (1-3 business days)
  estimatedResolution: 'Nov 09, 2026',
  guidance: 'Your refund is being processed. Most refunds are completed within 1-3 business days after approval.'
};

export const SAVED_CONVERSATIONS: SavedConversation[] = [
  {
    id: 'conv-1',
    title: 'Pending payment issue',
    preview: 'My $49.99 payment is still pending. What should I do?',
    timestamp: 'Today, 10:24 AM',
    agentId: 'detective',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        timestamp: '10:24 AM',
        text: 'My $49.99 payment is still pending. What should I do?'
      },
      {
        id: 'msg-2',
        sender: 'agent',
        agentId: 'coordinator',
        agentName: 'ResolveAI (AI Coordinator)',
        timestamp: '10:24 AM',
        text: "I've analyzed your query using the Transaction Detective.\n\n• Likely Reasons:\n  - The payment is still being processed by the merchant.\n  - Bank or network delay (usually 5–30 minutes).\n\n• Recommended Actions:\n  1. Wait a while and refresh the transaction status.\n  2. Check if the amount was debited from your account.\n  3. If it remains pending after 1 hour, contact the merchant or start a PayPal dispute.",
        reasons: [
          'The payment is still being processed by the merchant.',
          'Bank or network delay (usually 5–30 minutes).'
        ],
        actions: [
          'Wait a while and refresh the transaction status.',
          'Check if the amount was debited from your account.',
          'If it remains pending after 1 hour, contact the merchant or start a PayPal dispute.'
        ],
        confidenceScore: 0.96
      }
    ]
  },
  {
    id: 'conv-2',
    title: 'Refund status inquiry',
    preview: 'When will I receive my refund for order #RF-784291?',
    timestamp: 'Nov 06, 5:18 PM',
    agentId: 'refund',
    messages: [
      {
        id: 'msg-2-1',
        sender: 'user',
        timestamp: '5:18 PM',
        text: 'When will I receive my refund for order #RF-784291?'
      },
      {
        id: 'msg-2-2',
        sender: 'agent',
        agentId: 'refund',
        agentName: 'Refund Assistant',
        timestamp: '5:18 PM',
        text: 'Your refund #RF-784291 of $49.99 for Amazon India is currently in Step 3: Processing. Under standard PayPal merchant settlement timelines, funds are usually credited back to your PayPal Balance or original card within 1 to 3 business days.'
      }
    ]
  },
  {
    id: 'conv-3',
    title: 'Suspicious transaction',
    preview: 'Is this transaction safe? It looks unfamiliar.',
    timestamp: 'Nov 05, 2:09 PM',
    agentId: 'guardian',
    messages: [
      {
        id: 'msg-3-1',
        sender: 'user',
        timestamp: '2:09 PM',
        text: 'Is this transaction safe? It looks unfamiliar.'
      },
      {
        id: 'msg-3-2',
        sender: 'agent',
        agentId: 'guardian',
        agentName: 'Fraud Guardian',
        timestamp: '2:10 PM',
        text: 'Fraud Guardian evaluated transaction #PP-5V1W9D8 ($49.99 Online Store). Risk Score is High (8/10) due to duplicate debit timestamps. We recommend initiating a temporary merchant freeze.'
      }
    ]
  },
  {
    id: 'conv-4',
    title: 'Dispute preparation',
    preview: 'Help me prepare a dispute for order #RF-784291',
    timestamp: 'Nov 04, 11:33 AM',
    agentId: 'dispute',
    messages: [
      {
        id: 'msg-4-1',
        sender: 'user',
        timestamp: '11:33 AM',
        text: 'Help me prepare a dispute for order #RF-784291'
      },
      {
        id: 'msg-4-2',
        sender: 'agent',
        agentId: 'dispute',
        agentName: 'Dispute Assistant',
        timestamp: '11:34 AM',
        text: 'I have compiled a structured dispute dossier for you with payment transaction reference, proof-of-delay timeline, and recommended claim category: "Item Not Received / Service Undelivered".'
      }
    ]
  },
  {
    id: 'conv-5',
    title: 'Duplicate payment',
    preview: 'I was charged twice for the same order.',
    timestamp: 'Nov 03, 9:20 PM',
    agentId: 'guardian',
    messages: [
      {
        id: 'msg-5-1',
        sender: 'user',
        timestamp: '9:20 PM',
        text: 'I was charged twice for the same order.'
      },
      {
        id: 'msg-5-2',
        sender: 'agent',
        agentId: 'coordinator',
        agentName: 'ResolveAI (AI Coordinator)',
        timestamp: '9:21 PM',
        text: 'Detected 2 identical authorization requests within 90 seconds. We flagged this to the Fraud Guardian and can automatically draft a duplicate billing refund request.'
      }
    ]
  }
];
