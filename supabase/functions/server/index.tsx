import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
import * as orders from "./orders.tsx";
import * as auth from "./auth.tsx";
import * as payments from "./payments.tsx";
import { initializeUnifiedStorage } from "./unified-storage.tsx";
import { cleanupOldBuckets } from "./cleanup-buckets.tsx";

const app = new Hono();

// The base path should be empty because Supabase handles the function name routing
const api = app.basePath("/make-server-98d801c7");

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Clean up old buckets and initialize unified storage
(async () => {
  await cleanupOldBuckets();
  await initializeUnifiedStorage();
})();

// ==================== AUTH ENDPOINTS ====================

app.post("/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    const user = await auth.signup(email, password, name);
    const { passwordHash, ...userWithoutPassword } = user;
    return c.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: String(error) }, 400);
  }
});

app.post("/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const user = await auth.login(email, password);
    const { passwordHash, ...userWithoutPassword } = user;
    return c.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: String(error) }, 401);
  }
});

app.put("/user/update", async (c) => {
  try {
    const { userId, ...updates } = await c.req.json();
    const user = await auth.updateUser(userId, updates);
    const { passwordHash, ...userWithoutPassword } = user;
    return c.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Update user error:", error);
    return c.json({ error: String(error) }, 400);
  }
});

app.get("/health", (c) => c.json({ status: "ok" }));

// ==================== MUSIC ENDPOINTS ====================

app.post("/music/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const mediaType = formData.get("mediaType") as string;
    const duration = formData.get("duration") as string;
    const releaseDate = formData.get("releaseDate") as string;

    if (!file) return c.json({ error: "No file provided" }, 400);

    const arrayBuffer = await file.arrayBuffer();
    const { fileName, publicUrl } = await music.uploadMusicFile(file.name, arrayBuffer, file.type);

    const trackId = `track-${Date.now()}`;
    await music.saveTrackMetadata({
      id: trackId,
      title: title || file.name,
      type: type || "Latest Mix",
      mediaType: mediaType || "audio",
      duration: duration || "00:00",
      releaseDate: releaseDate || new Date().toLocaleDateString(),
      audioUrl: publicUrl,
      fileName,
    });

    return c.json({ success: true, trackId, audioUrl: publicUrl });
  } catch (error) {
    return c.json({ error: "Upload failed", details: String(error) }, 500);
  }
});

app.get("/music/tracks", async (c) => {
  try {
    const tracks = await music.getAllTracks();
    return c.json({ tracks });
  } catch (error) {
    return c.json({ error: "Fetch failed", details: String(error) }, 500);
  }
});

// ==================== MOVIES ENDPOINTS ====================

app.post("/movies/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    if (!file) return c.json({ error: "No file provided" }, 400);

    const arrayBuffer = await file.arrayBuffer();
    const { fileName, publicUrl } = await movies.uploadMovieFile(file.name, arrayBuffer, file.type);

    const movieId = `movie-${Date.now()}`;
    await movies.saveMovieMetadata({
      id: movieId,
      title: (formData.get("title") as string) || file.name,
      description: (formData.get("description") as string) || "",
      genre: (formData.get("genre") as string) || "General",
      vj: (formData.get("vj") as string) || "",
      type: (formData.get("type") as string) || "movie",
      duration: (formData.get("duration") as string) || "00:00",
      releaseYear: (formData.get("releaseYear") as string) || new Date().getFullYear().toString(),
      quality: (formData.get("quality") as string) || "1080p",
      videoUrl: publicUrl,
      fileName,
    });

    return c.json({ success: true, movieId });
  } catch (error) {
    return c.json({ error: "Upload failed", details: String(error) }, 500);
  }
});

app.get("/movies/list", async (c) => {
  try {
    const moviesList = await movies.getAllMovies();
    return c.json({ movies: moviesList });
  } catch (error) {
    return c.json({ error: "Fetch failed", details: String(error) }, 500);
  }
});

// ==================== SOFTWARE ENDPOINTS ====================

app.get("/software/list", async (c) => {
  try {
    const softwareList = await software.getAllSoftware();
    return c.json({ software: softwareList });
  } catch (error) {
    return c.json({ error: "Fetch failed", details: String(error) }, 500);
  }
});

app.post("/software/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    if (!file) return c.json({ error: "No file provided" }, 400);

    const arrayBuffer = await file.arrayBuffer();
    const { fileName, publicUrl } = await software.uploadSoftwareFile(file.name, arrayBuffer, file.type);

    const softwareId = `software-${Date.now()}`;
    await software.saveSoftwareMetadata({
      id: softwareId,
      title: (formData.get("title") as string) || file.name,
      description: (formData.get("description") as string) || "",
      version: (formData.get("version") as string) || "1.0",
      platform: (formData.get("platform") as string) || "Windows",
      category: (formData.get("category") as string) || "Software",
      price: (formData.get("price") as string) || "0",
      downloadUrl: publicUrl,
      fileName,
    });

    return c.json({ success: true, softwareId });
  } catch (error) {
    return c.json({ error: "Upload failed", details: String(error) }, 500);
  }
});

// ==================== PAYMENTS ENDPOINTS ====================

app.post("/payments/submit", async (c) => {
  try {
    const formData = await c.req.formData();
    const payment = await payments.submitPayment(
      formData.get("userId") as string,
      "User",
      formData.get("items") as string,
      parseFloat(formData.get("total") as string),
      formData.get("transactionId") as string
    );
    return c.json({ success: true, payment });
  } catch (error) {
    return c.json({ error: "Payment submission failed", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);