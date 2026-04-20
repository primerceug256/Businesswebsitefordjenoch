import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as auth from "./auth.tsx";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
import * as payments from "./payments.tsx";

const app = new Hono();

app.use("*", cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.options("*", (c) => c.text("", 204));

// ==================== DELETE FUNCTIONALITY ====================
app.delete("/make-server-98d801c7/:type/delete/:id", async (c) => {
  try {
    const type = c.req.param("type"); // 'music', 'movie', or 'software'
    const id = c.req.param("id");
    const key = `${type}:${id}`;
    
    const item = await kv.get(key);
    if (!item) return c.json({ error: "Item not found" }, 404);

    // Delete physical file from Supabase Storage
    if (item.fileName) {
      if (type === "track") await music.deleteTrack(id, item.fileName);
      else if (type === "movie") await movies.deleteMovie(id, item.fileName);
      else if (type === "software") await software.deleteSoftware(id, item.fileName);
    }

    // Delete Metadata from DB
    await kv.del(key);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== MUSIC UPLOAD ====================
app.post("/make-server-98d801c7/music/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    if (!file) return c.json({ error: "No file" }, 400);

    const arrayBuffer = await file.arrayBuffer();
    const { fileName, publicUrl } = await music.uploadMusicFile(file.name, arrayBuffer, file.type);

    const trackId = `track-${Date.now()}`;
    const trackData = {
      id: trackId,
      title: title || file.name,
      audioUrl: publicUrl,
      fileName: fileName,
      mediaType: "audio",
      artist: "DJ ENOCH PRO",
      releaseDate: new Date().toLocaleDateString(),
    };

    await kv.set(`track:${trackId}`, trackData);
    return c.json({ success: true });
  } catch (error) { return c.json({ error: String(error) }, 500); }
});

app.get("/make-server-98d801c7/music/tracks", async (c) => {
  const tracks = await kv.getByPrefix("track:");
  return c.json({ tracks: tracks || [] });
});

app.get("/make-server-98d801c7/movies/list", async (c) => {
  const m = await kv.getByPrefix("movie:");
  return c.json({ movies: m || [] });
});

app.get("/make-server-98d801c7/software/list", async (c) => {
  const s = await kv.getByPrefix("software:");
  return c.json({ software: s || [] });
});

// ==================== ADMIN & AUTH ====================
app.get("/make-server-98d801c7/admin/users", async (c) => {
  const all = await kv.getByPrefix("user:");
  return c.json({ users: all.filter(u => u && u.id) });
});

app.post("/make-server-98d801c7/admin/approve-subscription", async (c) => {
  const { paymentId, userId, planId, durationDays } = await c.req.json();
  const user = await kv.get(`user:${userId}`);
  if (user) {
    const expires = new Date();
    expires.setDate(expires.getDate() + durationDays);
    user.subscription = { plan: planId, expiresAt: expires.toISOString() };
    await kv.set(`user:${userId}`, user);
    await kv.del(`payment:pending:${paymentId}`);
  }
  return c.json({ success: true });
});

app.post("/make-server-98d801c7/auth/signup", async (c) => {
  const { email, password, name } = await c.req.json();
  const user = await auth.signup(email, password, name);
  return c.json({ user });
});

app.post("/make-server-98d801c7/auth/login", async (c) => {
  const { email, password } = await c.req.json();
  const user = await auth.login(email, password);
  return c.json({ user });
});

app.get("/make-server-98d801c7/payments/pending", async (c) => {
  const p = await payments.getPendingPayments();
  return c.json({ payments: p || [] });
});

Deno.serve(app.fetch);