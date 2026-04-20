import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as auth from "./auth.tsx";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";

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
      id, userId: fd.get("userId"), userName: fd.get("userName"),
      items: fd.get("items"), total: fd.get("total"),
      transactionId: fd.get("transactionId"), proofUrl: res.publicUrl,
      status: "pending", createdAt: new Date().toISOString()
    };
    await kv.set(`payment:${id}`, data);
    await kv.set(`payment:pending:${id}`, id);
    return c.json({ success: true });
  } catch (e) { return c.json({ error: "Fail" }, 500); }
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