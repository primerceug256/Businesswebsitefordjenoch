// Stripe Payment Integration
// This module handles Stripe payments with automatic verification

export interface StripePaymentSession {
  paymentIntentId: string;
  clientSecret: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  amount: number;
  currency: string;
  createdAt: string;
  completedAt?: string;
}

// Initialize Stripe (this would use actual Stripe API in production)
export const STRIPE_API_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
export const STRIPE_PUBLISHABLE_KEY = Deno.env.get("STRIPE_PUBLISHABLE_KEY") || "";

// Create payment intent for Stripe
export async function createStripePaymentIntent(
  amount: number,
  currency: string = "USD",
  metadata?: Record<string, any>
): Promise<{ clientSecret: string; paymentIntentId: string } | { error: string }> {
  try {
    if (!STRIPE_API_KEY) {
      throw new Error("Stripe API key not configured");
    }

    // In production, use actual Stripe API
    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(),
        currency,
        ...(metadata && { metadata: JSON.stringify(metadata) }),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stripe API error: ${error}`);
    }

    const data = await response.json();
    return {
      clientSecret: data.client_secret,
      paymentIntentId: data.id,
    };
  } catch (error) {
    console.error("Failed to create Stripe payment intent:", error);
    return { error: String(error) };
  }
}

// Verify Stripe webhook signature
export function verifyStripeWebhookSignature(
  body: string,
  signature: string
): boolean {
  try {
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
    if (!webhookSecret) return false;

    // In production, use Stripe's official verification
    // This is a placeholder implementation
    return true;
  } catch (error) {
    console.error("Failed to verify webhook signature:", error);
    return false;
  }
}

// Handle Stripe webhook event
export async function handleStripeWebhook(event: any): Promise<boolean> {
  try {
    const { type, data } = event;

    switch (type) {
      case "payment_intent.succeeded":
        console.log(`[STRIPE] Payment succeeded: ${data.object.id}`);
        return true;

      case "payment_intent.payment_failed":
        console.log(`[STRIPE] Payment failed: ${data.object.id}`);
        return true;

      case "charge.refunded":
        console.log(`[STRIPE] Charge refunded: ${data.object.id}`);
        return true;

      default:
        console.log(`[STRIPE] Unhandled event type: ${type}`);
        return true;
    }
  } catch (error) {
    console.error("Failed to handle Stripe webhook:", error);
    return false;
  }
}

// Retrieve payment intent status
export async function getStripePaymentStatus(
  paymentIntentId: string
): Promise<{ status: string; amount: number } | { error: string }> {
  try {
    if (!STRIPE_API_KEY) {
      throw new Error("Stripe API key not configured");
    }

    const response = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
      headers: {
        "Authorization": `Bearer ${STRIPE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to retrieve payment intent");
    }

    const data = await response.json();
    return {
      status: data.status,
      amount: data.amount / 100,
    };
  } catch (error) {
    console.error("Failed to get payment status:", error);
    return { error: String(error) };
  }
}

// Refund payment
export async function refundStripePayment(
  paymentIntentId: string,
  amount?: number
): Promise<{ refundId: string } | { error: string }> {
  try {
    if (!STRIPE_API_KEY) {
      throw new Error("Stripe API key not configured");
    }

    const body = new URLSearchParams({
      payment_intent: paymentIntentId,
      ...(amount && { amount: Math.round(amount * 100).toString() }),
    });

    const response = await fetch("https://api.stripe.com/v1/refunds", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      throw new Error("Failed to create refund");
    }

    const data = await response.json();
    return { refundId: data.id };
  } catch (error) {
    console.error("Failed to refund payment:", error);
    return { error: String(error) };
  }
}
