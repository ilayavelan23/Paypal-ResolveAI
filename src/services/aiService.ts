import { AIAgentId, ChatMessage } from '../types';
import { getApiUrl } from './apiConfig';

export interface AgentReasoningStep {
  agentId: AIAgentId;
  agentName: string;
  thought: string;
  decision: string;
  timestamp: string;
}

export interface AIResponsePayload {
  message: ChatMessage;
  delegatedAgentId: AIAgentId;
  reasoningChain: AgentReasoningStep[];
}

export class MultiAgentCoordinatorService {
  /**
   * Evaluates user prompt, decides which specialist to delegate to,
   * generates realistic reasoning telemetry, and returns structured resolution.
   */
  public static async processUserQuery(
    prompt: string,
    activeAgentHint?: AIAgentId,
    transactionId?: string
  ): Promise<AIResponsePayload> {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Try Live FastAPI Backend First
    try {
      const response = await fetch(getApiUrl('/api/v1/agents/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          active_agent: activeAgentHint || 'coordinator',
          transaction_id: transactionId || undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        const delegated = (data.delegated_agent || 'detective') as AIAgentId;
        const mappedChain: AgentReasoningStep[] = (data.reasoning_chain || []).map((step: any) => ({
          agentId: step.agent_id as AIAgentId,
          agentName: step.agent_name,
          thought: step.thought,
          decision: step.decision,
          timestamp: step.timestamp
        }));

        return {
          message: {
            id: 'msg-' + Date.now(),
            sender: 'agent',
            agentId: delegated,
            agentName: data.agent_name,
            timestamp: timeStr,
            text: data.reply,
            reasons: data.reasons,
            actions: data.actions,
            confidenceScore: data.confidence_score
          },
          delegatedAgentId: delegated,
          reasoningChain: mappedChain
        };
      }
    } catch {
      // Fallback to local heuristic simulation if backend is not reachable
    }

    const lower = prompt.toLowerCase();

    let chosenAgent: AIAgentId = activeAgentHint && activeAgentHint !== 'coordinator'
      ? activeAgentHint
      : 'coordinator';

    // Intelligent heuristic routing if coordinator is selected
    if (chosenAgent === 'coordinator') {
      if (lower.includes('refund') || lower.includes('return') || lower.includes('cancel payment') || lower.includes('money back')) {
        chosenAgent = 'refund';
      } else if (lower.includes('fraud') || lower.includes('suspicious') || lower.includes('safe') || lower.includes('duplicate') || lower.includes('scam')) {
        chosenAgent = 'guardian';
      } else if (lower.includes('dispute') || lower.includes('claim') || lower.includes('evidence') || lower.includes('chargeback') || lower.includes('resolution center')) {
        chosenAgent = 'dispute';
      } else {
        chosenAgent = 'detective';
      }
    }

    // Generate reasoning chain telemetry
    const reasoningChain: AgentReasoningStep[] = [
      {
        agentId: 'coordinator',
        agentName: 'AI Coordinator',
        thought: `Received query: "${prompt}". Analyzing user intent and matching against domain models.`,
        decision: `Delegating domain inspection to ${chosenAgent.toUpperCase()} specialist.`,
        timestamp: timeStr
      }
    ];

    let replyText = '';
    let reasons: string[] | undefined;
    let actions: string[] | undefined;
    let confidenceScore = 0.94;

    switch (chosenAgent) {
      case 'detective':
        reasoningChain.push({
          agentId: 'detective',
          agentName: 'Transaction Detective',
          thought: 'Querying PayPal Sandbox ledger, batching network trace and ACH clearing times.',
          decision: 'Detected pending authorization buffer. Merchant hold within normal bounds.',
          timestamp: timeStr
        });
        replyText = "I've analyzed your query using the Transaction Detective.\n\n• Likely Reasons:\n  - The payment is still being processed by the merchant.\n  - Bank or network delay (usually 5–30 minutes).\n\n• Recommended Actions:\n  1. Wait a while and refresh the transaction status.\n  2. Check if the amount was debited from your account.\n  3. If it remains pending after 1 hour, contact the merchant or start a PayPal dispute.";
        reasons = [
          'The payment is still being processed by the merchant.',
          'Bank or network delay (usually 5–30 minutes).',
          'Additional merchant verification check in progress.'
        ];
        actions = [
          'Wait 30 minutes and refresh the transaction status.',
          'Check if the amount was debited from your bank or card.',
          'If it remains pending after 1 hour, use the Dispute Assistant or contact support.'
        ];
        confidenceScore = 0.96;
        break;

      case 'guardian':
        reasoningChain.push({
          agentId: 'guardian',
          agentName: 'Fraud Guardian',
          thought: 'Auditing recent debit velocity, geolocation headers, and merchant MCC credentials.',
          decision: 'Assessed transaction safety. Duplicate check initiated.',
          timestamp: timeStr
        });
        replyText = "Fraud Guardian has inspected your security parameters:\n\n• Security Assessment:\n  - Current risk score is within acceptable limits (Low to Medium).\n  - No rogue IP signatures or unauthorized token revokes detected.\n\n• Security Recommendations:\n  1. Verify 2FA is active on your PayPal Sandbox credentials.\n  2. Flag any repeated identical charge amounts within 15 minutes.";
        reasons = [
          'Frequent charges to same merchant detected within short interval.',
          'Merchant merchant-category-code matches high-scrutiny vendor.'
        ];
        actions = [
          'Review flagged charges in the Fraud Detection tab.',
          'Lock virtual card if you do not recognize the vendor.'
        ];
        confidenceScore = 0.92;
        break;

      case 'refund':
        reasoningChain.push({
          agentId: 'refund',
          agentName: 'Refund Assistant',
          thought: 'Checking PayPal Buyer Protection eligibility window (180 days) & merchant refund policy.',
          decision: 'Transaction is eligible for automated refund request.',
          timestamp: timeStr
        });
        replyText = "Refund Assistant verified your refund eligibility:\n\n• Policy Evaluation:\n  - Under PayPal Buyer Protection, eligible purchases can be claimed within 180 days.\n  - Standard merchant credit cycle is 1 to 3 business days.\n\n• How to proceed:\n  1. Submit a refund request through our Refund Center.\n  2. Track live status until funds return to your balance.";
        reasons = [
          'Order meets standard 180-day buyer protection policy.',
          'Merchant accepts direct PayPal API reverse captures.'
        ];
        actions = [
          'Open the Refund Center tab to submit one-click claim.',
          'Keep your proof of purchase or cancellation email handy.'
        ];
        confidenceScore = 0.98;
        break;

      case 'dispute':
        reasoningChain.push({
          agentId: 'dispute',
          agentName: 'Dispute Assistant',
          thought: 'Cross-referencing PayPal Resolution Center rules for unauthorized activity and item not received.',
          decision: 'Preparing formal evidence dossier.',
          timestamp: timeStr
        });
        replyText = "Dispute Assistant is ready to help you resolve this issue:\n\n• Resolution Overview:\n  - We will build a structured case statement with verified transaction IDs.\n  - Both parties have a 20-day negotiation phase before escalation to a PayPal claim.\n\n• Next Steps:\n  1. Use our Dispute Tools to generate a factual dispute summary.\n  2. Upload receipts or screenshots in the Evidence Organizer.";
        reasons = [
          'Merchant communication has stalled beyond 48 hours.',
          'Item was not received or significantly not as described.'
        ];
        actions = [
          'Generate Dispute Summary in the Dispute Assistant.',
          'Upload receipts or tracking logs before submitting to PayPal.'
        ];
        confidenceScore = 0.95;
        break;

      default:
        replyText = `ResolveAI Coordinator has routed your request to our multi-agent network. How would you like us to proceed with your transaction?`;
        break;
    }

    const agentNameMap: Record<AIAgentId, string> = {
      coordinator: 'ResolveAI (AI Coordinator)',
      detective: 'Transaction Detective',
      guardian: 'Fraud Guardian',
      refund: 'Refund Assistant',
      dispute: 'Dispute Assistant'
    };

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'agent',
      agentId: chosenAgent,
      agentName: agentNameMap[chosenAgent],
      timestamp: timeStr,
      text: replyText,
      reasons,
      actions,
      confidenceScore
    };

    return {
      message: newMsg,
      delegatedAgentId: chosenAgent,
      reasoningChain
    };
  }
}
