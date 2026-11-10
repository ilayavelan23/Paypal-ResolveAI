from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class TimelineStepSchema(BaseModel):
    title: str
    description: str
    time: str
    status: str

class TransactionResponse(BaseModel):
    id: str
    date: str
    merchant: str
    merchant_key: str
    amount: float
    currency: str
    status: str
    source: str
    payment_method: str
    expected_completion: Optional[str] = None
    risk_level: str
    risk_score: int
    risk_description: Optional[str] = None
    ai_explanation: Optional[str] = None
    flagged_reason: Optional[str] = None
    timeline: Optional[List[TimelineStepSchema]] = None
    receipt_number: Optional[str] = None

    class Config:
        from_attributes = True

class RefundCreate(BaseModel):
    transaction_id: str
    reason: str
    amount: Optional[float] = None

class RefundResponse(BaseModel):
    id: str
    transaction_id: str
    merchant: str
    amount: float
    currency: str
    requested_date: str
    status: str
    current_step: int
    estimated_resolution: Optional[str] = None
    guidance: Optional[str] = None

    class Config:
        from_attributes = True

class DisputeCreate(BaseModel):
    transaction_id: str
    category: str
    statement: Optional[str] = None

class DisputeResponse(BaseModel):
    id: str
    transaction_id: str
    merchant: str
    amount: float
    category: str
    status: str
    statement: Optional[str] = None
    evidence_count: int

    class Config:
        from_attributes = True

class AgentReasoningStepSchema(BaseModel):
    agent_id: str
    agent_name: str
    thought: str
    decision: str
    timestamp: str

class AgentQueryRequest(BaseModel):
    prompt: str
    active_agent: Optional[str] = "coordinator"
    transaction_id: Optional[str] = None

class AgentQueryResponse(BaseModel):
    reply: str
    delegated_agent: str
    agent_name: str
    reasons: Optional[List[str]] = None
    actions: Optional[List[str]] = None
    confidence_score: float
    reasoning_chain: List[AgentReasoningStepSchema]
    model_generated: bool = False
    model_provider: str = "Rule-Based Heuristic Engine"
    grounded_transaction_id: Optional[str] = None

class PayPalStatusResponse(BaseModel):
    environment: str
    api_base: str
    connected: bool
    is_mock: bool
    credentials_configured: bool
    missing_credentials: List[str]
    client_id_prefix: Optional[str] = None
    permissions: List[str]
    source: str

class PayPalOrderCreate(BaseModel):
    amount: float
    currency: str = "USD"
    description: Optional[str] = None

class PayPalOrderResponse(BaseModel):
    id: str
    status: str
    approval_url: Optional[str] = None
    is_mock: bool = True
    source: str = "simulated_sandbox_fallback"
    environment: str = "sandbox"

class PayPalCaptureResponse(BaseModel):
    capture_id: str
    status: str
    amount: float
    is_mock: bool = True
    source: str = "simulated_sandbox_fallback"
    environment: str = "sandbox"
    error_detail: Optional[str] = None

class PayPalOrderDetailsResponse(BaseModel):
    id: str
    status: str
    amount: float
    currency: str
    approval_url: Optional[str] = None
    payer_email: Optional[str] = None
    create_time: Optional[str] = None
    is_mock: bool = False
    source: str = "paypal_sandbox_api"
    environment: str = "sandbox"
