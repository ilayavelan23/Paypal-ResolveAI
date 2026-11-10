from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from ..database import get_db
from ..models.transaction import TransactionModel
from ..schemas.transaction import TransactionResponse

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get("", response_model=List[TransactionResponse])
def get_transactions(
    source: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(TransactionModel)
    if source and source != "All":
        query = query.filter(TransactionModel.source == source)
    if status and status != "All":
        query = query.filter(TransactionModel.status == status)

    results = query.limit(limit).all()

    output = []
    for tx in results:
        timeline = None
        if tx.timeline_json:
            try:
                timeline = json.loads(tx.timeline_json)
            except Exception:
                pass

        output.append(TransactionResponse(
            id=tx.id,
            date=tx.date,
            merchant=tx.merchant,
            merchant_key=tx.merchant_key,
            amount=tx.amount,
            currency=tx.currency,
            status=tx.status,
            source=tx.source,
            payment_method=tx.payment_method,
            expected_completion=tx.expected_completion,
            risk_level=tx.risk_level,
            risk_score=tx.risk_score,
            risk_description=tx.risk_description,
            ai_explanation=tx.ai_explanation,
            flagged_reason=tx.flagged_reason,
            timeline=timeline,
            receipt_number=tx.receipt_number
        ))
    return output

@router.get("/{tx_id}", response_model=TransactionResponse)
def get_transaction_by_id(tx_id: str, db: Session = Depends(get_db)):
    clean_id = tx_id.lstrip("#").strip()
    tx = db.query(TransactionModel).filter(
        (TransactionModel.id == tx_id) |
        (TransactionModel.id == clean_id) |
        (TransactionModel.id == f"#{clean_id}")
    ).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    timeline = None
    if tx.timeline_json:
        try:
            timeline = json.loads(tx.timeline_json)
        except Exception:
            pass

    return TransactionResponse(
        id=tx.id,
        date=tx.date,
        merchant=tx.merchant,
        merchant_key=tx.merchant_key,
        amount=tx.amount,
        currency=tx.currency,
        status=tx.status,
        source=tx.source,
        payment_method=tx.payment_method,
        expected_completion=tx.expected_completion,
        risk_level=tx.risk_level,
        risk_score=tx.risk_score,
        risk_description=tx.risk_description,
        ai_explanation=tx.ai_explanation,
        flagged_reason=tx.flagged_reason,
        timeline=timeline,
        receipt_number=tx.receipt_number
    )
