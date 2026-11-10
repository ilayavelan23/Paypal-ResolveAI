from sqlalchemy import Column, String, Float, Integer, Text, Boolean
from ..database import Base

class TransactionModel(Base):
    __tablename__ = "transactions"

    id = Column(String(64), primary_key=True, index=True)
    date = Column(String(64), nullable=False)
    merchant = Column(String(128), nullable=False)
    merchant_key = Column(String(64), default="other")
    amount = Column(Float, nullable=False)
    currency = Column(String(8), default="USD")
    status = Column(String(32), default="Completed")
    source = Column(String(32), default="PayPal")
    payment_method = Column(String(128), default="PayPal Balance")
    expected_completion = Column(String(64), nullable=True)
    risk_level = Column(String(32), default="Low")
    risk_score = Column(Integer, default=0)
    risk_description = Column(Text, nullable=True)
    ai_explanation = Column(Text, nullable=True)
    flagged_reason = Column(String(255), nullable=True)
    timeline_json = Column(Text, nullable=True)
    receipt_number = Column(String(64), nullable=True)

class RefundModel(Base):
    __tablename__ = "refunds"

    id = Column(String(64), primary_key=True, index=True)
    transaction_id = Column(String(64), nullable=False)
    merchant = Column(String(128), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(8), default="USD")
    requested_date = Column(String(64), nullable=False)
    status = Column(String(32), default="In Progress")
    current_step = Column(Integer, default=1)
    estimated_resolution = Column(String(64), nullable=True)
    guidance = Column(Text, nullable=True)

class DisputeModel(Base):
    __tablename__ = "disputes"

    id = Column(String(64), primary_key=True, index=True)
    transaction_id = Column(String(64), nullable=False)
    merchant = Column(String(128), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(64), default="Item Not Received")
    status = Column(String(32), default="Draft")
    statement = Column(Text, nullable=True)
    evidence_count = Column(Integer, default=1)
