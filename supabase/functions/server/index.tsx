import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as auth from "./auth.tsx";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";

const app = new Hono();
app.use("*", cors());

// ==================== PROFILE & SUBSCRIPTION ====================
app.post("/make-server-98d801c7/profile/update", async (c) => {
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

// ==================== PAYMENT SUBMISSION ====================
app.post("/make-server-98d801c7/payments/submit", async (c) => {
  try {
    const fd = await c.req.formData();
    const id = `pay-${Date.now()}`;
    const proof = fd.get("proof") as File;
    const res = await music.uploadMusicFile(`proofs/${id}`, await proof.arrayBuffer(), proof.type);

    const paymentData = {
      id, userId: fd.get("userId"), userName: fd.get("userName"),
      items: fd.get("items"), total: fd.get("total"),
      transactionId: fd.get("transactionId"), proofUrl: res.publicUrl,
      status: "pending", createdAt: new Date().toISOString()
    };

    await kv.set(`payment:${id}`, paymentData);
    await kv.set(`payment:pending:${id}`, id);
    return c.json({ success: true });
  } catch (e) { return c.json({ error: "Upload failed" }, 500); }
});

// ==================== MOVIE LIST FIX ====================
app.get("/make-server-98d801c7/movies/list", async (c) => {
  const movies = await kv.getByPrefix("movie:");
  return c.json({ movies: movies || [] });
});

Deno.serve(app.fetch);