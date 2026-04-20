import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as auth from "./auth.tsx";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as payments from "./payments.tsx";

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
    const id = `pay-${Date.now()}`;
    const proof = fd.get("proof") as File;
    const res = await music.uploadMusicFile(`proofs/${id}`, await proof.arrayBuffer(), proof.type);

    const data = {
      id,
      userId: fd.get("userId"),
      userCode: fd.get("userCode"),
      userName: fd.get("userName"),
      items: fd.get("items"),
      total: fd.get("total"),
      transactionId: fd.get("transactionId"),
      proofUrl: res.publicUrl,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    await kv.set(`payment:${id}`, data);
    await kv.set(`payment:pending:${id}`, id);
    return c.json({ success: true });
  } catch (e) { return c.json({ error: "Fail" }, 500); }
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
    const { action, paymentId, requestType, dropId } = body as any;

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

    if (action === 'accept') {
      await payments.approvePayment(paymentId);
    } else {
      await payments.rejectPayment(paymentId);
    }
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Approval processing failed" }, 500);
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
  const thumbImg = await music.uploadMusicFile(`thumbs/${Date.now()}`, await thumb.arrayBuffer(), thumb.type);

  const id = `item-${Date.now()}`;
  const data = {
    id, title: fd.get("title"), 
    audioUrl: media.publicUrl, videoUrl: media.publicUrl, downloadUrl: media.publicUrl,
    thumbnailUrl: thumbImg.publicUrl, fileName: media.fileName, thumbPath: thumbImg.fileName,
    platform: fd.get("platform") || "Windows", price: fd.get("price") || "0"
  };
  const prefix = category === 'music' ? 'track' : category === 'movies' ? 'movie' : 'software';
  await kv.set(`${prefix}:${id}`, data);
  return c.json({ success: true });
});

app.get("/make-98d801c7-music/music/tracks", async (c) => c.json({ tracks: await kv.getByPrefix("track:") }));
app.get("/make-98d801c7-music/movies/list", async (c) => c.json({ movies: await kv.getByPrefix("movie:") }));
app.get("/make-98d801c7-music/software/list", async (c) => c.json({ software: await kv.getByPrefix("software:") }));

Deno.serve(app.fetch);