from fastapi import APIRouter
from ..services.paypal_service import paypal_service
from ..schemas.transaction import (
    PayPalOrderCreate,
    PayPalOrderResponse,
    PayPalCaptureResponse,
    PayPalStatusResponse,
    PayPalOrderDetailsResponse
)

router = APIRouter(prefix="/paypal", tags=["PayPal Sandbox"])

@router.get("/status", response_model=PayPalStatusResponse)
async def get_sandbox_status():
    """
    Returns verified PayPal Sandbox connectivity status without exposing secrets.
    Explicitly reports whether genuine Sandbox credentials are configured
    or whether fallback simulation is active.
    """
    status_info = await paypal_service.get_sandbox_status()
    return PayPalStatusResponse(**status_info)

@router.post("/orders", response_model=PayPalOrderResponse)
async def create_sandbox_order(order_req: PayPalOrderCreate):
    """
    Creates an official v2 Checkout Order in PayPal Sandbox
    """
    result = await paypal_service.create_order(
        amount=order_req.amount,
        currency=order_req.currency,
        description=order_req.description
    )
    return PayPalOrderResponse(**result)

@router.get("/orders/{order_id}", response_model=PayPalOrderDetailsResponse)
async def get_sandbox_order(order_id: str):
    """
    Retrieves real-time order status from PayPal Sandbox
    """
    result = await paypal_service.get_order(order_id)
    return PayPalOrderDetailsResponse(**result)

@router.post("/orders/{order_id}/capture", response_model=PayPalCaptureResponse)
async def capture_sandbox_order(order_id: str):
    """
    Captures authorized payment in PayPal Sandbox
    """
    result = await paypal_service.capture_order(order_id)
    return PayPalCaptureResponse(**result)
