import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
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

// 4. VERIFY PESAPAL PAYMENT (Called by client after redirect)
app.post("/make-98d801c7-music/payments/pesapal/verify", async (c) => {
  try {
    const body = await c.req.json();
    const { orderTrackingId, userId } = body;

    if (!orderTrackingId) {
      return c.json({ error: "Order tracking ID required", code: "VALIDATION_ERROR" }, 400);
    }

    // Get order data from kv
    const orderData = await kv.get(`pesapal:order:${orderTrackingId}`) as any;
    
    if (!orderData) {
      return c.json({ 
        error: "Order not found",
        status: "FAILED",
        code: "ORDER_NOT_FOUND"
      }, 404);
    }

    // Verify user matches
    if (userId && orderData.userId !== userId) {
      return c.json({ 
        error: "Unauthorized",
        status: "FAILED",
        code: "UNAUTHORIZED"
      }, 403);
    }

    // Query current status from PesaPal
    const result = await pesapal.getPesaPalOrderStatus(orderTrackingId);
    
    if (!result || 'error' in result) {
      // Return cached status if available
      return c.json({
        status: orderData.status || "PENDING",
        orderTrackingId,
        amount: orderData.amount,
        currency: orderData.currency,
      });
    }

    // Update cached status
    if (result.payment_status) {
      orderData.status = result.payment_status;
      await kv.set(`pesapal:order:${orderTrackingId}`, orderData);
    }

    return c.json({
      status: result.payment_status || orderData.status || "PENDING",
      orderTrackingId,
      amount: orderData.amount,
      currency: orderData.currency,
      ...result
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[PESAPAL VERIFY ERROR]', errorMessage);
    return c.json({ 
      error: "Failed to verify payment",
      status: "UNKNOWN",
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
const handleMusicTracks = async (c: any) => {
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
};

app.get("/music/tracks", handleMusicTracks);
app.get("/make-98d801c7-music/music/tracks", handleMusicTracks);
app.get("/make-server-98d801c7/music/tracks", handleMusicTracks);

// MOVIE LIST
const handleMoviesList = async (c: any) => {
  try {
    const moviesList = await kv.getByPrefix("movie:");
    return c.json({ 
      success: true,
      movies: moviesList || [] 
    });
  } catch (e) {
    console.error('[MOVIES LIST ERROR]', e);
    return c.json({ 
      error: "Failed to fetch movies",
      movies: [] 
    }, 500);
  }
};

app.get("/movies/list", handleMoviesList);
app.get("/make-98d801c7-music/movies/list", handleMoviesList);
app.get("/make-server-98d801c7/movies/list", handleMoviesList);

// CHECK USER MOVIE PASS
app.post("/make-98d801c7-music/movies/check-pass", async (c) => {
  try {
    const body = await c.req.json();
    const { userId } = body;

    if (!userId) {
      return c.json({ hasValidPass: false });
    }

    // Check if user has a completed subscription payment
    const userPayments = await kv.get(`payment:user:${userId}`) as any;
    
    if (!userPayments || userPayments.length === 0) {
      return c.json({ hasValidPass: false });
    }

    // Check if any payment is for a subscription and is approved
    const hasValidPass = userPayments.some((payment: any) => 
      payment.type === 'subscription' && payment.status === 'approved'
    );

    return c.json({ hasValidPass });
  } catch (e) {
    console.error('[CHECK PASS ERROR]', e);
    return c.json({ hasValidPass: false }, 500);
  }
});

// ==================== ADMIN PAYMENT MANAGEMENT ====================

// GET ALL PAYMENTS (ADMIN)
app.get("/make-98d801c7-music/admin/payments", async (c) => {
  try {
    const allPayments = await kv.getByPrefix("payment:");
    
    // Filter out internal keys
    const payments = Object.values(allPayments || {}).filter(
      (p: any) => p && typeof p === 'object' && p.id && p.status
    );

    return c.json(payments.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  } catch (e) {
    console.error('[ADMIN PAYMENTS ERROR]', e);
    return c.json({ error: "Failed to fetch payments", payments: [] }, 500);
  }
});

// APPROVE PAYMENT (ADMIN)
app.post("/make-98d801c7-music/admin/approve-payment", async (c) => {
  try {
    const body = await c.req.json();
    const { paymentId } = body;

    if (!paymentId) {
      return c.json({ error: "Payment ID required", code: "VALIDATION_ERROR" }, 400);
    }

    const payment = await kv.get(`payment:${paymentId}`) as any;
    
    if (!payment) {
      return c.json({ error: "Payment not found", code: "NOT_FOUND" }, 404);
    }

    // Update payment status
    payment.status = "approved";
    payment.approvedAt = new Date().toISOString();
    await kv.set(`payment:${paymentId}`, payment);

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
    
    return c.json({ success: true, message: "Payment approved" });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[APPROVE PAYMENT ERROR]', errorMessage);
    return c.json({ error: "Failed to approve payment", code: "INTERNAL_ERROR" }, 500);
  }
});

// REJECT PAYMENT (ADMIN)
app.post("/make-98d801c7-music/admin/reject-payment", async (c) => {
  try {
    const body = await c.req.json();
    const { paymentId } = body;

    if (!paymentId) {
      return c.json({ error: "Payment ID required", code: "VALIDATION_ERROR" }, 400);
    }

    const payment = await kv.get(`payment:${paymentId}`) as any;
    
    if (!payment) {
      return c.json({ error: "Payment not found", code: "NOT_FOUND" }, 404);
    }

    // Update payment status
    payment.status = "rejected";
    await kv.set(`payment:${paymentId}`, payment);

    // Send rejection email
    try {
      await email.sendPaymentRejectedEmail(
        payment.userEmail,
        payment.userName,
        paymentId,
        "Your payment was rejected by admin. Please try again or contact support."
      );
    } catch (emailErr) {
      console.error('[EMAIL ERROR]', emailErr);
    }

    console.log(`[ADMIN] Payment rejected: ${paymentId}`);
    
    return c.json({ success: true, message: "Payment rejected" });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[REJECT PAYMENT ERROR]', errorMessage);
    return c.json({ error: "Failed to reject payment", code: "INTERNAL_ERROR" }, 500);
  }
});

// REFUND PAYMENT (ADMIN)
app.post("/make-98d801c7-music/admin/refund-payment", async (c) => {
  try {
    const body = await c.req.json();
    const { paymentId, reason = "Admin refund" } = body;

    if (!paymentId) {
      return c.json({ error: "Payment ID required", code: "VALIDATION_ERROR" }, 400);
    }

    const payment = await kv.get(`payment:${paymentId}`) as any;
    
    if (!payment) {
      return c.json({ error: "Payment not found", code: "NOT_FOUND" }, 404);
    }

    if (payment.status === "refunded") {
      return c.json({ error: "Payment already refunded", code: "INVALID_STATE" }, 400);
    }

    // Update payment status
    payment.status = "refunded";
    payment.refundedAt = new Date().toISOString();
    payment.refundReason = reason;
    await kv.set(`payment:${paymentId}`, payment);

    // Send refund email
    try {
      await email.sendRefundNotificationEmail(
        payment.userEmail,
        payment.userName,
        paymentId,
        payment.total,
        reason
      );
    } catch (emailErr) {
      console.error('[EMAIL ERROR]', emailErr);
    }

    console.log(`[ADMIN] Payment refunded: ${paymentId} (${reason})`);
    
    return c.json({ success: true, message: "Payment refunded successfully" });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[REFUND PAYMENT ERROR]', errorMessage);
    return c.json({ error: "Failed to refund payment", code: "INTERNAL_ERROR" }, 500);
  }
});

// USER REQUEST REFUND
app.post("/make-98d801c7-music/payments/request-refund", async (c) => {
  try {
    const body = await c.req.json();
    const { paymentId } = body;

    if (!paymentId) {
      return c.json({ error: "Payment ID required", code: "VALIDATION_ERROR" }, 400);
    }

    const payment = await kv.get(`payment:${paymentId}`) as any;
    
    if (!payment) {
      return c.json({ error: "Payment not found", code: "NOT_FOUND" }, 404);
    }

    // Mark as refund requested
    payment.refundRequested = true;
    payment.refundRequestedAt = new Date().toISOString();
    await kv.set(`payment:${paymentId}`, payment);

    // Send admin notification
    try {
      await email.sendAdminNotificationEmail(
        "Refund Request",
        `User ${payment.userName} (${payment.userEmail}) requested refund for payment ${paymentId}. Amount: ${payment.total} UGX`
      );
    } catch (emailErr) {
      console.error('[EMAIL ERROR]', emailErr);
    }

    console.log(`[REFUND REQUEST] User requested refund: ${paymentId}`);
    
    return c.json({ success: true, message: "Refund request submitted" });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[REFUND REQUEST ERROR]', errorMessage);
    return c.json({ error: "Failed to request refund", code: "INTERNAL_ERROR" }, 500);
  }
});

// SOFTWARE LIST
const handleSoftwareList = async (c: any) => {
  try {
    const softwareList = await kv.getByPrefix("software:");
    return c.json({ 
      success: true,
      software: softwareList || [] 
    });
  } catch (e) {
    console.error('[SOFTWARE LIST ERROR]', e);
    return c.json({ 
      error: "Failed to fetch software",
      software: [] 
    }, 500);
  }
};

app.get("/software/list", handleSoftwareList);
app.get("/make-98d801c7-music/software/list", handleSoftwareList);
app.get("/make-server-98d801c7/software/list", handleSoftwareList);

// SEED DEMO DATA
app.post("/make-98d801c7-music/seed", async (c) => {
  try {
    // Seed demo music tracks
    const demoTracks = [
      {
        id: 'track-demo-001',
        title: 'Summer Vibes Mix',
        artist: 'DJ ENOCH PRO',
        duration: '45:32',
        releaseDate: '2024-01-15',
        type: 'audio',
        mediaType: 'audio',
        audioUrl: 'https://example.com/audio/summer-vibes.mp3',
        fileName: 'summer-vibes.mp3'
      },
      {
        id: 'track-demo-002',
        title: 'Night Club Beats',
        artist: 'DJ ENOCH PRO',
        duration: '38:15',
        releaseDate: '2024-02-10',
        type: 'audio',
        mediaType: 'audio',
        audioUrl: 'https://example.com/audio/night-club-beats.mp3',
        fileName: 'night-club-beats.mp3'
      },
      {
        id: 'track-demo-003',
        title: 'Deep House Sessions',
        artist: 'DJ ENOCH PRO',
        duration: '52:48',
        releaseDate: '2024-03-05',
        type: 'audio',
        mediaType: 'audio',
        audioUrl: 'https://example.com/audio/deep-house.mp3',
        fileName: 'deep-house.mp3'
      }
    ];

    // Seed demo movies
    const demoMovies = [
      {
        id: 'movie-demo-001',
        title: 'The DJ Chronicles',
        description: 'An epic journey through the world of music production',
        genre: 'Documentary',
        duration: '120',
        releaseYear: '2024',
        quality: 'HD',
        videoUrl: 'https://example.com/video/dj-chronicles.mp4',
        fileName: 'dj-chronicles.mp4',
        vj: 'DJ ENOCH PRO'
      },
      {
        id: 'movie-demo-002',
        title: 'Sound Wave',
        description: 'A thrilling story about music and dreams',
        genre: 'Drama',
        duration: '105',
        releaseYear: '2023',
        quality: 'Full HD',
        videoUrl: 'https://example.com/video/sound-wave.mp4',
        fileName: 'sound-wave.mp4',
        vj: 'DJ ENOCH PRO'
      }
    ];

    // Seed demo software
    const demoSoftware = [
      {
        id: 'software-demo-001',
        title: 'DJ Studio Pro',
        description: 'Professional DJ mixing software with advanced effects',
        version: '3.5.1',
        platform: 'Windows',
        category: 'Audio',
        price: '5000',
        downloadUrl: 'https://example.com/software/dj-studio-pro-win.exe',
        fileName: 'dj-studio-pro-win.exe'
      },
      {
        id: 'software-demo-002',
        title: 'Beat Maker',
        description: 'Create professional beats and instrumentals',
        version: '2.1.0',
        platform: 'Android',
        category: 'Audio',
        price: '0',
        downloadUrl: 'https://play.google.com/store/apps/details?id=beatmaker',
        fileName: 'beat-maker.apk'
      },
      {
        id: 'software-demo-003',
        title: 'Sound Editor Plus',
        description: 'Edit and enhance audio files with professional tools',
        version: '4.2.3',
        platform: 'Windows',
        category: 'Audio',
        price: '5000',
        downloadUrl: 'https://example.com/software/sound-editor-plus.exe',
        fileName: 'sound-editor-plus.exe'
      }
    ];

    // Add all demo data to KV store
    for (const track of demoTracks) {
      await kv.set(`track:${track.id}`, track);
    }

    for (const movie of demoMovies) {
      await kv.set(`movie:${movie.id}`, movie);
    }

    for (const software of demoSoftware) {
      await kv.set(`software:${software.id}`, software);
    }

    return c.json({
      success: true,
      message: 'Demo data seeded successfully',
      data: {
        tracks: demoTracks.length,
        movies: demoMovies.length,
        software: demoSoftware.length
      }
    });
  } catch (e) {
    console.error('[SEED ERROR]', e);
    return c.json({ error: 'Failed to seed data' }, 500);
  }
});

// UPLOAD CONTENT
const handleMusicUpload = async (c: any) => {
  try {
    const fd = await c.req.formData();
    const file = fd.get("file") as File;
    const title = (fd.get("title") as string) || (file?.name.split('.')[0] ?? 'Untitled Track');
    const mediaType = (fd.get("mediaType") as string) || 'audio';

    if (!file) {
      return c.json({ error: "File missing" }, 400);
    }

    const uploadRes = await music.uploadMusicFile(
      `music/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`,
      await file.arrayBuffer(),
      file.type
    );

    const audioUrl = uploadRes.publicUrl;
    const trackId = `track-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    await music.saveTrackMetadata({
      id: trackId,
      title,
      type: 'audio',
      mediaType,
      duration: 'Unknown',
      releaseDate: new Date().toISOString(),
      audioUrl,
      fileName: file.name,
    });

    return c.json({ success: true, id: trackId, audioUrl });
  } catch (e) {
    console.error('[MUSIC UPLOAD ERROR]', e);
    return c.json({ error: 'Failed to upload music file' }, 500);
  }
};

app.post("/music/upload", handleMusicUpload);
app.post("/make-98d801c7-music/music/upload", handleMusicUpload);
app.post("/make-server-98d801c7/music/upload", handleMusicUpload);

const handleMoviesUpload = async (c: any) => {
  try {
    const fd = await c.req.formData();
    const file = fd.get("file") as File;
    const title = (fd.get("title") as string) || (file?.name.split('.')[0] ?? 'Untitled Movie');
    const quality = (fd.get("quality") as string) || 'HD';
    const description = (fd.get("description") as string) || 'Uploaded movie';
    const genre = (fd.get("genre") as string) || 'Unknown';
    const releaseYear = (fd.get("releaseYear") as string) || new Date().getFullYear().toString();
    const duration = (fd.get("duration") as string) || 'Unknown';
    const thumbnailFile = fd.get("thumbnail") as File;

    if (!file) {
      return c.json({ error: "File missing" }, 400);
    }

    const uploadRes = await movies.uploadMovieFile(
      `movies/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`,
      await file.arrayBuffer(),
      file.type
    );

    let thumbnailUrl = "";
    if (thumbnailFile && thumbnailFile instanceof File) {
      const thumbRes = await movies.uploadMovieFile(
        `movies/thumbnails/${Date.now()}-${Math.random().toString(36).slice(2)}-${thumbnailFile.name}`,
        await thumbnailFile.arrayBuffer(),
        thumbnailFile.type
      );
      thumbnailUrl = thumbRes.publicUrl;
    }

    const movieId = `movie-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    await movies.saveMovieMetadata({
      id: movieId,
      title,
      description,
      genre,
      duration,
      releaseYear,
      quality,
      videoUrl: uploadRes.publicUrl,
      thumbnail: thumbnailUrl,
      fileName: file.name,
    });

    return c.json({ success: true, id: movieId, videoUrl: uploadRes.publicUrl });
  } catch (e) {
    console.error('[MOVIE UPLOAD ERROR]', e);
    return c.json({ error: 'Failed to upload movie file' }, 500);
  }
};

app.post("/movies/upload", handleMoviesUpload);
app.post("/make-98d801c7-music/movies/upload", handleMoviesUpload);
app.post("/make-server-98d801c7/movies/upload", handleMoviesUpload);

const handleSoftwareUpload = async (c: any) => {
  try {
    const fd = await c.req.formData();
    const file = fd.get("file") as File;
    const title = (fd.get("title") as string) || (file?.name.split('.')[0] ?? 'Untitled Software');
    const platform = (fd.get("platform") as string) || 'Windows';
    const price = (fd.get("price") as string) || '0';
    const category = (fd.get("category") as string) || (platform === 'Android' ? 'App' : 'Software');

    if (!file) {
      return c.json({ error: "File missing" }, 400);
    }

    const uploadRes = await software.uploadSoftwareFile(
      `software/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`,
      await file.arrayBuffer(),
      file.type
    );

    const softwareId = `software-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    await software.saveSoftwareMetadata({
      id: softwareId,
      title,
      description: 'Uploaded software',
      version: '1.0',
      platform,
      category,
      price,
      downloadUrl: uploadRes.publicUrl,
      fileName: file.name,
    });

    return c.json({ success: true, id: softwareId, downloadUrl: uploadRes.publicUrl });
  } catch (e) {
    console.error('[SOFTWARE UPLOAD ERROR]', e);
    return c.json({ error: 'Failed to upload software file' }, 500);
  }
};

app.post("/software/upload", handleSoftwareUpload);
app.post("/make-98d801c7-music/software/upload", handleSoftwareUpload);
app.post("/make-server-98d801c7/software/upload", handleSoftwareUpload);

// START SERVER
Deno.serve(app.fetch);