from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uuid
from ..database import get_db
from ..models.transaction import RefundModel, TransactionModel
from ..schemas.transaction import RefundCreate, RefundResponse

router = APIRouter(prefix="/refunds", tags=["Refunds"])

@router.get("", response_model=List[RefundResponse])
def get_refunds(db: Session = Depends(get_db)):
    return db.query(RefundModel).all()

@router.post("", response_model=RefundResponse)
def create_refund(refund_req: RefundCreate, db: Session = Depends(get_db)):
    clean_id = refund_req.transaction_id.lstrip("#").strip()
    tx = db.query(TransactionModel).filter(
        (TransactionModel.id == refund_req.transaction_id) |
        (TransactionModel.id == clean_id) |
        (TransactionModel.id == f"#{clean_id}")
    ).first()
    merchant_name = tx.merchant if tx else "Online Merchant"
    amount = refund_req.amount if refund_req.amount else (tx.amount if tx else 49.99)
    currency = tx.currency if tx else "USD"

    new_refund = RefundModel(
        id="RF-" + str(uuid.uuid4())[:6].upper(),
        transaction_id=refund_req.transaction_id,
        merchant=merchant_name,
        amount=amount,
        currency=currency,
        requested_date=datetime.now().strftime("%b %d, %Y, %I:%M %p"),
        status="In Progress",
        current_step=1,
        estimated_resolution="In 3 business days",
        guidance=f"Refund request created for {merchant_name}. AI Refund Assistant is monitoring merchant response."
    )
    db.add(new_refund)
    db.commit()
    db.refresh(new_refund)
    return new_refund
