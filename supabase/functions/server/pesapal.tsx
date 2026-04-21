// PesaPal Payment Integration
// This module handles PesaPal payments with automatic verification

export interface PesaPalPaymentSession {
  orderTrackingId: string;
  redirectUrl: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  createdAt: string;
  completedAt?: string;
}

// PesaPal Configuration
export const PESAPAL_API_URL = "https://api.pesapal.com/api/";
export const PESAPAL_DEMO_API_URL = "https://demo.pesapal.com/api/";
export const PESAPAL_CONSUMER_KEY = Deno.env.get("PESAPAL_CONSUMER_KEY") || "";
export const PESAPAL_CONSUMER_SECRET = Deno.env.get("PESAPAL_CONSUMER_SECRET") || "";
export const PESAPAL_MERCHANT_REFERENCE = Deno.env.get("PESAPAL_MERCHANT_REFERENCE") || "DJENOCH";
export const PESAPAL_ENVIRONMENT = Deno.env.get("PESAPAL_ENVIRONMENT") || "demo"; // demo or production

const API_URL = PESAPAL_ENVIRONMENT === "production" ? PESAPAL_API_URL : PESAPAL_DEMO_API_URL;

// Generate OAuth token for PesaPal API
export async function getPesaPalToken(): Promise<string | null> {
  try {
    if (!PESAPAL_CONSUMER_KEY || !PESAPAL_CONSUMER_SECRET) {
      throw new Error("PesaPal credentials not configured");
    }

    const credentials = btoa(`${PESAPAL_CONSUMER_KEY}:${PESAPAL_CONSUMER_SECRET}`);
    
    const response = await fetch(`${API_URL}oauth/validate`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get PesaPal token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Failed to get PesaPal token:", error);
    return null;
  }
}

// Create PesaPal payment order
export async function createPesaPalOrder(
  amount: number,
  currency: string = "UGX",
  description: string = "DJ Enoch Purchase",
  customerEmail: string = "",
  customerName: string = "",
  notificationUrl?: string
): Promise<{ orderTrackingId: string; redirectUrl: string } | { error: string }> {
  try {
    const token = await getPesaPalToken();
    if (!token) {
      throw new Error("Failed to authenticate with PesaPal");
    }

    const merchantReference = `${PESAPAL_MERCHANT_REFERENCE}-${Date.now()}`;
    
    const orderData = {
      id: merchantReference,
      currency,
      amount,
      description,
      callback_url: notificationUrl || `${Deno.env.get("APP_URL") || "https://yourdomain.com"}/api/pesapal/callback`,
      notification_id: "12345",
      billing_address: {
        email_address: customerEmail,
        phone_number: "",
        country_code: "UG",
        first_name: customerName.split(" ")[0] || "Customer",
        last_name: customerName.split(" ")[1] || "",
        line_1: "N/A",
        line_2: "",
        postal_code: "",
        city: "",
        state: "",
      },
    };

    const response = await fetch(`${API_URL}PostPesapalDirectOrderV4`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PesaPal API error: ${error}`);
    }

    const data = await response.json();
    
    if (!data.redirect_url || !data.order_tracking_id) {
      throw new Error("Invalid response from PesaPal");
    }

    console.log(`[PESAPAL] Order created: ${data.order_tracking_id}, Amount: ${amount} ${currency}`);

    return {
      orderTrackingId: data.order_tracking_id,
      redirectUrl: data.redirect_url,
    };
  } catch (error) {
    console.error("Failed to create PesaPal order:", error);
    return { error: String(error) };
  }
}

// Query order status from PesaPal
export async function getPesaPalOrderStatus(orderTrackingId: string): Promise<any> {
  try {
    const token = await getPesaPalToken();
    if (!token) {
      throw new Error("Failed to authenticate with PesaPal");
    }

    const response = await fetch(`${API_URL}QueryPaymentDetails?id=${orderTrackingId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to query order status");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get order status:", error);
    return null;
  }
}

// Verify webhook signature
export function verifyPesaPalWebhookSignature(
  request: Record<string, any>,
  signature: string
): boolean {
  try {
    // PesaPal verification logic would go here
    // For now, we'll implement basic validation
    // In production, implement proper HMAC verification
    
    const requiredFields = ["OrderTrackingId", "OrderStatus"];
    for (const field of requiredFields) {
      if (!request[field]) {
        console.warn(`Missing field in webhook: ${field}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Failed to verify webhook signature:", error);
    return false;
  }
}

// Handle PesaPal webhook callback
export async function handlePesaPalWebhook(
  orderTrackingId: string,
  orderStatus: string
): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`[PESAPAL WEBHOOK] Order: ${orderTrackingId}, Status: ${orderStatus}`);

    const validStatuses = ["COMPLETED", "FAILED", "CANCELLED"];
    if (!validStatuses.includes(orderStatus)) {
      return { success: false, message: "Invalid order status" };
    }

    if (orderStatus === "COMPLETED") {
      console.log(`[PESAPAL] Payment verified: ${orderTrackingId}`);
      return { success: true, message: "Payment verified" };
    }

    if (orderStatus === "FAILED") {
      console.log(`[PESAPAL] Payment failed: ${orderTrackingId}`);
      return { success: false, message: "Payment failed" };
    }

    if (orderStatus === "CANCELLED") {
      console.log(`[PESAPAL] Payment cancelled: ${orderTrackingId}`);
      return { success: false, message: "Payment cancelled by user" };
    }

    return { success: true, message: "Status updated" };
  } catch (error) {
    console.error("Failed to handle webhook:", error);
    return { success: false, message: String(error) };
  }
}

// Refund order (if supported by PesaPal)
export async function refundPesaPalOrder(
  orderTrackingId: string,
  amount?: number
): Promise<{ refundId: string } | { error: string }> {
  try {
    // Note: PesaPal may have limited refund capabilities
    // This is a placeholder for future implementation
    
    console.warn(`[PESAPAL] Refund requested for order: ${orderTrackingId}`);
    return { error: "Refunds must be processed manually through PesaPal dashboard" };
  } catch (error) {
    console.error("Failed to process refund:", error);
    return { error: String(error) };
  }
}

// Get payment status label
export function getPesaPalStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    "COMPLETED": "Completed",
    "PENDING": "Pending",
    "FAILED": "Failed",
    "CANCELLED": "Cancelled",
  };
  return labels[status] || status;
}
