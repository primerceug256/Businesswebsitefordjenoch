import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";

const app = new Hono().basePath("/make-98d801c7-music");

// 1. CORS FIX - Allows your phone/browser to talk to the server
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

app.options("*", (c) => c.text("", 204));

// Import logic from your other files
import * as auth from "./auth.tsx";
import * as music from "./music.tsx";

// ==========================================
// AUTH ROUTES (Using /signin to match your error)
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

app.post("/auth/signin", async (c) => {
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

app.get("/", (c) => c.json({ status: "DJ Enoch Server Running" }));

Deno.serve(app.fetch);