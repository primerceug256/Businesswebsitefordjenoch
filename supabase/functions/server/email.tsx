import * as kv from "./kv_store.tsx";

export interface EmailNotification {
  id: string;
  toEmail: string;
  subject: string;
  type: 'payment_submitted' | 'payment_approved' | 'payment_rejected' | 'receipt' | 'stripe_receipt';
  data: Record<string, any>;
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
}

// Placeholder function - integrate with SendGrid, Resend, or similar
export async function sendPaymentApprovedEmail(
  userEmail: string,
  userName: string,
  paymentId: string,
  items: string,
  total: number,
  downloadUrl?: string
): Promise<boolean> {
  try {
    const emailNotif: EmailNotification = {
      id: `email-${Date.now()}`,
      toEmail: userEmail,
      subject: 'Payment Approved - DJ Enoch',
      type: 'payment_approved',
      data: {
        userName,
        paymentId,
        items: JSON.parse(items),
        total,
        downloadUrl,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`email:${emailNotif.id}`, emailNotif);
    console.log(`[EMAIL QUEUED] Payment approved notification for ${userEmail}`);
    
    // TODO: Integrate with actual email provider
    // const result = await sendEmailViaProvider(emailNotif);
    // if (result.success) {
    //   emailNotif.status = 'sent';
    //   await kv.set(`email:${emailNotif.id}`, emailNotif);
    // }

    return true;
  } catch (error) {
    console.error('Failed to queue payment approval email:', error);
    return false;
  }
}

export async function sendPaymentRejectedEmail(
  userEmail: string,
  userName: string,
  paymentId: string,
  reason?: string
): Promise<boolean> {
  try {
    const emailNotif: EmailNotification = {
      id: `email-${Date.now()}`,
      toEmail: userEmail,
      subject: 'Payment Status Update - DJ Enoch',
      type: 'payment_rejected',
      data: {
        userName,
        paymentId,
        reason: reason || 'Payment was not verified',
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`email:${emailNotif.id}`, emailNotif);
    console.log(`[EMAIL QUEUED] Payment rejected notification for ${userEmail}`);
    
    return true;
  } catch (error) {
    console.error('Failed to queue payment rejection email:', error);
    return false;
  }
}

export async function sendPaymentSubmittedEmail(
  userEmail: string,
  userName: string,
  paymentId: string,
  total: number,
  paymentMethod: string
): Promise<boolean> {
  try {
    const emailNotif: EmailNotification = {
      id: `email-${Date.now()}`,
      toEmail: userEmail,
      subject: 'Payment Received - DJ Enoch',
      type: 'payment_submitted',
      data: {
        userName,
        paymentId,
        total,
        paymentMethod,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`email:${emailNotif.id}`, emailNotif);
    console.log(`[EMAIL QUEUED] Payment submitted confirmation for ${userEmail}`);
    
    return true;
  } catch (error) {
    console.error('Failed to queue payment submitted email:', error);
    return false;
  }
}

export async function sendReceiptEmail(
  userEmail: string,
  userName: string,
  paymentId: string,
  items: string,
  total: number,
  receiptUrl: string
): Promise<boolean> {
  try {
    const emailNotif: EmailNotification = {
      id: `email-${Date.now()}`,
      toEmail: userEmail,
      subject: 'Payment Receipt - DJ Enoch',
      type: 'receipt',
      data: {
        userName,
        paymentId,
        items: JSON.parse(items),
        total,
        receiptUrl,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`email:${emailNotif.id}`, emailNotif);
    console.log(`[EMAIL QUEUED] Receipt email for ${userEmail}`);
    
    return true;
  } catch (error) {
    console.error('Failed to queue receipt email:', error);
    return false;
  }
}

export async function getPendingEmails(): Promise<EmailNotification[]> {
  try {
    const emails = await kv.getByPrefix('email:');
    return emails.filter(e => e && typeof e === 'object' && e.status === 'pending') as EmailNotification[];
  } catch (error) {
    console.error('Failed to fetch pending emails:', error);
    return [];
  }
}

export async function sendRefundNotificationEmail(
  userEmail: string,
  userName: string,
  paymentId: string,
  amount: number,
  reason: string
): Promise<boolean> {
  try {
    const emailNotif: EmailNotification = {
      id: `email-${Date.now()}`,
      toEmail: userEmail,
      subject: 'Refund Processed - DJ Enoch',
      type: 'payment_rejected', // Reuse rejected type for now
      data: {
        userName,
        paymentId,
        amount,
        reason,
        refund: true,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`email:${emailNotif.id}`, emailNotif);
    console.log(`[EMAIL QUEUED] Refund notification for ${userEmail}`);
    
    return true;
  } catch (error) {
    console.error('Failed to queue refund email:', error);
    return false;
  }
}

export async function sendAdminNotificationEmail(
  subject: string,
  message: string,
  adminEmail: string = Deno.env.get("ADMIN_EMAIL") || "admin@djenoch.com"
): Promise<boolean> {
  try {
    const emailNotif: EmailNotification = {
      id: `email-${Date.now()}`,
      toEmail: adminEmail,
      subject: `[ADMIN] ${subject}`,
      type: 'payment_submitted',
      data: {
        message,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`email:${emailNotif.id}`, emailNotif);
    console.log(`[EMAIL QUEUED] Admin notification: ${subject}`);
    
    return true;
  } catch (error) {
    console.error('Failed to queue admin email:', error);
    return false;
  }
}
