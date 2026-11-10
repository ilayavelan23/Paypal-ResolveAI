from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.transaction import AgentQueryRequest, AgentQueryResponse
from ..services.agent_coordinator import agent_coordinator

router = APIRouter(prefix="/agents", tags=["AI Agents"])

@router.post("/chat", response_model=AgentQueryResponse)
async def dispatch_agent_query(req: AgentQueryRequest, db: Session = Depends(get_db)):
    """
    Central AI Coordinator routing and multi-agent intent resolution.
    Grounded in real database transaction context and backed by hosted AI model.
    """
    return await agent_coordinator.process_query(
        prompt=req.prompt,
        requested_agent=req.active_agent or "coordinator",
        tx_id=req.transaction_id,
        db=db
    )
