import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as auth from "./auth.tsx";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
import * as payments from "./payments.tsx";

const app = new Hono();

// Enable CORS for the website to communicate with this server
app.use("*", cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.options("*", (c) => c.text("", 204));

// ==================== DELETE FUNCTIONALITY ====================
// This handles Music, Movies, and Software deletions
app.delete("/make-server-98d801c7/:type/delete/:id", async (c) => {
  try {
    const type = c.req.param("type"); // Expected: 'track', 'movie', or 'software'
    const id = c.req.param("id");
    const key = `${type}:${id}`;
    
    // 1. Get metadata from database to find the file path
    const item = await kv.get(key);
    if (!item) return c.json({ error: "Item not found in database" }, 404);

    // 2. Delete the actual file from Supabase Storage buckets
    if (item.fileName) {
      if (type === "track") {
        await music.deleteTrack(id, item.fileName);
      } else if (type === "movie") {
        await movies.deleteMovie(id, item.fileName);
      } else if (type === "software") {
        await software.deleteSoftware(id, item.fileName);
      }
    }

    // 3. Remove the metadata record from KV Store
    await kv.del(key);

    return c.json({ success: true, message: `${type} deleted successfully` });
  } catch (error) {
    console.error("Delete Error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== MUSIC ENDPOINTS ====================
app.post("/make-server-98d801c7/music/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const duration = formData.get("duration") as string;
    const releaseDate = formData.get("releaseDate") as string;

    if (!file) return c.json({ error: "No file selected" }, 400);

    // Upload to Storage
    const arrayBuffer = await file.arrayBuffer();
    const { fileName, publicUrl } = await music.uploadMusicFile(
      file.name, 
      arrayBuffer, 
      file.type || "audio/mpeg"
    );

    // Save Metadata to KV
    const trackId = `track-${Date.now()}`;
    const trackData = {
      id: trackId,
      title: title || file.name,
      audioUrl: publicUrl,
      fileName: fileName,
      mediaType: "audio",
      artist: "DJ ENOCH PRO",
      duration: duration || "Full Mix",
      releaseDate: releaseDate || new Date().toLocaleDateString(),
    };

    await kv.set(`track:${trackId}`, trackData);
    return c.json({ success: true, track: trackData });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

app.get("/make-server-98d801c7/music/tracks", async (c) => {
  const tracks = await kv.getByPrefix("track:");
  return c.json({ tracks: tracks || [] });
});

// ==================== MOVIE & SOFTWARE LISTS ====================
app.get("/make-server-98d801c7/movies/list", async (c) => {
  const m = await kv.getByPrefix("movie:");
  return c.json({ movies: m || [] });
});

app.get("/make-server-98d801c7/software/list", async (c) => {
  const s = await kv.getByPrefix("software:");
  return c.json({ software: s || [] });
});

// ==================== ADMIN & SUBSCRIPTIONS ====================
app.get("/make-server-98d801c7/admin/users", async (c) => {
  try {
    const all = await kv.getByPrefix("user:");
    const userList = all.filter(u => u && u.id);
    return c.json({ users: userList });
  } catch (error) {
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

app.post("/make-server-98d801c7/admin/approve-subscription", async (c) => {
  try {
    const { paymentId, userId, planId, durationDays } = await c.req.json();
    
    const user = await kv.get(`user:${userId}`);
    if (user) {
      const expires = new Date();
      // If plan is 'unlimited', durationDays will be 36500 (100 years)
      expires.setDate(expires.getDate() + durationDays);
      user.subscription = { plan: planId, expiresAt: expires.toISOString() };
      
      await kv.set(`user:${userId}`, user);
      
      // Clean up the pending payment record
      await kv.del(`payment:pending:${paymentId}`);
      
      // Update payment status
      const pay = await kv.get(`payment:${paymentId}`);
      if (pay) {
        pay.status = 'approved';
        await kv.set(`payment:${paymentId}`, pay);
      }
    }
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Approval failed" }, 500);
  }
});

// ==================== AUTH & PAYMENTS ====================
app.post("/make-server-98d801c7/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    const user = await auth.signup(email, password, name);
    return c.json({ user });
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

app.post("/make-server-98d801c7/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const user = await auth.login(email, password);
    return c.json({ user });
  } catch (error: any) {
    return c.json({ error: error.message }, 401);
  }
});

app.get("/make-server-98d801c7/payments/pending", async (c) => {
  const p = await payments.getPendingPayments();
  return c.json({ payments: p || [] });
});

Deno.serve(app.fetch);