// Payment utilities for frontend operations
import { projectId, publicAnonKey } from '/utils/supabase/info';

export interface PaymentResponse {
  success?: boolean;
  error?: string;
  code?: string;
  payment?: any;
  clientSecret?: string;
  paymentIntentId?: string;
}

// Create Stripe payment intent
export async function createStripePaymentIntent(
  amount: number,
  metadata?: Record<string, any>
): Promise<PaymentResponse> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/stripe/create-intent`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'USD',
          metadata,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to create payment intent' };
    }

    return await response.json();
  } catch (error) {
    return { error: 'Network error. Please try again.' };
  }
}

// Submit payment
export async function submitPayment(
  userId: string,
  userName: string,
  userEmail: string,
  items: any[],
  total: number,
  paymentMethod: 'stripe' | 'airtel' = 'stripe',
  additionalData?: Record<string, any>
): Promise<PaymentResponse> {
  try {
    if (paymentMethod === 'stripe' && additionalData?.stripePaymentIntentId) {
      // For Stripe, send as JSON
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/submit`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            userName,
            userEmail,
            items: JSON.stringify(items),
            total,
            paymentMethod: 'stripe',
            stripePaymentIntentId: additionalData.stripePaymentIntentId,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return { error: error.error || 'Payment submission failed', code: error.code };
      }

      return await response.json();
    } else if (paymentMethod === 'airtel' && additionalData?.proofFile && additionalData?.transactionId) {
      // For Airtel, send as FormData
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('userName', userName);
      formData.append('userEmail', userEmail);
      formData.append('items', JSON.stringify(items));
      formData.append('total', total.toString());
      formData.append('paymentMethod', 'airtel');
      formData.append('transactionId', additionalData.transactionId);
      formData.append('proof', additionalData.proofFile);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/submit`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${publicAnonKey}` },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return { error: error.error || 'Payment submission failed', code: error.code };
      }

      return await response.json();
    } else {
      return { error: 'Invalid payment method or missing data' };
    }
  } catch (error) {
    console.error('Payment submission error:', error);
    return { error: 'Network error. Please try again.' };
  }
}

// Get payment status
export async function getPaymentStatus(paymentIntentId: string): Promise<any> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/stripe/status/${paymentIntentId}`,
      {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return null;
  }
}

// Get user payment history
export async function getUserPaymentHistory(userId: string): Promise<any[]> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch payment history');
    }

    const data = await response.json();
    return data.payments || [];
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return [];
  }
}

// Get user receipts
export async function getUserReceipts(userId: string): Promise<any[]> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/receipts/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch receipts');
    }

    const data = await response.json();
    return data.receipts || [];
  } catch (error) {
    console.error('Error fetching receipts:', error);
    return [];
  }
}

// Process payment approval (admin only)
export async function approvePayment(
  paymentId: string,
  adminToken: string
): Promise<PaymentResponse> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/admin/process-approval`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'accept',
          paymentId,
          requestType: 'payment',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Approval failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Approval error:', error);
    return { error: 'Network error' };
  }
}

// Process payment rejection (admin only)
export async function rejectPayment(
  paymentId: string,
  reason: string,
  adminToken: string
): Promise<PaymentResponse> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/admin/process-approval`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          paymentId,
          requestType: 'payment',
          reason,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Rejection failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Rejection error:', error);
    return { error: 'Network error' };
  }
}

// Process refund (admin only)
export async function refundPayment(
  paymentIntentId: string,
  amount?: number,
  paymentId?: string,
  adminToken?: string
): Promise<PaymentResponse> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/refund`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken || publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          amount,
          paymentId,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Refund failed' };
    }

    return await response.json();
  } catch (error) {
    console.error('Refund error:', error);
    return { error: 'Network error' };
  }
}

// Format currency
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Get payment status label
export function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    stripe_verified: 'Verified',
    refunded: 'Refunded',
  };
  return labels[status] || status;
}

// Get payment status color
export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-900/30 text-yellow-200 border-yellow-500',
    approved: 'bg-green-900/30 text-green-200 border-green-500',
    rejected: 'bg-red-900/30 text-red-200 border-red-500',
    stripe_verified: 'bg-blue-900/30 text-blue-200 border-blue-500',
    refunded: 'bg-purple-900/30 text-purple-200 border-purple-500',
  };
  return colors[status] || 'bg-gray-900/30 text-gray-200 border-gray-500';
}
