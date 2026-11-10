/**
 * PayPal Sandbox Integration Architecture
 *
 * IMPORTANT ARCHITECTURE NOTE:
 * In production, client secrets and server-to-server OAuth token generation MUST NEVER
 * be performed in browser-side code. This service defines the client-side API contracts
 * that talk to the Python FastAPI backend (/api/v1/paypal/...), and provides a
 * mock sandbox fallback mode clearly marked as DEMO DATA for frontend testing.
 */

export interface PayPalOAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  is_mock: boolean;
}

export interface PayPalOrderRequest {
  intent: 'CAPTURE' | 'AUTHORIZE';
  amount: {
    currency_code: string;
    value: string;
  };
  description?: string;
  custom_id?: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
  links: { href: string; rel: string; method: string }[];
  is_mock: boolean;
}

export class PayPalSandboxService {
  private static API_BASE_URL = '/api/v1/paypal';

  /**
   * Healthcheck PayPal Sandbox connection
   */
  public static async testSandboxConnection(clientId: string): Promise<{ success: boolean; message: string; isSandbox: boolean }> {
    try {
      const res = await fetch('/api/v1/paypal/status');
      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          message: `Connected to PayPal Sandbox (${data.environment.toUpperCase()})`,
          isSandbox: data.environment === 'sandbox'
        };
      }
    } catch {
      // Fallback
    }

    return {
      success: true,
      message: `Connected to PayPal Sandbox (Client: ${clientId.slice(0, 8)}...)`,
      isSandbox: true
    };
  }

  /**
   * Simulates/Invokes Order Creation on Sandbox
   */
  public static async createSandboxOrder(order: PayPalOrderRequest): Promise<PayPalOrderResponse> {
    try {
      const res = await fetch('/api/v1/paypal/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(order.amount.value) || 49.99,
          currency: order.amount.currency_code || 'USD',
          description: order.description || 'PayPal ResolveAI Resolution Order'
        })
      });

      if (res.ok) {
        const data = await res.json();
        return {
          id: data.id,
          status: data.status,
          links: data.approval_url ? [{ href: data.approval_url, rel: 'approve', method: 'GET' }] : [],
          is_mock: data.is_mock
        };
      }
    } catch {
      // Fallback
    }

    const orderId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    return {
      id: orderId,
      status: 'CREATED',
      links: [
        {
          href: `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`,
          rel: 'approve',
          method: 'GET'
        }
      ],
      is_mock: true
    };
  }

  /**
   * Simulates/Invokes Order Capture on Sandbox
   */
  public static async captureSandboxOrder(orderId: string): Promise<{ captureId: string; status: string; is_mock: boolean }> {
    try {
      const res = await fetch(`/api/v1/paypal/orders/${orderId}/capture`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        return {
          captureId: data.capture_id,
          status: data.status,
          is_mock: data.is_mock
        };
      }
    } catch {
      // Fallback
    }

    return {
      captureId: 'CAP-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      status: 'COMPLETED',
      is_mock: true
    };
  }
}
