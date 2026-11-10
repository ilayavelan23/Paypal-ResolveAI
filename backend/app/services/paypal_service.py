import httpx
import base64
from typing import Dict, Any, Optional, List
from ..config import settings

class PayPalService:
    """
    Official PayPal Developer Sandbox Service.
    Handles server-side OAuth 2.0, Orders v2 creation, buyer approval routing, and capture.
    All calls are strictly scoped to https://api-m.sandbox.paypal.com.
    Credentials remain exclusively server-side.
    """
    @property
    def client_id(self) -> Optional[str]:
        return settings.PAYPAL_CLIENT_ID

    @property
    def client_secret(self) -> Optional[str]:
        return settings.PAYPAL_CLIENT_SECRET

    @property
    def base_url(self) -> str:
        return settings.PAYPAL_API_BASE.rstrip('/')

    def _get_missing_credentials(self) -> List[str]:
        missing = []
        if not self.client_id or len(self.client_id.strip()) < 5:
            missing.append("PAYPAL_CLIENT_ID")
        if not self.client_secret or len(self.client_secret.strip()) < 5 or "PLACEHOLDER" in self.client_secret:
            missing.append("PAYPAL_CLIENT_SECRET")
        return missing

    def _get_auth_header(self) -> Optional[Dict[str, str]]:
        if not self.client_id or not self.client_secret or "PLACEHOLDER" in self.client_secret:
            return None
        auth_str = f"{self.client_id.strip()}:{self.client_secret.strip()}"
        encoded_auth = base64.b64encode(auth_str.encode()).decode()
        return {
            "Authorization": f"Basic {encoded_auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        }

    async def get_sandbox_status(self) -> Dict[str, Any]:
        """
        Inspects live PayPal Sandbox connectivity.
        Accurately reports whether genuine Sandbox credentials are configured
        or whether fallback simulation is active.
        """
        missing = self._get_missing_credentials()
        client_prefix = (self.client_id[:8] + "...") if self.client_id else None

        if missing:
            return {
                "environment": settings.PAYPAL_ENV,
                "api_base": self.base_url,
                "connected": False,
                "credentials_configured": False,
                "is_mock": True,
                "missing_credentials": missing,
                "client_id_prefix": client_prefix,
                "source": "simulated_sandbox_fallback",
                "permissions": ["Create Orders", "Capture Payments", "Read Transactions"]
            }

        # Attempt actual token retrieval against PayPal Sandbox
        token_res = await self.get_access_token()
        is_live_connected = bool(token_res.get("access_token") and not token_res.get("is_mock"))

        return {
            "environment": settings.PAYPAL_ENV,
            "api_base": self.base_url,
            "connected": is_live_connected,
            "credentials_configured": True,
            "is_mock": not is_live_connected,
            "missing_credentials": [] if is_live_connected else ["VALID_PAYPAL_SANDBOX_SECRET"],
            "client_id_prefix": client_prefix,
            "source": "paypal_sandbox_api" if is_live_connected else "simulated_sandbox_fallback",
            "permissions": ["Create Orders", "Capture Payments", "Read Transactions"]
        }

    async def get_access_token(self) -> Dict[str, Any]:
        """
        Server-side OAuth 2.0 Client Credentials Grant.
        Calls official PayPal Sandbox endpoint: POST https://api-m.sandbox.paypal.com/v1/oauth2/token
        """
        auth_header = self._get_auth_header()
        if not auth_header:
            return {
                "access_token": None,
                "error": "PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET not configured in backend/.env",
                "is_mock": True,
                "source": "simulated_sandbox_fallback"
            }

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/v1/oauth2/token",
                    data={"grant_type": "client_credentials"},
                    headers=auth_header
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "access_token": data.get("access_token"),
                        "token_type": data.get("token_type", "Bearer"),
                        "expires_in": data.get("expires_in", 32400),
                        "is_mock": False,
                        "source": "paypal_sandbox_api"
                    }
                else:
                    return {
                        "access_token": None,
                        "error": f"PayPal OAuth rejected with status {response.status_code}",
                        "is_mock": True,
                        "source": "simulated_sandbox_fallback"
                    }
            except Exception as e:
                return {
                    "access_token": None,
                    "error": str(e),
                    "is_mock": True,
                    "source": "simulated_sandbox_fallback"
                }

    async def create_order(
        self,
        amount: float,
        currency: str = "USD",
        description: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Creates an official v2 Checkout Order in PayPal Sandbox:
        POST https://api-m.sandbox.paypal.com/v2/checkout/orders
        """
        token_info = await self.get_access_token()
        access_token = token_info.get("access_token")

        # Genuine PayPal Sandbox API Call if authenticated
        if access_token and not token_info.get("is_mock"):
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}"
            }
            payload = {
                "intent": "CAPTURE",
                "purchase_units": [
                    {
                        "amount": {
                            "currency_code": currency,
                            "value": f"{amount:.2f}"
                        },
                        "description": description or "PayPal ResolveAI Resolution Order"
                    }
                ],
                "application_context": {
                    "return_url": "http://localhost:5173/?paypal_order=success",
                    "cancel_url": "http://localhost:5173/?paypal_order=cancel"
                }
            }

            async with httpx.AsyncClient(timeout=12.0) as client:
                try:
                    resp = await client.post(f"{self.base_url}/v2/checkout/orders", json=payload, headers=headers)
                    if resp.status_code in [200, 201]:
                        data = resp.json()
                        approval_link = next(
                            (link["href"] for link in data.get("links", []) if link.get("rel") == "approve"),
                            None
                        )
                        return {
                            "id": data.get("id"),
                            "status": data.get("status", "CREATED"),
                            "approval_url": approval_link,
                            "is_mock": False,
                            "source": "paypal_sandbox_api",
                            "environment": "sandbox"
                        }
                except Exception:
                    pass

        # Explicit Mock Fallback (Credentials Missing or Test Environment)
        import uuid
        fallback_id = "MOCK-ORD-" + str(uuid.uuid4())[:8].upper()
        return {
            "id": fallback_id,
            "status": "MOCK_FALLBACK",
            "approval_url": f"https://www.sandbox.paypal.com/checkoutnow?token={fallback_id}",
            "is_mock": True,
            "source": "simulated_sandbox_fallback",
            "environment": "sandbox"
        }

    async def get_order(self, order_id: str) -> Dict[str, Any]:
        """
        Retrieves order details from PayPal Sandbox:
        GET https://api-m.sandbox.paypal.com/v2/checkout/orders/{id}
        """
        token_info = await self.get_access_token()
        access_token = token_info.get("access_token")

        if access_token and not token_info.get("is_mock") and not order_id.startswith("MOCK-"):
            headers = {
                "Authorization": f"Bearer {access_token}"
            }
            async with httpx.AsyncClient(timeout=12.0) as client:
                try:
                    resp = await client.get(f"{self.base_url}/v2/checkout/orders/{order_id}", headers=headers)
                    if resp.status_code == 200:
                        data = resp.json()
                        pu = data.get("purchase_units", [{}])[0]
                        amount_val = float(pu.get("amount", {}).get("value", 0.0))
                        currency = pu.get("amount", {}).get("currency_code", "USD")
                        approval_link = next(
                            (link["href"] for link in data.get("links", []) if link.get("rel") == "approve"),
                            None
                        )
                        return {
                            "id": data.get("id", order_id),
                            "status": data.get("status", "CREATED"),
                            "amount": amount_val,
                            "currency": currency,
                            "approval_url": approval_link,
                            "payer_email": data.get("payer", {}).get("email_address"),
                            "create_time": data.get("create_time"),
                            "is_mock": False,
                            "source": "paypal_sandbox_api",
                            "environment": "sandbox"
                        }
                except Exception:
                    pass

        return {
            "id": order_id,
            "status": "MOCK_FALLBACK",
            "amount": 49.99,
            "currency": "USD",
            "approval_url": f"https://www.sandbox.paypal.com/checkoutnow?token={order_id}",
            "payer_email": "demo.user@example.com",
            "create_time": None,
            "is_mock": True,
            "source": "simulated_sandbox_fallback",
            "environment": "sandbox"
        }

    async def capture_order(self, order_id: str) -> Dict[str, Any]:
        """
        Captures authorized payment in PayPal Sandbox:
        POST https://api-m.sandbox.paypal.com/v2/checkout/orders/{id}/capture
        """
        token_info = await self.get_access_token()
        access_token = token_info.get("access_token")

        # Real PayPal Sandbox Capture if authenticated and not a mock ID
        if access_token and not token_info.get("is_mock") and not order_id.startswith("MOCK-"):
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}"
            }

            async with httpx.AsyncClient(timeout=12.0) as client:
                try:
                    resp = await client.post(f"{self.base_url}/v2/checkout/orders/{order_id}/capture", headers=headers)
                    if resp.status_code in [200, 201]:
                        data = resp.json()
                        captures = (
                            data.get("purchase_units", [{}])[0]
                            .get("payments", {})
                            .get("captures", [{}])
                        )
                        capture_id = captures[0].get("id", order_id)
                        capture_amount = float(captures[0].get("amount", {}).get("value", 49.99))
                        return {
                            "capture_id": capture_id,
                            "status": data.get("status", "COMPLETED"),
                            "amount": capture_amount,
                            "is_mock": False,
                            "source": "paypal_sandbox_api",
                            "environment": "sandbox",
                            "error_detail": None
                        }
                    else:
                        # Genuine PayPal Sandbox API error response (e.g. 422 ORDER_NOT_APPROVED)
                        try:
                            err_data = resp.json()
                            issue = err_data.get("name", f"HTTP_{resp.status_code}")
                            desc = err_data.get("message", "PayPal capture rejected")
                            if "details" in err_data and len(err_data["details"]) > 0:
                                issue = err_data["details"][0].get("issue", issue)
                                desc = err_data["details"][0].get("description", desc)
                            return {
                                "capture_id": order_id,
                                "status": issue,
                                "amount": 0.0,
                                "is_mock": False,
                                "source": "paypal_sandbox_api",
                                "environment": "sandbox",
                                "error_detail": desc
                            }
                        except Exception:
                            return {
                                "capture_id": order_id,
                                "status": f"HTTP_{resp.status_code}",
                                "amount": 0.0,
                                "is_mock": False,
                                "source": "paypal_sandbox_api",
                                "environment": "sandbox",
                                "error_detail": resp.text
                            }
                except Exception as exc:
                    return {
                        "capture_id": order_id,
                        "status": "NETWORK_ERROR",
                        "amount": 0.0,
                        "is_mock": False,
                        "source": "paypal_sandbox_api",
                        "environment": "sandbox",
                        "error_detail": str(exc)
                    }

        # Explicit Mock Fallback ONLY when unauthenticated or mock ID
        import uuid
        return {
            "capture_id": "MOCK-CAP-" + str(uuid.uuid4())[:8].upper(),
            "status": "MOCK_FALLBACK",
            "amount": 49.99,
            "is_mock": True,
            "source": "simulated_sandbox_fallback",
            "environment": "sandbox",
            "error_detail": "Using simulated sandbox fallback because PayPal credentials are not configured or order is mock."
        }

paypal_service = PayPalService()
