import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as auth from "./auth.tsx";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
import * as payments from "./payments.tsx";

const app = new Hono();
app.use("*", cors());

// ==================== DELETE LOGIC ====================
app.delete("/make-server-98d801c7/:type/delete/:id", async (c) => {
  try {
    const { type, id } = c.req.param();
    const key = `${type}:${id}`;
    const item = await kv.get(key);
    if (!item) return c.json({ error: "Not found" }, 404);
    if (item.fileName) await music.deleteTrack(id, item.fileName);
    if (item.thumbPath) await music.deleteTrack(id, item.thumbPath);
    await kv.del(key);
    return c.json({ success: true });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

// ==================== UPLOAD WITH THUMBNAILS ====================
app.post("/make-server-98d801c7/:category/upload", async (c) => {
  try {
    const category = c.req.param("category");
    const fd = await c.req.formData();
    const file = fd.get("file") as File;
    const thumb = fd.get("thumbnail") as File;
    const title = fd.get("title") as string;

    const media = await music.uploadMusicFile(file.name, await file.arrayBuffer(), file.type);
    const thumbRes = await music.uploadMusicFile(`thumbs/${Date.now()}_${thumb.name}`, await thumb.arrayBuffer(), thumb.type);

    const id = `item-${Date.now()}`;
    const data = {
      id, title, 
      audioUrl: media.publicUrl, videoUrl: media.publicUrl, downloadUrl: media.publicUrl,
      thumbnailUrl: thumbRes.publicUrl, fileName: media.fileName, thumbPath: thumbRes.fileName,
      releaseDate: new Date().toLocaleDateString(),
      platform: fd.get("platform") || "Windows", price: fd.get("price") || "0"
    };

    const prefix = category === 'music' ? 'track' : category === 'movies' ? 'movie' : 'software';
    await kv.set(`${prefix}:${id}`, data);
    return c.json({ success: true });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

// ==================== DJ DROP ORDERS ====================
app.post("/make-server-98d801c7/drops/order", async (c) => {
  const fd = await c.req.formData();
  const id = `drop-${Date.now()}`;
  const proof = fd.get("proof") as File;
  const res = await music.uploadMusicFile(`proofs/${id}`, await proof.arrayBuffer(), proof.type);
  const order = { id, userId: fd.get("userId"), djName: fd.get("djName"), contact: fd.get("contact"), transactionId: fd.get("transactionId"), proofUrl: res.publicUrl, status: "pending", dropUrl: null };
  await kv.set(`drop_order:${id}`, order);
  return c.json({ success: true });
});

app.get("/make-server-98d801c7/drops/list", async (c) => c.json(await kv.getByPrefix("drop_order:")));

app.get("/make-server-98d801c7/drops/user/:userId", async (c) => {
  const all = await kv.getByPrefix("drop_order:");
  return c.json(all.filter((d:any) => d.userId === c.req.param("userId")));
});

app.post("/make-server-98d801c7/admin/drops/status", async (c) => {
  const { id, status } = await c.req.json();
  const order = await kv.get(`drop_order:${id}`);
  if(order) { order.status = status; await kv.set(`drop_order:${id}`, order); }
  return c.json({ success: true });
});

app.post("/make-server-98d801c7/admin/drops/send", async (c) => {
  const fd = await c.req.formData();
  const id = fd.get("id") as string;
  const file = fd.get("file") as File;
  const res = await music.uploadMusicFile(`final/${id}`, await file.arrayBuffer(), file.type);
  const order = await kv.get(`drop_order:${id}`);
  if(order) { order.status = "completed"; order.dropUrl = res.publicUrl; await kv.set(`drop_order:${id}`, order); }
  return c.json({ success: true });
});

app.get("/make-server-98d801c7/music/tracks", async (c) => c.json({ tracks: await kv.getByPrefix("track:") }));
app.get("/make-server-98d801c7/movies/list", async (c) => c.json({ movies: await kv.getByPrefix("movie:") }));
app.get("/make-server-98d801c7/software/list", async (c) => c.json({ software: await kv.getByPrefix("software:") }));

Deno.serve(app.fetch);