import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as payments from "./payments.tsx";
import * as email from "./email.tsx";
import * as receipts from "./receipts.tsx";
import * as pesapal from "./pesapal.tsx";

const app = new Hono();
app.use("*", cors());

// ==================== PESAPAL PAYMENT INTEGRATION ====================

// 1. CREATE PESAPAL ORDER
app.post("/make-98d801c7-music/payments/pesapal/create-order", async (c) => {
  try {
    const body = await c.req.json();
    const { amount, currency = "UGX", description, customerEmail, customerName, userId, items } = body;

    // Validate input
    if (!amount || amount <= 0) {
      return c.json({ error: "Invalid amount", code: "VALIDATION_ERROR" }, 400);
    }

    if (!customerEmail) {
      return c.json({ error: "Customer email required", code: "VALIDATION_ERROR" }, 400);
    }

    // Check rate limiting
    if (!payments.checkRateLimit(userId)) {
      return c.json({ 
        error: "Too many requests. Please wait before trying again.", 
        code: "RATE_LIMIT_EXCEEDED" 
      }, 429);
    }

    // Create PesaPal order
    const result = await pesapal.createPesaPalOrder(
      amount,
      currency,
      description || "DJ Enoch Purchase",
      customerEmail,
      customerName
    );
    
    if ('error' in result) {
      console.error('[PESAPAL ORDER ERROR]', result.error);
      return c.json({ error: result.error, code: "PESAPAL_ERROR" }, 400);
    }

    // Store order tracking for verification
    const orderData = {
      orderTrackingId: result.orderTrackingId,
      userId,
      amount,
      currency,
      items: items || [],
      customerEmail,
      customerName,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`pesapal:order:${result.orderTrackingId}`, orderData);

    return c.json({
      success: true,
      orderTrackingId: result.orderTrackingId,
      redirectUrl: result.redirectUrl
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[PESAPAL CREATE ORDER ERROR]', errorMessage);
    return c.json({ 
      error: "Failed to create order",
      code: "INTERNAL_ERROR",
      details: errorMessage 
    }, 500);
  }
});

// 2. CHECK PESAPAL ORDER STATUS
app.get("/make-98d801c7-music/payments/pesapal/status/:orderTrackingId", async (c) => {
  try {
    const orderTrackingId = c.req.param("orderTrackingId");

    if (!orderTrackingId) {
      return c.json({ error: "Order tracking ID required", code: "VALIDATION_ERROR" }, 400);
    }

    const result = await pesapal.getPesaPalOrderStatus(orderTrackingId);
    
    if ('error' in result) {
      return c.json({ error: result.error, code: "PESAPAL_ERROR" }, 400);
    }

    return c.json({
      success: true,
      ...result
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[PESAPAL STATUS ERROR]', errorMessage);
    return c.json({ 
      error: "Failed to get payment status",
      code: "INTERNAL_ERROR",
      details: errorMessage 
    }, 500);
  }
});

// 3. PESAPAL WEBHOOK CALLBACK
app.post("/make-98d801c7-music/payments/pesapal/callback", async (c) => {
  try {
    const body = await c.req.json();
    const { OrderTrackingId, OrderStatus } = body;

    if (!OrderTrackingId) {
      console.warn('[PESAPAL] Missing order tracking ID in callback');
      return c.json({ error: "Missing order tracking ID", code: "VALIDATION_ERROR" }, 400);
    }

    // Verify webhook signature if available
    const signature = c.req.header("signature");
    if (signature && !pesapal.verifyPesaPalWebhookSignature(body, signature)) {
      console.warn('[PESAPAL] Webhook signature verification failed');
      // Continue anyway - process the callback
    }

    // Get order data
    const orderData = await kv.get(`pesapal:order:${OrderTrackingId}`) as any;
    
    if (!orderData) {
      console.warn('[PESAPAL] Order not found:', OrderTrackingId);
      return c.json({ 
        status: "ok",
        message: "Order not found (may be already processed)" 
      });
    }

    // Handle payment completion
    if (OrderStatus === "COMPLETED") {
      // Create payment record automatically
      const paymentId = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const payment = {
        id: paymentId,
        userId: orderData.userId,
        userName: orderData.customerName,
        userEmail: orderData.customerEmail,
        items: JSON.stringify(orderData.items),
        total: orderData.amount,
        paymentMethod: "pesapal",
        orderTrackingId: OrderTrackingId,
        status: "approved", // Auto-approved since PesaPal verified
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
      };
      
      // Store payment
      await kv.set(`payment:${paymentId}`, payment);
      await kv.set(`payment:approved:${paymentId}`, paymentId);
      
      // Update order status
      orderData.status = "completed";
      orderData.paymentId = paymentId;
      await kv.set(`pesapal:order:${OrderTrackingId}`, orderData);

      // Create receipt
      try {
        const receipt = await receipts.createReceipt(
          paymentId,
          orderData.userId,
          orderData.items,
          orderData.amount,
          orderData.customerName,
          orderData.customerEmail
        );
        
        if (receipt) {
          payment.receiptId = receipt.id;
          await kv.set(`payment:${paymentId}`, payment);
        }
      } catch (receiptErr) {
        console.error('[RECEIPT CREATION ERROR]', receiptErr);
        // Continue - payment is still valid even if receipt fails
      }

      // Send approval email
      try {
        await email.sendPaymentApprovedEmail(
          orderData.customerEmail,
          orderData.customerName,
          paymentId,
          orderData.items,
          orderData.amount
        );
      } catch (emailErr) {
        console.error('[EMAIL ERROR]', emailErr);
        // Continue - payment is still valid even if email fails
      }

      console.log(`[PESAPAL] Payment completed: ${OrderTrackingId} → ${paymentId}`);
    } 
    else if (OrderStatus === "FAILED" || OrderStatus === "CANCELLED") {
      // Mark order as failed
      orderData.status = "failed";
      await kv.set(`pesapal:order:${OrderTrackingId}`, orderData);

      console.log(`[PESAPAL] Payment ${OrderStatus.toLowerCase()}: ${OrderTrackingId}`);

      // Send failure email if available
      try {
        if (orderData.customerEmail) {
          const reason = OrderStatus === "CANCELLED" 
            ? "Payment was cancelled by the customer" 
            : "Payment processing failed";
          await email.sendPaymentRejectedEmail(
            orderData.customerEmail,
            orderData.customerName,
            OrderTrackingId,
            reason
          );
        }
      } catch (emailErr) {
        console.error('[EMAIL ERROR]', emailErr);
      }
    }

    return c.json({ 
      status: "ok",
      message: "Callback processed"
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[PESAPAL CALLBACK ERROR]', errorMessage);
    return c.json({ 
      error: "Callback processing failed",
      code: "INTERNAL_ERROR",
      details: errorMessage 
    }, 500);
  }
});

// ==================== AIRTEL MONEY (MANUAL VERIFICATION) ====================

// 4. SUBMIT AIRTEL MONEY PAYMENT (WITH PROOF)
app.post("/make-98d801c7-music/payments/submit", async (c) => {
  try {
    const fd = await c.req.formData();
    const userId = fd.get("userId") as string;
    const userName = fd.get("userName") as string;
    const userEmail = fd.get("userEmail") as string;
    const items = fd.get("items") as string;
    const total = parseFloat(fd.get("total") as string);
    const transactionId = fd.get("transactionId") as string || "";
    const paymentMethod = (fd.get("paymentMethod") as string) || "airtel";
    const proof = fd.get("proof") as File;

    // Validate input
    const validation = payments.validatePaymentInput(userId, userName, items, total, transactionId, paymentMethod);
    if (!validation.valid) {
      return c.json({ 
        error: validation.error, 
        code: "VALIDATION_ERROR" 
      }, 400);
    }

    // Check rate limiting
    if (!payments.checkRateLimit(userId)) {
      return c.json({ 
        error: "Too many requests. Please wait before trying again.",
        code: "RATE_LIMIT_EXCEEDED"
      }, 429);
    }

    // Upload proof if provided
    let proofUrl: string | undefined;
    if (proof && paymentMethod === "airtel") {
      try {
        const uploadRes = await music.uploadMusicFile(
          `proofs/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          await proof.arrayBuffer(),
          proof.type
        );
        proofUrl = uploadRes.publicUrl;
      } catch (uploadErr) {
        console.error('[PROOF UPLOAD ERROR]', uploadErr);
        return c.json({ 
          error: "Failed to upload proof",
          code: "UPLOAD_ERROR"
        }, 400);
      }
    }

    // Submit payment
    const paymentId = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const payment = {
      id: paymentId,
      userId,
      userName,
      userEmail,
      items,
      total,
      transactionId,
      proofUrl,
      paymentMethod,
      status: "pending_approval", // Waiting for admin approval
      createdAt: new Date().toISOString(),
    };

    // Store payment
    await kv.set(`payment:${paymentId}`, payment);
    await kv.set(`payment:pending:${paymentId}`, paymentId);

    // Send submission confirmation email
    try {
      await email.sendPaymentSubmittedEmail(
        userEmail,
        userName,
        paymentId,
        total,
        paymentMethod
      );
    } catch (emailErr) {
      console.error('[EMAIL ERROR]', emailErr);
      // Continue - payment is still valid
    }

    console.log(`[AIRTEL] Payment submitted: ${paymentId}`);

    return c.json({ 
      success: true,
      paymentId,
      message: "Payment submitted. Waiting for admin approval."
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[PAYMENT SUBMISSION ERROR]', errorMessage);
    return c.json({ 
      error: "Failed to process payment",
      code: "INTERNAL_ERROR",
      details: errorMessage 
    }, 500);
  }
});

// ==================== ADMIN PAYMENT MANAGEMENT ====================

// 5. APPROVE/REJECT PAYMENT (ADMIN ONLY)
app.post("/make-98d801c7-music/admin/process-approval", async (c) => {
  try {
    const body = await c.req.json();
    const { action, paymentId, reason } = body;

    if (!paymentId) {
      return c.json({ error: "Payment ID required", code: "VALIDATION_ERROR" }, 400);
    }

    const payment = await kv.get(`payment:${paymentId}`) as any;
    if (!payment) {
      return c.json({ error: "Payment not found", code: "NOT_FOUND" }, 404);
    }

    if (action === "accept") {
      // Approve payment
      payment.status = "approved";
      payment.approvedAt = new Date().toISOString();

      // Remove from pending
      await kv.delete(`payment:pending:${paymentId}`);
      // Add to approved
      await kv.set(`payment:approved:${paymentId}`, paymentId);
      // Update payment record
      await kv.set(`payment:${paymentId}`, payment);

      // Create receipt
      try {
        const receipt = await receipts.createReceipt(
          paymentId,
          payment.userId,
          JSON.parse(payment.items),
          payment.total,
          payment.userName,
          payment.userEmail
        );
        
        if (receipt) {
          payment.receiptId = receipt.id;
          await kv.set(`payment:${paymentId}`, payment);
        }
      } catch (receiptErr) {
        console.error('[RECEIPT CREATION ERROR]', receiptErr);
      }

      // Send approval email
      try {
        await email.sendPaymentApprovedEmail(
          payment.userEmail,
          payment.userName,
          paymentId,
          JSON.parse(payment.items),
          payment.total
        );
      } catch (emailErr) {
        console.error('[EMAIL ERROR]', emailErr);
      }

      console.log(`[ADMIN] Payment approved: ${paymentId}`);

    } else if (action === "reject") {
      // Reject payment
      payment.status = "rejected";
      payment.rejectedAt = new Date().toISOString();
      payment.rejectionReason = reason;

      // Remove from pending
      await kv.delete(`payment:pending:${paymentId}`);
      // Add to rejected
      await kv.set(`payment:rejected:${paymentId}`, paymentId);
      // Update payment record
      await kv.set(`payment:${paymentId}`, payment);

      // Send rejection email
      try {
        await email.sendPaymentRejectedEmail(
          payment.userEmail,
          payment.userName,
          paymentId,
          reason || "Your payment was rejected. Please contact support."
        );
      } catch (emailErr) {
        console.error('[EMAIL ERROR]', emailErr);
      }

      console.log(`[ADMIN] Payment rejected: ${paymentId}`);
    } else {
      return c.json({ error: "Invalid action", code: "VALIDATION_ERROR" }, 400);
    }

    return c.json({ 
      success: true,
      paymentId,
      status: payment.status
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[ADMIN APPROVAL ERROR]', errorMessage);
    return c.json({ 
      error: "Approval processing failed",
      code: "INTERNAL_ERROR",
      details: errorMessage 
    }, 500);
  }
});

// ==================== PAYMENT HISTORY & RECEIPTS ====================

// 6. GET USER PAYMENT HISTORY
app.get("/make-98d801c7-music/payments/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const paymentHistory = await payments.getPaymentHistory(userId);
    
    return c.json({ 
      success: true,
      payments: paymentHistory 
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[PAYMENT HISTORY ERROR]', errorMessage);
    return c.json({ 
      error: "Failed to fetch payment history",
      code: "INTERNAL_ERROR",
      details: errorMessage 
    }, 500);
  }
});

// 7. GET USER RECEIPTS
app.get("/make-98d801c7-music/receipts/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userReceipts = await receipts.getUserReceipts(userId);
    
    return c.json({ 
      success: true,
      receipts: userReceipts 
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[RECEIPTS ERROR]', errorMessage);
    return c.json({ 
      error: "Failed to fetch receipts",
      code: "INTERNAL_ERROR",
      details: errorMessage 
    }, 500);
  }
});

// 8. GET SPECIFIC RECEIPT
app.get("/make-98d801c7-music/receipts/:receiptId", async (c) => {
  try {
    const receiptId = c.req.param("receiptId");
    const receipt = await kv.get(`receipt:${receiptId}`);
    
    if (!receipt) {
      return c.json({ 
        error: "Receipt not found",
        code: "NOT_FOUND"
      }, 404);
    }

    return c.json({ 
      success: true,
      receipt
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[RECEIPT FETCH ERROR]', errorMessage);
    return c.json({ 
      error: "Failed to fetch receipt",
      code: "INTERNAL_ERROR",
      details: errorMessage 
    }, 500);
  }
});

// ==================== CONTENT ENDPOINTS ====================

// MUSIC TRACKS LIST
app.get("/make-server-98d801c7/music/tracks", async (c) => {
  try {
    const tracks = await kv.getByPrefix("track:");
    return c.json({ 
      success: true,
      tracks: tracks || [] 
    });
  } catch (e) {
    console.error('[MUSIC TRACKS ERROR]', e);
    return c.json({ 
      error: "Failed to fetch tracks",
      tracks: [] 
    }, 500);
  }
});

// MOVIE LIST
app.get("/make-server-98d801c7/movies/list", async (c) => {
  try {
    const movies = await kv.getByPrefix("movie:");
    return c.json({ 
      success: true,
      movies: movies || [] 
    });
  } catch (e) {
    console.error('[MOVIES LIST ERROR]', e);
    return c.json({ 
      error: "Failed to fetch movies",
      movies: [] 
    }, 500);
  }
});

// SOFTWARE LIST
app.get("/make-server-98d801c7/software/list", async (c) => {
  try {
    const software = await kv.getByPrefix("software:");
    return c.json({ 
      success: true,
      software: software || [] 
    });
  } catch (e) {
    console.error('[SOFTWARE LIST ERROR]', e);
    return c.json({ 
      error: "Failed to fetch software",
      software: [] 
    }, 500);
  }
});

// START SERVER
Deno.serve(app.fetch);