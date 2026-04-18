import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
import * as auth from "./auth.tsx";
import * as payments from "./payments.tsx";

// 1. Initialize Hono with the exact function name prefix
const app = new Hono().basePath("/make-server-98d801c7");

app.use('*', logger());

// 2. Enable CORS
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

/**
 * 3. GLOBAL 404 HANDLER (Ensures valid JSON if route is wrong)
 * Prevents the "Unexpected character" error by returning JSON instead of text
 */
app.notFound((c) => {
  return c.json({ 
    error: "Route Not Found", 
    path: c.req.path,
    suggestion: "Check your frontend URL structure"
  }, 404);
});

/**
 * 4. GLOBAL ERROR HANDLER (Ensures valid JSON if code crashes)
 */
app.onError((err, c) => {
  console.error(`Backend Error: ${err.message}`);
  return c.json({ 
    error: "Internal Server Error", 
    message: err.message 
  }, 500);
});

// ==================== AUTH ROUTES ====================

app.post("/auth/signup", async (c) => {
  const body = await c.req.json();
  const user = await auth.signup(body.email, body.password, body.name);
  const { passwordHash, ...safeUser } = user;
  return c.json({ user: safeUser });
});

app.post("/auth/login", async (c) => {
  const body = await c.req.json();
  const user = await auth.login(body.email, body.password);
  const { passwordHash, ...safeUser } = user;
  return c.json({ user: safeUser });
});

app.put("/user/update", async (c) => {
  const body = await c.req.json();
  const user = await auth.updateUser(body.userId, body);
  const { passwordHash, ...safeUser } = user;
  return c.json({ user: safeUser });
});

// ==================== CONTENT ROUTES ====================

app.get("/music/tracks", async (c) => {
  const tracks = await music.getAllTracks();
  return c.json({ tracks });
});

app.get("/movies/list", async (c) => {
  const moviesList = await movies.getAllMovies();
  return c.json({ movies: moviesList });
});

app.get("/software/list", async (c) => {
  const softwareList = await software.getAllSoftware();
  return c.json({ software: softwareList });
});

// ==================== PAYMENT ROUTES ====================

app.post("/payments/submit", async (c) => {
  const formData = await c.req.formData();
  const payment = await payments.submitPayment(
    formData.get("userId") as string,
    "User",
    formData.get("items") as string,
    parseFloat(formData.get("total") as string),
    formData.get("transactionId") as string
  );
  return c.json({ success: true, payment });
});

Deno.serve(app.fetch);