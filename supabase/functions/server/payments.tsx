import * as kv from "./kv_store.tsx";

export interface Payment {
  id: string;
  userId: string;
  userCode?: string;
  userName: string;
  userEmail?: string;
  items: string;
  total: number;
  transactionId?: string;
  proofUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'stripe_verified';
  paymentMethod: 'airtel' | 'stripe' | 'paypal';
  stripePaymentIntentId?: string;
  createdAt: string;
  approvedAt?: string;
  receipt?: {
    id: string;
    downloadUrl?: string;
  };
}

export interface PaymentError {
  code: string;
  message: string;
  timestamp: string;
  userId?: string;
  details?: string;
}

// Log payment errors for debugging
export async function logPaymentError(error: PaymentError): Promise<void> {
  const errorId = `error-${Date.now()}`;
  await kv.set(`payment:error:${errorId}`, error);
  console.error(`[PAYMENT ERROR] ${error.code}: ${error.message}`, error.details);
}

// Validate payment input
export function validatePaymentInput(
  userId: string,
  userName: string,
  items: string,
  total: number,
  transactionId?: string,
  paymentMethod: string = 'airtel'
): { valid: boolean; error?: string } {
  if (!userId || userId.trim() === '') {
    return { valid: false, error: 'User ID is required' };
  }
  if (!userName || userName.trim() === '') {
    return { valid: false, error: 'User name is required' };
  }
  if (!items || items.trim() === '' || items === '[]') {
    return { valid: false, error: 'Cart is empty' };
  }
  if (typeof total !== 'number' || total <= 0) {
    return { valid: false, error: 'Invalid payment amount' };
  }
  if (total > 100000) {
    return { valid: false, error: 'Payment amount exceeds maximum limit' };
  }
  if (paymentMethod === 'airtel' && (!transactionId || transactionId.trim() === '')) {
    return { valid: false, error: 'Transaction ID is required for Airtel Money' };
  }
  return { valid: true };
}

// Rate limiting check (simple implementation)
const rateLimitStore = new Map<string, number[]>();
export function checkRateLimit(userId: string, maxRequestsPerMinute: number = 5): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  if (!rateLimitStore.has(userId)) {
    rateLimitStore.set(userId, []);
  }
  
  const userRequests = rateLimitStore.get(userId)!;
  const recentRequests = userRequests.filter(time => time > oneMinuteAgo);
  
  if (recentRequests.length >= maxRequestsPerMinute) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitStore.set(userId, recentRequests);
  return true;
}

export async function submitPayment(
  userId: string,
  userName: string,
  items: string,
  total: number,
  transactionId: string = '',
  proofUrl?: string,
  userCode?: string,
  userEmail?: string,
  paymentMethod: 'airtel' | 'stripe' | 'paypal' = 'airtel',
  stripePaymentIntentId?: string
): Promise<Payment | { error: string; code: string }> {
  try {
    // Validate input
    const validation = validatePaymentInput(userId, userName, items, total, transactionId, paymentMethod);
    if (!validation.valid) {
      const error: PaymentError = {
        code: 'VALIDATION_ERROR',
        message: validation.error || 'Validation failed',
        timestamp: new Date().toISOString(),
        userId,
      };
      await logPaymentError(error);
      return { error: validation.error || 'Validation failed', code: 'VALIDATION_ERROR' };
    }

    // Check rate limiting
    if (!checkRateLimit(userId)) {
      const error: PaymentError = {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many payment requests',
        timestamp: new Date().toISOString(),
        userId,
      };
      await logPaymentError(error);
      return { error: 'Too many requests. Please wait before trying again.', code: 'RATE_LIMIT_EXCEEDED' };
    }

    // Check for duplicate submissions (within 30 seconds)
    const recentPayments = await kv.getByPrefix(`payment:${userId}:`);
    const now = Date.now();
    for (const payment of recentPayments) {
      if (payment && typeof payment === 'object' && 'createdAt' in payment) {
        const paymentTime = new Date(payment.createdAt as string).getTime();
        if (now - paymentTime < 30000) {
          const error: PaymentError = {
            code: 'DUPLICATE_SUBMISSION',
            message: 'Duplicate payment submission detected',
            timestamp: new Date().toISOString(),
            userId,
          };
          await logPaymentError(error);
          return { error: 'Please wait before submitting another payment', code: 'DUPLICATE_SUBMISSION' };
        }
      }
    }

    const paymentId = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const payment: Payment = {
      id: paymentId,
      userId,
      userCode,
      userName,
      userEmail,
      items,
      total,
      transactionId: transactionId || undefined,
      proofUrl,
      paymentMethod,
      stripePaymentIntentId,
      status: paymentMethod === 'stripe' && stripePaymentIntentId ? 'stripe_verified' : 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`payment:${paymentId}`, payment);
    if (payment.status === 'pending') {
      await kv.set(`payment:pending:${paymentId}`, paymentId);
    } else {
      await kv.set(`payment:approved:${paymentId}`, paymentId);
    }

    console.log(`[PAYMENT SUBMITTED] ID: ${paymentId}, User: ${userId}, Amount: ${total}, Method: ${paymentMethod}`);
    return payment;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const error: PaymentError = {
      code: 'PAYMENT_SUBMISSION_ERROR',
      message: 'Failed to submit payment',
      timestamp: new Date().toISOString(),
      userId,
      details: errorMessage,
    };
    await logPaymentError(error);
    return { error: 'Failed to process payment. Please try again.', code: 'PAYMENT_SUBMISSION_ERROR' };
  }
}

export async function approvePayment(paymentId: string, notes?: string): Promise<void> {
  try {
    const payment = await kv.get(`payment:${paymentId}`) as Payment;
    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.status = 'approved';
    payment.approvedAt = new Date().toISOString();
    await kv.set(`payment:${paymentId}`, payment);
    await kv.del(`payment:pending:${paymentId}`);
    await kv.set(`payment:approved:${paymentId}`, paymentId);

    console.log(`[PAYMENT APPROVED] ID: ${paymentId}, User: ${payment.userId}, Amount: ${payment.total}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const error: PaymentError = {
      code: 'APPROVAL_ERROR',
      message: 'Failed to approve payment',
      timestamp: new Date().toISOString(),
      details: errorMessage,
    };
    await logPaymentError(error);
    throw err;
  }
}

export async function rejectPayment(paymentId: string, reason?: string): Promise<void> {
  try {
    const payment = await kv.get(`payment:${paymentId}`) as Payment;
    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.status = 'rejected';
    await kv.set(`payment:${paymentId}`, payment);
    await kv.del(`payment:pending:${paymentId}`);

    console.log(`[PAYMENT REJECTED] ID: ${paymentId}, User: ${payment.userId}, Reason: ${reason || 'No reason provided'}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const error: PaymentError = {
      code: 'REJECTION_ERROR',
      message: 'Failed to reject payment',
      timestamp: new Date().toISOString(),
      details: errorMessage,
    };
    await logPaymentError(error);
    throw err;
  }
}

export async function getPendingPayments(): Promise<Payment[]> {
  try {
    const pending = await kv.getByPrefix('payment:pending:');
    const payments: Payment[] = [];

    for (const paymentId of pending) {
      const payment = await kv.get(`payment:${paymentId}`) as Payment;
      if (payment) {
        payments.push(payment);
      }
    }

    return payments;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const error: PaymentError = {
      code: 'FETCH_PENDING_ERROR',
      message: 'Failed to fetch pending payments',
      timestamp: new Date().toISOString(),
      details: errorMessage,
    };
    await logPaymentError(error);
    return [];
  }
}

export async function getPaymentHistory(userId: string): Promise<Payment[]> {
  try {
    const userPayments = await kv.getByPrefix(`payment:${userId}:`);
    return userPayments.filter(p => p && typeof p === 'object' && 'id' in p) as Payment[];
  } catch (err) {
    console.error('Failed to fetch payment history:', err);
    return [];
  }
}
