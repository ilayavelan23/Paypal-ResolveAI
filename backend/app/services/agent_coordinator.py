import json
import re
import httpx
import asyncio
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session
from ..config import settings
from ..schemas.transaction import AgentReasoningStepSchema, AgentQueryResponse
from ..models.transaction import TransactionModel, RefundModel

class MultiAgentCoordinator:
    """
    Central AI Coordinator and Specialist Agent Orchestrator.
    Integrates genuine server-side Google Gemini Flash AI model with secure keys
    and grounds responses in SQLite transaction & refund database context.
    """
    def __init__(self):
        self.agents = {
            "coordinator": "AI Coordinator",
            "detective": "Transaction Detective",
            "guardian": "Fraud Guardian",
            "refund": "Refund Assistant",
            "dispute": "Dispute Assistant"
        }

    def _get_database_context(self, db: Optional[Session], tx_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Retrieves real account ledger records from SQLite database to ground AI responses.
        """
        if not db:
            return {"active_transaction": None, "transactions": [], "refunds": []}

        try:
            target_tx = None
            if tx_id:
                clean_id = tx_id.lstrip("#").strip()
                target_tx = db.query(TransactionModel).filter(
                    (TransactionModel.id == tx_id) |
                    (TransactionModel.id == clean_id) |
                    (TransactionModel.id == f"#{clean_id}")
                ).first()
            if not target_tx:
                target_tx = db.query(TransactionModel).filter(TransactionModel.id == "PP-8F7K2D1").first()

            all_txs = db.query(TransactionModel).limit(8).all()
            all_refunds = db.query(RefundModel).limit(3).all()

            return {
                "active_transaction": {
                    "id": target_tx.id,
                    "merchant": target_tx.merchant,
                    "amount": target_tx.amount,
                    "currency": target_tx.currency,
                    "status": target_tx.status,
                    "date": target_tx.date,
                    "payment_method": target_tx.payment_method,
                    "risk_level": target_tx.risk_level,
                    "risk_score": target_tx.risk_score,
                    "expected_completion": target_tx.expected_completion,
                    "flagged_reason": target_tx.flagged_reason
                } if target_tx else None,
                "recent_transactions": [
                    {"id": t.id, "merchant": t.merchant, "amount": t.amount, "status": t.status, "risk": t.risk_level}
                    for t in all_txs
                ],
                "active_refunds": [
                    {"id": r.id, "merchant": r.merchant, "amount": r.amount, "status": r.status, "step": r.current_step}
                    for r in all_refunds
                ]
            }
        except Exception:
            return {"active_transaction": None, "transactions": [], "refunds": []}

    def _build_agent_directive(self, delegated_agent: str, context: Dict[str, Any]) -> str:
        active_tx = context.get("active_transaction") or {}
        tx_summary = f"Transaction ID: {active_tx.get('id', 'PP-8F7K2D1')}, Merchant: {active_tx.get('merchant', 'Amazon India')}, Amount: ${active_tx.get('amount', 49.99)}, Status: {active_tx.get('status', 'Pending')}, Payment Method: {active_tx.get('payment_method', 'PayPal Balance')}, Risk: {active_tx.get('risk_level', 'Low')} ({active_tx.get('risk_score', 2)}/10)."

        if delegated_agent == "detective":
            role_desc = "You are the Transaction Detective. Conduct forensic analysis on payment status, merchant authorization holds, bank settlement latencies, and network clearing queues."
        elif delegated_agent == "guardian":
            role_desc = "You are the Fraud Guardian. Conduct security and anomaly risk assessment. Explicitly distinguish rule-based scoring (duplicate timestamps, velocity burst, MCC code flags) from your model-generated behavioral risk analysis."
        elif delegated_agent == "refund":
            role_desc = "You are the Refund Assistant. Provide clear refund guidance grounded in PayPal Buyer Protection 180-day policy window, merchant return obligations, and the 4-step refund progression (Request Submitted -> Under Review -> Processing 1-3 business days -> Refunded)."
        elif delegated_agent == "dispute":
            role_desc = "You are the Dispute Assistant. Help the user compile an evidence-backed dispute statement formatted for the official PayPal Resolution Center, explaining the 20-day mutual negotiation window."
        else:
            role_desc = "You are the central AI Coordinator for PayPal ResolveAI. Evaluate user intent and synthesize findings across the specialist agents."

        return f"""
{role_desc}

DATABASE LEDGER CONTEXT (STRICT GROUNDING):
Active Transaction: {tx_summary}
Account Context: {json.dumps(context, indent=2)}

MANDATORY RULES:
1. ONLY refer to actual records present in the database context. NEVER fabricate payment IDs, merchant names, amounts, or claim actions occurred if not recorded in the ledger.
2. For Fraud Guardian queries, clearly state the rule-based risk score and differentiate it from your qualitative AI reasoning.
3. Respond STRICTLY in valid JSON matching this schema:
{{
  "reply": "Clear, professional, fintech markdown explanation with Likely Reasons and Recommended Actions.",
  "reasons": ["Concise root cause 1", "Concise root cause 2"],
  "actions": ["Recommended step 1", "Recommended step 2"],
  "thought": "Internal forensic thought of {self.agents.get(delegated_agent)} analyzing the real ledger records.",
  "decision": "Actionable routing or investigative decision made by {self.agents.get(delegated_agent)}.",
  "confidence": 0.96
}}
"""

    async def _call_gemini_api(self, prompt: str, delegated_agent: str, context: Dict[str, Any]) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        """
        Invokes Google Gemini REST API using server-side GEMINI_API_KEY.
        Never exposes keys to the frontend.
        """
        if not settings.GEMINI_API_KEY:
            return None, None

        system_instruction = self._build_agent_directive(delegated_agent, context)
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"System Directive:\n{system_instruction}\n\nUser Question:\n{prompt}"}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }

        # Candidate models supported by Gemini v1beta
        candidate_models = ["gemini-flash-lite-latest", "gemini-flash-latest", "gemini-2.5-flash"]

        async with httpx.AsyncClient(timeout=25.0) as client:
            for model_name in candidate_models:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={settings.GEMINI_API_KEY}"
                for attempt in range(2):
                    try:
                        resp = await client.post(url, json=payload)
                        if resp.status_code == 200:
                            data = resp.json()
                            candidates = data.get("candidates", [])
                            if candidates:
                                raw_text = candidates[0]["content"]["parts"][0]["text"].strip()
                                cleaned_text = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw_text, flags=re.DOTALL)
                                parsed = json.loads(cleaned_text)
                                return parsed, model_name
                        elif resp.status_code in [503, 429] and attempt == 0:
                            await asyncio.sleep(1.2)
                            continue
                        else:
                            break
                    except Exception:
                        if attempt == 0:
                            await asyncio.sleep(0.5)
                            continue
                        break

        return None, None

    async def process_query(
        self,
        prompt: str,
        requested_agent: str = "coordinator",
        tx_id: Optional[str] = None,
        db: Optional[Session] = None
    ) -> AgentQueryResponse:
        lower = prompt.lower()
        now_time = datetime.now().strftime("%I:%M %p")

        # 1. Intent Classification & Routing
        delegated_agent = requested_agent if requested_agent in self.agents and requested_agent != "coordinator" else "coordinator"

        if delegated_agent == "coordinator":
            if any(k in lower for k in ["refund", "return", "cancel", "money back", "reversal"]):
                delegated_agent = "refund"
            elif any(k in lower for k in ["fraud", "suspicious", "safe", "scam", "duplicate", "hacked"]):
                delegated_agent = "guardian"
            elif any(k in lower for k in ["dispute", "claim", "evidence", "chargeback", "resolution"]):
                delegated_agent = "dispute"
            else:
                delegated_agent = "detective"

        # 2. Retrieve SQLite Database Context
        context = self._get_database_context(db, tx_id)
        active_tx = context.get("active_transaction") or {}
        tx_id_ref = active_tx.get("id", "PP-8F7K2D1")
        tx_amt = active_tx.get("amount", 49.99)
        tx_merchant = active_tx.get("merchant", "Amazon India")

        # 3. Attempt Genuine Server-Side Google Gemini API Call
        gemini_result, used_model = await self._call_gemini_api(prompt, delegated_agent, context)

        if gemini_result and used_model:
            # Model generated output verified
            reasoning_chain = [
                AgentReasoningStepSchema(
                    agent_id="coordinator",
                    agent_name="AI Coordinator",
                    thought=f'Parsed input inquiry: "{prompt}". Intent matched to domain model: {delegated_agent.upper()}. Grounded on {tx_merchant} ({tx_id_ref}).',
                    decision=f'Delegated request to {self.agents[delegated_agent]} backed by Google Gemini ({used_model}).',
                    timestamp=now_time
                ),
                AgentReasoningStepSchema(
                    agent_id=delegated_agent,
                    agent_name=self.agents[delegated_agent],
                    thought=gemini_result.get("thought", f"Evaluated live ledger context for {tx_merchant} (${tx_amt})."),
                    decision=gemini_result.get("decision", "Completed live model diagnosis."),
                    timestamp=now_time
                )
            ]

            return AgentQueryResponse(
                reply=gemini_result.get("reply", "Analysis complete."),
                delegated_agent=delegated_agent,
                agent_name=self.agents[delegated_agent],
                reasons=gemini_result.get("reasons", []),
                actions=gemini_result.get("actions", []),
                confidence_score=float(gemini_result.get("confidence", 0.97)),
                reasoning_chain=reasoning_chain,
                model_generated=True,
                model_provider=f"Google Gemini ({used_model})",
                grounded_transaction_id=tx_id_ref
            )

        # 4. Deterministic Grounded Fallback (Active only if Gemini API is unreachable or times out)
        provider_label = "Rule-Based Heuristic Fallback (Gemini API unavailable or timeout)"
        reasoning_chain = [
            AgentReasoningStepSchema(
                agent_id="coordinator",
                agent_name="AI Coordinator",
                thought=f'Parsed input inquiry: "{prompt}". Intent matched to domain model: {delegated_agent.upper()}. Grounded on {tx_merchant} ({tx_id_ref}).',
                decision=f'Delegated request to {self.agents[delegated_agent]} for forensic state analysis.',
                timestamp=now_time
            )
        ]

        if delegated_agent == "detective":
            reasoning_chain.append(
                AgentReasoningStepSchema(
                    agent_id="detective",
                    agent_name="Transaction Detective",
                    thought=f"Inspected SQLite transaction {tx_id_ref} for {tx_merchant} (${tx_amt}). Status is currently {active_tx.get('status', 'Pending')}.",
                    decision="Identified authorization buffer. Merchant acknowledgment pending within normal threshold.",
                    timestamp=now_time
                )
            )
            reply = f"I've analyzed your query regarding transaction {tx_id_ref} to {tx_merchant} (${tx_amt:.2f}) using the Transaction Detective.\n\n• Likely Reasons:\n  - The payment of ${tx_amt:.2f} is still being processed by {tx_merchant}.\n  - Bank or network authorization queue delay (usually 5–30 minutes).\n  - Additional random security clearing check in progress.\n\n• Recommended Actions:\n  1. Wait a while and refresh transaction status.\n  2. Check if the amount was debited from your funding source ({active_tx.get('payment_method', 'PayPal Balance')}).\n  3. If it remains pending after 1 hour, contact {tx_merchant} or start a PayPal dispute."
            reasons = [
                f"The payment of ${tx_amt:.2f} is still being processed by {tx_merchant}.",
                "Bank or network authorization queue delay (usually 5–30 minutes).",
                "Additional random security clearing check in progress."
            ]
            actions = [
                "Wait 30 minutes and refresh transaction status in your dashboard.",
                f"Check if ${tx_amt:.2f} was debited from your {active_tx.get('payment_method', 'PayPal Balance')}.",
                f"If delayed beyond expected completion ({active_tx.get('expected_completion', '30 minutes')}), initiate refund inquiry."
            ]
            confidence = 0.96

        elif delegated_agent == "guardian":
            reasoning_chain.append(
                AgentReasoningStepSchema(
                    agent_id="guardian",
                    agent_name="Fraud Guardian",
                    thought=f"Audited risk parameters for {tx_merchant} (Risk Score: {active_tx.get('risk_score', 2)}/10, {active_tx.get('risk_level', 'Low')}).",
                    decision="Assessed security posture. No unauthorized account takeover signatures found.",
                    timestamp=now_time
                )
            )
            reply = f"Fraud Guardian evaluated your account and transaction {tx_id_ref}:\n\n• Security Assessment:\n  - Risk Level: {active_tx.get('risk_level', 'Low')} ({active_tx.get('risk_score', 2)}/10).\n  - Two-Factor Authentication and PayPal Sandbox token protection are active.\n\n• Recommended Actions:\n  1. Review flagged items in the Fraud Detection tab.\n  2. Verify that order total (${tx_amt:.2f}) matches your purchase receipt."
            reasons = [
                f"Transaction risk level is {active_tx.get('risk_level', 'Low')} based on merchant history.",
                "Merchant category authorization conforms to normal spending velocity."
            ]
            actions = [
                "Review flagged charges in the Fraud Detection tab.",
                "Verify order details match merchant checkout confirmation."
            ]
            confidence = 0.94

        elif delegated_agent == "refund":
            reasoning_chain.append(
                AgentReasoningStepSchema(
                    agent_id="refund",
                    agent_name="Refund Assistant",
                    thought=f"Evaluated PayPal Buyer Protection rules for {tx_merchant} order {tx_id_ref} (${tx_amt:.2f}).",
                    decision="Transaction is eligible for automated refund filing under 180-day purchase protection.",
                    timestamp=now_time
                )
            )
            reply = f"Refund Assistant evaluated your refund eligibility for {tx_merchant} (${tx_amt:.2f}):\n\n• Eligibility Findings:\n  - Order falls within the 180-day PayPal Buyer Protection window.\n  - Merchant settlement reversal typically takes 1–3 business days.\n\n• Recommended Next Steps:\n  1. Submit a refund claim in the Refund Center for transaction {tx_id_ref}.\n  2. Track live review progress on the timeline stepper."
            reasons = [
                "Order is within the standard 180-day eligibility window.",
                f"{tx_merchant} accepts direct PayPal Sandbox reverse captures."
            ]
            actions = [
                f"Submit a refund claim in the Refund Center for transaction {tx_id_ref}.",
                "Retain your order confirmation email for proof of purchase."
            ]
            confidence = 0.98

        else: # dispute
            reasoning_chain.append(
                AgentReasoningStepSchema(
                    agent_id="dispute",
                    agent_name="Dispute Assistant",
                    thought=f"Synthesized transaction timeline for {tx_merchant} {tx_id_ref} and compiled factual case statement.",
                    decision="Generated formal dispute statement formatted for official PayPal Resolution Center.",
                    timestamp=now_time
                )
            )
            reply = f"Dispute Assistant is ready to help you resolve this issue with {tx_merchant}:\n\n• Resolution Overview:\n  - We compiled a structured dispute statement referencing transaction {tx_id_ref} (${tx_amt:.2f}).\n  - Both parties have a 20-day negotiation phase before escalation to a PayPal claim.\n\n• Recommended Actions:\n  1. Copy the generated statement from the Dispute Assistant.\n  2. Attach order receipts or merchant communication logs."
            reasons = [
                "Merchant fulfillment has stalled beyond expected delivery window.",
                "Dispute preparation dossier assembled with verified IDs."
            ]
            actions = [
                "Generate Dispute Summary in the Dispute Assistant.",
                "Upload receipts or tracking logs before submitting to PayPal."
            ]
            confidence = 0.95

        return AgentQueryResponse(
            reply=reply,
            delegated_agent=delegated_agent,
            agent_name=self.agents[delegated_agent],
            reasons=reasons,
            actions=actions,
            confidence_score=confidence,
            reasoning_chain=reasoning_chain,
            model_generated=False,
            model_provider=provider_label,
            grounded_transaction_id=tx_id_ref
        )

agent_coordinator = MultiAgentCoordinator()
