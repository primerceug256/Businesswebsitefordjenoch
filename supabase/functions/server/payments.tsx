import * as kv from "./kv_store.tsx";

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  items: string;
  total: number;
  transactionId: string;
  proofUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export async function submitPayment(
  userId: string,
  userName: string,
  items: string,
  total: number,
  transactionId: string,
  proofUrl?: string
): Promise<Payment> {
  const paymentId = `payment-${Date.now()}`;

  const payment: Payment = {
    id: paymentId,
    userId,
    userName,
    items,
    total,
    transactionId,
    proofUrl,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  await kv.set(`payment:${paymentId}`, payment);
  await kv.set(`payment:pending:${paymentId}`, paymentId);

  return payment;
}

export async function approvePayment(paymentId: string): Promise<void> {
  const payment = await kv.get(`payment:${paymentId}`) as Payment;
  if (!payment) {
    throw new Error('Payment not found');
  }

  payment.status = 'approved';
  await kv.set(`payment:${paymentId}`, payment);
  await kv.del(`payment:pending:${paymentId}`);
}

export async function rejectPayment(paymentId: string): Promise<void> {
  const payment = await kv.get(`payment:${paymentId}`) as Payment;
  if (!payment) {
    throw new Error('Payment not found');
  }

  payment.status = 'rejected';
  await kv.set(`payment:${paymentId}`, payment);
  await kv.del(`payment:pending:${paymentId}`);
}

export async function getPendingPayments(): Promise<Payment[]> {
  const pending = await kv.getByPrefix('payment:pending:');
  const payments: Payment[] = [];

  for (const paymentId of pending) {
    const payment = await kv.get(`payment:${paymentId}`) as Payment;
    if (payment) {
      payments.push(payment);
    }
  }

  return payments;
}
