import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
import * as auth from "./auth.tsx";
import * as payments from "./payments.tsx";
import { initializeUnifiedStorage } from "./unified-storage.tsx";
import { cleanupOldBuckets } from "./cleanup-buckets.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes
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

// Initialize storage on startup
(async () => {
  await cleanupOldBuckets();
  await initializeUnifiedStorage();
})();

// ==================== AUTH ====================
app.post("/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    const user = await auth.signup(email, password, name);
    const { passwordHash, ...userWithoutPassword } = user;
    return c.json({ user: userWithoutPassword });
  } catch (error) {
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
    return c.json({ error: String(error) }, 400);
  }
});

// ==================== MUSIC ====================
app.post("/music/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const type = formData.get("type") as string || "Latest Mix";
    const mediaType = formData.get("mediaType") as string || "audio";
    const duration = formData.get("duration") as string || "00:00";
    const releaseDate = formData.get("releaseDate") as string || new Date().toLocaleDateString();

    if (!file) return c.json({ error: "No file provided" }, 400);

    const arrayBuffer = await file.arrayBuffer();
    const { fileName, publicUrl } = await music.uploadMusicFile(file.name, arrayBuffer, file.type);

    const trackId = `track-${Date.now()}`;
    await music.saveTrackMetadata({
      id: trackId,
      title: title || file.name,
      type,
      mediaType,
      duration,
      releaseDate,
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

// ==================== MOVIES ====================
app.post("/movies/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string || "";
    const genre = formData.get("genre") as string || "General";
    const type = formData.get("type") as string || "movie";
    const duration = formData.get("duration") as string || "00:00";
    const releaseYear = formData.get("releaseYear") as string || new Date().getFullYear().toString();
    const quality = formData.get("quality") as string || "1080p";

    if (!file) return c.json({ error: "No file provided" }, 400);

    const arrayBuffer = await file.arrayBuffer();
    const { fileName, publicUrl } = await movies.uploadMovieFile(file.name, arrayBuffer, file.type);

    const movieId = `movie-${Date.now()}`;
    await movies.saveMovieMetadata({
      id: movieId,
      title: title || file.name,
      description,
      genre,
      type,
      duration,
      releaseYear,
      quality,
      videoUrl: publicUrl,
      fileName,
    });

    return c.json({ success: true, movieId, videoUrl: publicUrl });
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

// ==================== SOFTWARE ====================
app.post("/software/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const version = formData.get("version") as string || "1.0";
    const platform = formData.get("platform") as string || "Windows";
    const price = formData.get("price") as string || "0";

    if (!file) return c.json({ error: "No file provided" }, 400);

    const arrayBuffer = await file.arrayBuffer();
    const { fileName, publicUrl } = await software.uploadSoftwareFile(file.name, arrayBuffer, file.type || "application/octet-stream");

    const softwareId = `software-${Date.now()}`;
    await software.saveSoftwareMetadata({
      id: softwareId,
      title: title || file.name,
      description: "",
      version,
      platform,
      category: "DJ Software",
      price,
      downloadUrl: publicUrl,
      fileName,
    });

    return c.json({ success: true, softwareId, downloadUrl: publicUrl });
  } catch (error) {
    return c.json({ error: "Upload failed", details: String(error) }, 500);
  }
});

app.get("/software/list", async (c) => {
  try {
    const softwareList = await software.getAllSoftware();
    return c.json({ software: softwareList });
  } catch (error) {
    return c.json({ error: "Fetch failed", details: String(error) }, 500);
  }
});

// ==================== PAYMENTS ====================
app.post("/payments/submit", async (c) => {
  try {
    const formData = await c.req.formData();
    const userId = formData.get("userId") as string;
    const total = parseFloat(formData.get("total") as string);
    const transactionId = formData.get("transactionId") as string;
    const payment = await payments.submitPayment(userId, "Guest", "Items", total, transactionId);
    return c.json({ success: true, payment });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);