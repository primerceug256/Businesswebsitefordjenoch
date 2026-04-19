import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";

// Initialize the Hono app
const app = new Hono();

// 1. COMPREHENSIVE CORS FIX
// This allows your website to talk to this server without "Failed to fetch"
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// Handle preflight requests
app.options("*", (c) => c.text("", 204));

// ==========================================
// DATABASE LOGIC (Imported from your files)
// ==========================================
import * as auth from "./auth.tsx";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";

// ==========================================
// AUTH ROUTES
// ==========================================

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
    return c.json({ error: "Invalid email or password" }, 401);
  }
});

// ==========================================
// CONTENT ROUTES
// ==========================================

app.get("/music/tracks", async (c) => {
  try {
    const tracks = await music.getAllTracks();
    return c.json({ tracks });
  } catch (error) {
    return c.json({ error: "Failed to load music" }, 500);
  }
});

app.get("/movies/list", async (c) => {
  try {
    const moviesList = await movies.getAllMovies();
    return c.json({ movies: moviesList });
  } catch (error) {
    return c.json({ error: "Failed to load movies" }, 500);
  }
});

app.get("/software/list", async (c) => {
  try {
    const softwareList = await software.getAllSoftware();
    return c.json({ software: softwareList });
  } catch (error) {
    return c.json({ error: "Failed to load software" }, 500);
  }
});

// Health check
app.get("/", (c) => c.json({ status: "DJ Enoch Server Running" }));

Deno.serve(app.fetch);