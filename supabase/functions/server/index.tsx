import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as auth from "./auth.tsx";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
import * as payments from "./payments.tsx";

const app = new Hono();

// Enable CORS for all routes so the website can talk to the server
app.use("*", cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.options("*", (c) => c.text("", 204));

// ==================== MUSIC UPLOAD (FIXED) ====================

app.post("/make-server-98d801c7/music/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const duration = formData.get("duration") as string;
    const releaseDate = formData.get("releaseDate") as string;

    if (!file) return c.json({ error: "No file selected" }, 400);

    // 1. Upload the actual file to Supabase Storage Bucket
    const arrayBuffer = await file.arrayBuffer();
    const { fileName, publicUrl } = await music.uploadMusicFile(
      file.name, 
      arrayBuffer, 
      file.type || "audio/mpeg"
    );

    // 2. CREATE THE METADATA (This is what the library reads)
    const trackId = `track-${Date.now()}`;
    const trackData = {
      id: trackId,
      title: title || file.name,
      audioUrl: publicUrl,
      fileName: fileName,
      mediaType: "audio", // CRITICAL: This allows Music.tsx to "see" the file
      artist: "DJ ENOCH PRO",
      duration: duration || "Full Mix",
      releaseDate: releaseDate || new Date().toLocaleDateString(),
    };

    // 3. Save to KV Store database
    await kv.set(`track:${trackId}`, trackData);

    return c.json({ success: true, track: trackData });
  } catch (error) {
    console.error("Upload Error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== GET MUSIC TRACKS ====================

app.get("/make-server-98d801c7/music/tracks", async (c) => {
  try {
    // Fetches every item starting with "track:"
    const tracks = await kv.getByPrefix("track:");
    return c.json({ tracks: tracks || [] });
  } catch (error) {
    return c.json({ error: "Failed to fetch tracks" }, 500);
  }
});

// ==================== ADMIN: USERS & SUBSCRIPTIONS ====================

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
    
    // 1. Mark payment as approved
    const pay = await kv.get(`payment:${paymentId}`);
    if (pay) {
      pay.status = 'approved';
      await kv.set(`payment:${paymentId}`, pay);
      await kv.del(`payment:pending:${paymentId}`);
    }

    // 2. Update user subscription
    const user = await kv.get(`user:${userId}`);
    if (user) {
      const expires = new Date();
      expires.setDate(expires.getDate() + durationDays);
      user.subscription = { plan: planId, expiresAt: expires.toISOString() };
      await kv.set(`user:${userId}`, user);
    }
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Approval failed" }, 500);
  }
});

// ==================== AUTH ENDPOINTS ====================

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

// Support for other modules
app.get("/make-server-98d801c7/movies/list", async (c) => {
  const m = await kv.getByPrefix("movie:");
  return c.json({ movies: m || [] });
});

app.get("/make-server-98d801c7/payments/pending", async (c) => {
  const p = await payments.getPendingPayments();
  return c.json({ payments: p || [] });
});

Deno.serve(app.fetch);