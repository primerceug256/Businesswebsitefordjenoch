import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as auth from "./auth.tsx";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as payments from "./payments.tsx";
import * as email from "./email.tsx";
import * as receipts from "./receipts.tsx";
import * as pesapal from "./pesapal.tsx";

const app = new Hono();
app.use("*", cors());

// ==================== PROFILE & TIMER ====================
app.post("/make-98d801c7-music/profile/update", async (c) => {
  const fd = await c.req.formData();
  const userId = fd.get("userId") as string;
  const user = await kv.get(`user:${userId}`);
  if (!user) return c.json({ error: "User not found" }, 404);

  user.name = fd.get("name") || user.name;
  const avatar = fd.get("avatar") as File;
  if (avatar) {
    const res = await music.uploadMusicFile(`avatars/${userId}`, await avatar.arrayBuffer(), avatar.type);
    user.avatarUrl = res.publicUrl;
  }
  await kv.set(`user:${userId}`, user);
  return c.json({ success: true, user });
});

// ==================== DELETE LOGIC ====================
app.delete("/make-98d801c7-music/:type/delete/:id", async (c) => {
  const { type, id } = c.req.param();
  const key = `${type}:${id}`;
  const item = await kv.get(key);
  if (item?.fileName) await music.deleteTrack(id, item.fileName);
  if (item?.thumbPath) await music.deleteTrack(id, item.thumbPath);
  await kv.del(key);
  return c.json({ success: true });
});

// ==================== PAYMENTS & ORDERS ====================
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
});

app.get("/make-98d801c7-music/admin/pending", async (c) => {
  try {
    const paymentsList = await payments.getPendingPayments();
    const enriched = await Promise.all(paymentsList.map(async (payment) => {
      const user = await kv.get(`user:${payment.userId}`);
      return { ...payment, userCode: user?.code || null };
    }));
    return c.json(enriched);
  } catch (e) {
    return c.json({ error: "Unable to load pending payments" }, 500);
  }
});

app.post("/make-98d801c7-music/admin/process-approval", async (c) => {
  try {
    const body = await c.req.json();
    const { action, paymentId, requestType, dropId, reason } = body as any;

    if (requestType === 'drop') {
      const drop = await kv.get(`drop:${dropId}`);
      if (!drop) return c.json({ error: 'Drop order not found' }, 404);

      drop.status = action === 'accept' ? 'completed' : 'rejected';
      if (action === 'accept') {
        drop.dropUrl = drop.dropUrl || `https://example.com/drops/${dropId}`;
      }
      await kv.set(`drop:${dropId}`, drop);
      await kv.del(`drop:pending:${dropId}`);
      return c.json({ success: true });
    }

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
  }
});

app.post("/make-98d801c7-music/drops/order", async (c) => {
  try {
    const fd = await c.req.formData();
    const id = `drop-${Date.now()}`;
    const proof = fd.get("proof") as File;
    const proofUpload = await music.uploadMusicFile(`drop-proofs/${id}`, await proof.arrayBuffer(), proof.type);

    const dropOrder = {
      id,
      userId: fd.get("userId"),
      userCode: fd.get("userCode"),
      djName: fd.get("djName"),
      contact: fd.get("contact"),
      email: fd.get("email"),
      transactionId: fd.get("transactionId"),
      proofUrl: proofUpload.publicUrl,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await kv.set(`drop:${id}`, dropOrder);
    await kv.set(`drop:pending:${id}`, id);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Fail" }, 500);
  }
});

app.post("/make-98d801c7-music/web-development/order", async (c) => {
  try {
    const fd = await c.req.formData();
    const id = `webdev-${Date.now()}`;

    const webDevInquiry = {
      id,
      userId: fd.get("userId"),
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      websiteType: fd.get("websiteType"),
      features: fd.get("features"),
      budget: fd.get("budget"),
      timeline: fd.get("timeline"),
      description: fd.get("description"),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await kv.set(`webdev:${id}`, webDevInquiry);
    await kv.set(`webdev:pending:${id}`, id);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Fail" }, 500);
  }
});

app.get("/make-98d801c7-music/drops/list", async (c) => {
  const drops = (await kv.getByPrefix("drop:")).filter((drop: any) => drop && typeof drop === 'object' && 'status' in drop);
  return c.json({ drops });
});

app.get("/make-98d801c7-music/drops/user/:id", async (c) => {
  const userId = c.req.param("id");
  const drops = (await kv.getByPrefix("drop:")).filter((drop: any) => drop && typeof drop === 'object' && drop.userId === userId);
  return c.json(drops);
});

// ==================== UPLOAD (MEDIA + THUMB) ====================
app.post("/make-98d801c7-music/:category/upload", async (c) => {
  const category = c.req.param("category");
  const fd = await c.req.formData();
  const file = fd.get("file") as File;
  const thumb = fd.get("thumbnail") as File;
  
  const media = await music.uploadMusicFile(file.name, await file.arrayBuffer(), file.type);
  
  let thumbImg = null;
  if (thumb) {
    thumbImg = await music.uploadMusicFile(`thumbs/${Date.now()}`, await thumb.arrayBuffer(), thumb.type);
  }

  const id = `item-${Date.now()}`;
  const data = {
    id, title: fd.get("title"), 
    audioUrl: media.publicUrl, videoUrl: media.publicUrl, downloadUrl: media.publicUrl,
    thumbnailUrl: thumbImg ? thumbImg.publicUrl : null, 
    fileName: media.fileName, 
    thumbPath: thumbImg ? thumbImg.fileName : null,
    platform: fd.get("platform") || "Windows", 
    price: fd.get("price") || "0",
    // Add additional fields for movies
    description: fd.get("description") || "",
    genre: fd.get("genre") || "",
    duration: fd.get("duration") || "",
    releaseYear: fd.get("releaseYear") || "",
    quality: fd.get("quality") || "",
    // Add music-specific fields
    artist: fd.get("artist") || "",
    releaseDate: fd.get("releaseDate") || "",
    mediaType: fd.get("mediaType") || "audio"
  };
  const prefix = category === 'music' ? 'track' : category === 'movies' ? 'movie' : 'software';
  await kv.set(`${prefix}:${id}`, data);
  return c.json({ success: true });
});

app.get("/make-98d801c7-music/music/tracks", async (c) => c.json({ tracks: await kv.getByPrefix("track:") }));
app.get("/make-98d801c7-music/movies/list", async (c) => c.json({ movies: await kv.getByPrefix("movie:") }));
app.get("/make-98d801c7-music/software/list", async (c) => c.json({ software: await kv.getByPrefix("software:") }));

Deno.serve(app.fetch);