import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as auth from "./auth.tsx";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";

const app = new Hono();
app.use("*", cors());

// ==================== USER PROFILE & SUBSCRIPTION ====================

app.post("/make-server-98d801c7/auth/profile/update", async (c) => {
  const fd = await c.req.formData();
  const userId = fd.get("userId") as string;
  const name = fd.get("name") as string;
  const avatar = fd.get("avatar") as File;

  const user = await kv.get(`user:${userId}`);
  if (!user) return c.json({ error: "User not found" }, 404);

  if (name) user.name = name;
  if (avatar) {
    const res = await music.uploadMusicFile(`avatars/${userId}`, await avatar.arrayBuffer(), avatar.type);
    user.avatarUrl = res.publicUrl;
  }

  await kv.set(`user:${userId}`, user);
  return c.json({ success: true, user });
});

// ==================== PAYMENT & ORDER SUBMISSION ====================

app.post("/make-server-98d801c7/payments/submit", async (c) => {
  try {
    const fd = await c.req.formData();
    const id = `pay-${Date.now()}`;
    const proof = fd.get("proof") as File;
    const res = await music.uploadMusicFile(`proofs/${id}`, await proof.arrayBuffer(), proof.type);

    const paymentData = {
      id,
      userId: fd.get("userId"),
      userName: fd.get("userName"),
      items: fd.get("items"), // JSON string of cart
      total: fd.get("total"),
      transactionId: fd.get("transactionId"),
      proofUrl: res.publicUrl,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    await kv.set(`payment:${id}`, paymentData);
    await kv.set(`payment:pending:${id}`, id);
    return c.json({ success: true });
  } catch (e) { return c.json({ error: "Upload failed" }, 500); }
});

// Admin Approve Payment (Unlocks content)
app.post("/make-server-98d801c7/admin/approve-payment", async (c) => {
  const { paymentId, durationDays } = await c.req.json();
  const pay = await kv.get(`payment:${paymentId}`);
  const user = await kv.get(`user:${pay.userId}`);

  if (user) {
    const now = new Date();
    const expires = new Date(now.getTime() + (durationDays * 24 * 60 * 60 * 1000));
    user.subscription = { 
        active: true, 
        expiresAt: expires.toISOString(),
        plan: "Premium" 
    };
    await kv.set(`user:${pay.userId}`, user);
    await kv.del(`payment:pending:${paymentId}`);
    pay.status = "approved";
    await kv.set(`payment:${paymentId}`, pay);
  }
  return c.json({ success: true });
});

// Fix for Movie 404: Ensure list is returned as object
app.get("/make-server-98d801c7/movies/list", async (c) => {
  const movies = await kv.getByPrefix("movie:");
  return c.json({ movies: movies || [] });
});

Deno.serve(app.fetch);