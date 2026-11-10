import json
from sqlalchemy.orm import Session
from .models.transaction import TransactionModel, RefundModel

def seed_initial_data(db: Session):
    # Check if already seeded
    if db.query(TransactionModel).count() > 0:
        return

    # Seed Primary Transaction (Amazon India $49.99 Pending)
    primary_timeline = [
        {"title": "Payment Initiated", "description": "Your payment request was created.", "time": "Nov 07, 10:24 AM", "status": "completed"},
        {"title": "Processing (Current)", "description": "PayPal is processing your payment.", "time": "Nov 07, 10:24 AM", "status": "current"},
        {"title": "Merchant Confirmation", "description": "Waiting for merchant to confirm the payment.", "time": "—", "status": "pending"},
        {"title": "Payment Completion", "description": "Transaction will be marked as completed.", "time": "—", "status": "pending"}
    ]

    primary_tx = TransactionModel(
        id="PP-8F7K2D1",
        date="Nov 07, 2026, 10:24 AM",
        merchant="Amazon India",
        merchant_key="amazon",
        amount=49.99,
        currency="USD",
        status="Pending",
        source="PayPal",
        payment_method="PayPal Balance",
        expected_completion="Within 30 minutes",
        risk_level="Low",
        risk_score=2,
        risk_description="Based on transaction behavior and account patterns (Low Risk: 2/10)",
        ai_explanation="Your payment of $49.99 to Amazon India is currently pending. This usually means PayPal is still processing the transaction or waiting for confirmation from the merchant.",
        timeline_json=json.dumps(primary_timeline),
        receipt_number="REC-AMZ-2026-98124"
    )
    db.add(primary_tx)

    # Seed additional transactions from reference designs
    extra_txs = [
        {
            "id": "PP-9X3M1A4", "date": "Nov 06, 2026, 08:11 PM", "merchant": "Flipkart", "merchant_key": "flipkart",
            "amount": 29.50, "status": "Pending", "source": "Demo", "payment_method": "Visa Debit •••• 1092",
            "risk_level": "Low", "risk_score": 1, "expected_completion": "Within 45 minutes"
        },
        {
            "id": "PP-4B2L9K8", "date": "Nov 05, 2026, 04:37 PM", "merchant": "Netflix Subscription", "merchant_key": "netflix",
            "amount": 12.99, "status": "Completed", "source": "PayPal", "payment_method": "PayPal Balance",
            "risk_level": "Low", "risk_score": 0
        },
        {
            "id": "PP-7G1P5E2", "date": "Nov 04, 2026, 11:02 AM", "merchant": "Gaming Purchase", "merchant_key": "gaming",
            "amount": 69.99, "status": "Failed", "source": "Demo", "payment_method": "Mastercard •••• 8831",
            "risk_level": "Medium", "risk_score": 5, "flagged_reason": "Multiple attempts (3 times)"
        },
        {
            "id": "PP-2H8Q4N9", "date": "Nov 03, 2026, 07:18 PM", "merchant": "Google Workspace", "merchant_key": "google",
            "amount": 14.00, "status": "Completed", "source": "Demo", "payment_method": "PayPal Balance",
            "risk_level": "Low", "risk_score": 0
        },
        {
            "id": "PP-5V1W9D8", "date": "Nov 06, 2026, 09:14 PM", "merchant": "Online Store", "merchant_key": "other",
            "amount": 49.99, "status": "Completed", "source": "PayPal", "payment_method": "Visa •••• 4242",
            "risk_level": "High", "risk_score": 8, "flagged_reason": "Possible duplicate payment"
        },
        {
            "id": "PP-3K7J2F1", "date": "Nov 05, 2026, 03:21 PM", "merchant": "Digital Service", "merchant_key": "other",
            "amount": 199.00, "status": "Completed", "source": "Demo", "payment_method": "PayPal Credit",
            "risk_level": "Medium", "risk_score": 6, "flagged_reason": "Unusual amount (3x higher)"
        },
        {
            "id": "PP-0P7A5M9", "date": "Oct 30, 2026, 11:15 AM", "merchant": "Global Luxury Goods", "merchant_key": "other",
            "amount": 999.00, "status": "Completed", "source": "PayPal", "payment_method": "Checking Account",
            "risk_level": "High", "risk_score": 7, "flagged_reason": "High amount transaction ($999.00)"
        }
    ]

    for item in extra_txs:
        db.add(TransactionModel(
            id=item["id"],
            date=item["date"],
            merchant=item["merchant"],
            merchant_key=item["merchant_key"],
            amount=item["amount"],
            currency="USD",
            status=item["status"],
            source=item["source"],
            payment_method=item["payment_method"],
            expected_completion=item.get("expected_completion"),
            risk_level=item["risk_level"],
            risk_score=item["risk_score"],
            flagged_reason=item.get("flagged_reason")
        ))

    # Seed Active Refund (#RF-784291)
    db.add(RefundModel(
        id="RF-784291",
        transaction_id="PP-8F7K2D1",
        merchant="Amazon India",
        amount=49.99,
        currency="USD",
        requested_date="Nov 06, 2026, 08:20 PM",
        status="In Progress",
        current_step=3,
        estimated_resolution="Nov 09, 2026",
        guidance="Your refund is being processed. Most refunds are completed within 1-3 business days after approval."
    ))

    db.commit()
