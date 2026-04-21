import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
<<<<<<< HEAD
import * as payments from "./payments.tsx";
import * as email from "./email.tsx";
import * as receipts from "./receipts.tsx";
import * as pesapal from "./pesapal.tsx";
=======
import * as pesapal from "./pesapal_logic.tsx";
>>>>>>> fde0bbd30f7a22cb23b31404af6ffce6070014f9

const app = new Hono();
app.use("*", cors());

// 1. START PESAPAL PAYMENT
app.post("/make-server-98d801c7/payments/initiate-pesapal", async (c) => {
  try {
<<<<<<< HEAD
    const fd = await c.req.formData();
    const userId = fd.get("userId") as string;
    const userName = fd.get("userName") as string;
    const userEmail = fd.get("userEmail") as string;
    const items = fd.get("items") as string;
    const total = parseFloat(fd.get("total") as string);
    const transactionId = fd.get("transactionId") as string || "";
    const paymentMethod = (fd.get("paymentMethod") as string) || "airtel";
    const stripePaymentIntentId = fd.get("stripePaymentIntentId") as string || undefined;

    // Validate input
    const validation = payments.validatePaymentInput(userId, userName, items, total, transactionId, paymentMethod);
    if (!validation.valid) {
      return c.json({ error: validation.error, code: 'VALIDATION_ERROR' }, 400);
    }

    // Check rate limiting
    if (!payments.checkRateLimit(userId)) {
      return c.json({ error: 'Too many requests. Please wait before trying again.', code: 'RATE_LIMIT_EXCEEDED' }, 429);
    }

    // Upload proof for Airtel payments
    let proofUrl: string | undefined;
    if (paymentMethod === 'airtel') {
      const proof = fd.get("proof") as File;
      if (!proof) {
        return c.json({ error: 'Proof file is required for Airtel Money payments', code: 'MISSING_PROOF' }, 400);
      }
      const uploadRes = await music.uploadMusicFile(`proofs/${Date.now()}`, await proof.arrayBuffer(), proof.type);
      proofUrl = uploadRes.publicUrl;
    }

    // Submit payment
    const payment = await payments.submitPayment(
      userId,
      userName,
      items,
      total,
      transactionId,
      proofUrl,
      fd.get("userCode") as string || undefined,
      userEmail,
      paymentMethod as any,
      stripePaymentIntentId
    );

    if ('error' in payment) {
      return c.json(payment, 400);
    }

    // Send confirmation email
    await email.sendPaymentSubmittedEmail(userEmail, userName, payment.id, total, paymentMethod);

    // Create receipt for automatic payments (Stripe)
    if (paymentMethod === 'stripe' && stripePaymentIntentId) {
      const receipt = await receipts.createReceipt(
        payment.id,
        userId,
        items,
        total,
        userName,
        userEmail
      );
      if (receipt) {
        payment.receipt = { id: receipt.id };
      }
    }

    return c.json({ success: true, payment });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[PAYMENT ERROR]', errorMessage);
    return c.json({ 
      error: 'Failed to process payment. Please try again.',
      code: 'INTERNAL_ERROR',
      details: errorMessage 
    }, 500);
  }
=======
    const { orderId, total, email, name, items, userId } = await c.req.json();
    const token = await pesapal.getPesapalToken();
    const ipnId = await pesapal.registerIPN(token);
    
    const orderRequest = await pesapal.createPesapalOrder(token, ipnId, { orderId, total, email, name });

    // Save pending order
    await kv.set(`order:${orderId}`, { id: orderId, userId, items, total, status: "pending", createdAt: new Date().toISOString() });
    
    return c.json({ redirect_url: orderRequest.redirect_url });
  } catch (e) { return c.json({ error: String(e) }, 500); }
>>>>>>> fde0bbd30f7a22cb23b31404af6ffce6070014f9
});

// 2. PESAPAL IPN (AUTOMATIC VERIFICATION)
app.get("/make-server-98d801c7/payments/pesapal-ipn", async (c) => {
  const trackingId = c.req.query("OrderTrackingId");
  const reference = c.req.query("OrderMerchantReference");

<<<<<<< HEAD
app.post("/make-98d801c7-music/admin/process-approval", async (c) => {
  try {
    const body = await c.req.json();
    const { action, paymentId, requestType, dropId, reason } = body as any;
=======
  if (trackingId && reference) {
    const token = await pesapal.getPesapalToken();
    const res = await fetch(`https://cybil.pesapal.com/api/Transactions/GetTransactionStatus?orderTrackingId=${trackingId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
>>>>>>> fde0bbd30f7a22cb23b31404af6ffce6070014f9

    if (data.payment_status_description === "Completed") {
        const order = await kv.get(`order:${reference}`);
        if (order) {
            order.status = "completed";
            await kv.set(`order:${reference}`, order);
            // Auto-unlock software/music downloads here
        }
    }
<<<<<<< HEAD

    if (requestType === 'payment') {
      const payment = await kv.get(`payment:${paymentId}`) as any;
      if (!payment) return c.json({ error: 'Payment not found' }, 404);

      if (action === 'accept') {
        await payments.approvePayment(paymentId);
        
        // Send approval email
        if (payment.userEmail) {
          await email.sendPaymentApprovedEmail(
            payment.userEmail,
            payment.userName,
            paymentId,
            payment.items,
            payment.total
          );
        }

        // Create receipt
        if (payment.items && payment.total) {
          await receipts.createReceipt(
            paymentId,
            payment.userId,
            payment.items,
            payment.total,
            payment.userName,
            payment.userEmail || ''
          );
        }
      } else {
        await payments.rejectPayment(paymentId, reason);
        
        // Send rejection email
        if (payment.userEmail) {
          await email.sendPaymentRejectedEmail(
            payment.userEmail,
            payment.userName,
            paymentId,
            reason
          );
        }
      }

      return c.json({ success: true });
    }

    if (action === 'accept') {
      await payments.approvePayment(paymentId);
    } else {
      await payments.rejectPayment(paymentId, reason);
    }
    return c.json({ success: true });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[APPROVAL ERROR]', errorMessage);
    return c.json({ error: "Approval processing failed", details: errorMessage }, 500);
  }
});

// ==================== PESAPAL PAYMENT INTEGRATION ====================
app.post("/make-98d801c7-music/payments/pesapal/create-order", async (c) => {
  try {
    const body = await c.req.json();
    const { amount, currency = "UGX", description, customerEmail, customerName, items } = body;

    if (!amount || amount <= 0) {
      return c.json({ error: "Invalid amount" }, 400);
    }

    const result = await pesapal.createPesaPalOrder(
      amount,
      currency,
      description || "DJ Enoch Purchase",
      customerEmail,
      customerName
    );
    
    if ('error' in result) {
      return c.json({ error: result.error }, 400);
    }

    // Store order tracking for later verification
    if ('orderTrackingId' in result) {
      const orderData = {
        orderTrackingId: result.orderTrackingId,
        userId: body.userId,
        amount,
        currency,
        items,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      await kv.set(`pesapal:order:${result.orderTrackingId}`, orderData);
    }

    return c.json(result);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[PESAPAL ERROR]', errorMessage);
    return c.json({ error: "Failed to create order", details: errorMessage }, 500);
  }
});

app.get("/make-98d801c7-music/payments/pesapal/status/:orderTrackingId", async (c) => {
  try {
    const orderTrackingId = c.req.param("orderTrackingId");
    const result = await pesapal.getPesaPalOrderStatus(orderTrackingId);
    
    if (!result) {
      return c.json({ error: "Failed to get order status" }, 400);
    }

    return c.json(result);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[PESAPAL STATUS ERROR]', errorMessage);
    return c.json({ error: "Failed to get payment status", details: errorMessage }, 500);
  }
});

app.post("/make-98d801c7-music/payments/pesapal/callback", async (c) => {
  try {
    const body = await c.req.json();
    const { OrderTrackingId, OrderStatus } = body;

    if (!OrderTrackingId) {
      return c.json({ error: "Missing order tracking ID" }, 400);
    }

    // Verify webhook
    if (!pesapal.verifyPesaPalWebhookSignature(body, c.req.header("signature") || "")) {
      console.warn('[PESAPAL] Webhook verification failed');
      // Continue anyway - PesaPal webhooks may not always have proper signatures
    }

    // Handle callback
    const result = await pesapal.handlePesaPalWebhook(OrderTrackingId, OrderStatus);

    if (result.success && OrderStatus === "COMPLETED") {
      // Get order data
      const orderData = await kv.get(`pesapal:order:${OrderTrackingId}`) as any;
      if (orderData) {
        // Create payment record
        const paymentId = `payment-${Date.now()}`;
        const payment = {
          id: paymentId,
          userId: orderData.userId,
          userName: '',
          userEmail: '',
          items: JSON.stringify(orderData.items || []),
          total: orderData.amount,
          paymentMethod: 'pesapal',
          orderTrackingId: OrderTrackingId,
          status: 'stripe_verified', // Marked as verified since PesaPal already processed
          createdAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
        };
        
        await kv.set(`payment:${paymentId}`, payment);
        await kv.set(`payment:approved:${paymentId}`, paymentId);
        
        // Update order status
        orderData.status = 'completed';
        await kv.set(`pesapal:order:${OrderTrackingId}`, orderData);
        
        console.log(`[PESAPAL] Payment verified: ${OrderTrackingId}`);
      }
    }

    return c.json({ success: true });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[PESAPAL CALLBACK ERROR]', errorMessage);
    return c.json({ error: "Callback processing failed", details: errorMessage }, 500);
  }
});

app.post("/make-98d801c7-music/payments/pesapal/refund", async (c) => {
  try {
    const body = await c.req.json();
    const { orderTrackingId, paymentId } = body;

    if (!orderTrackingId) {
      return c.json({ error: "Order tracking ID is required" }, 400);
    }

    const result = await pesapal.refundPesaPalOrder(orderTrackingId);
    
    if ('error' in result) {
      return c.json({ error: result.error }, 400);
    }

    // Update payment status if refund successful
    if (paymentId) {
      const payment = await kv.get(`payment:${paymentId}`) as any;
      if (payment) {
        payment.status = 'refunded';
        await kv.set(`payment:${paymentId}`, payment);
      }
    }

    return c.json(result);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[PESAPAL REFUND ERROR]', errorMessage);
    return c.json({ error: "Failed to process refund", details: errorMessage }, 500);
  }
});

// ==================== PAYMENT HISTORY & RECEIPTS ====================
app.get("/make-98d801c7-music/payments/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const paymentHistory = await payments.getPaymentHistory(userId);
    return c.json({ payments: paymentHistory });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[PAYMENT HISTORY ERROR]', errorMessage);
    return c.json({ error: "Failed to fetch payment history", details: errorMessage }, 500);
  }
});

app.get("/make-98d801c7-music/receipts/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userReceipts = await receipts.getUserReceipts(userId);
    return c.json({ receipts: userReceipts });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[RECEIPTS ERROR]', errorMessage);
    return c.json({ error: "Failed to fetch receipts", details: errorMessage }, 500);
  }
});

app.get("/make-98d801c7-music/receipts/:receiptId", async (c) => {
  try {
    const receiptId = c.req.param("receiptId");
    const receipt = await kv.get(`receipt:${receiptId}`);
    
    if (!receipt) {
      return c.json({ error: "Receipt not found" }, 404);
    }

    return c.json(receipt);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[RECEIPT FETCH ERROR]', errorMessage);
    return c.json({ error: "Failed to fetch receipt", details: errorMessage }, 500);
=======
>>>>>>> fde0bbd30f7a22cb23b31404af6ffce6070014f9
  }
  return c.json({ status: "ok" });
});

// MUSIC TRACKS LIST
app.get("/make-server-98d801c7/music/tracks", async (c) => c.json({ tracks: await kv.getByPrefix("track:") }));

// MOVIE LIST
app.get("/make-server-98d801c7/movies/list", async (c) => c.json({ movies: await kv.getByPrefix("movie:") }));

// SOFTWARE LIST
app.get("/make-server-98d801c7/software/list", async (c) => c.json({ software: await kv.getByPrefix("software:") }));

Deno.serve(app.fetch);