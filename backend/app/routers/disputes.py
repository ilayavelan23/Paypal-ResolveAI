from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import uuid
from ..database import get_db
from ..models.transaction import DisputeModel, TransactionModel
from ..schemas.transaction import DisputeCreate, DisputeResponse

router = APIRouter(prefix="/disputes", tags=["Disputes"])

@router.get("", response_model=List[DisputeResponse])
def get_disputes(db: Session = Depends(get_db)):
    return db.query(DisputeModel).all()

@router.post("", response_model=DisputeResponse)
def create_dispute(dispute_req: DisputeCreate, db: Session = Depends(get_db)):
    clean_id = dispute_req.transaction_id.lstrip("#").strip()
    tx = db.query(TransactionModel).filter(
        (TransactionModel.id == dispute_req.transaction_id) |
        (TransactionModel.id == clean_id) |
        (TransactionModel.id == f"#{clean_id}")
    ).first()
    merchant_name = tx.merchant if tx else "Online Store"
    amount = tx.amount if tx else 49.99

    statement = dispute_req.statement or f"Formal dispute claim for {merchant_name} under category: {dispute_req.category}. Buyer attempted resolution without success."

    new_dispute = DisputeModel(
        id="DISP-" + str(uuid.uuid4())[:6].upper(),
        transaction_id=dispute_req.transaction_id,
        merchant=merchant_name,
        amount=amount,
        category=dispute_req.category,
        status="Ready",
        statement=statement,
        evidence_count=2
    )
    db.add(new_dispute)
    db.commit()
    db.refresh(new_dispute)
    return new_dispute
