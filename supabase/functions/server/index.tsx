import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
import * as auth from "./auth.tsx";
import * as payments from "./payments.tsx";

// 1. Initialize Hono with the exact base path used by your frontend
// This ensures that routes like "/auth/login" actually map to 
// ".../functions/v1/make-server-98d801c7/auth/login"
const app = new Hono().basePath("/make-server-98d801c7");

app.use('*', logger());

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

/**
 * 2. ENSURE VALID JSON FOR 404s
 * If the frontend calls a path that doesn't exist, this returns JSON 
 * instead of the default "Not Found" plain text.
 */
app.notFound((c) => {
  return c.json({ 
    error: "Route Not Found", 
    requestedPath: c.req.path,
    fix: "Ensure your frontend URL includes /make-server-98d801c7"
  }, 404);
});

/**
 * 3. ENSURE VALID JSON FOR ERRORS
 * If a code crash happens, this catches the exception and returns a 
 * JSON object instead of a text stack trace.
 */
app.onError((err, c) => {
  console.error(`Runtime Error: ${err.message}`);
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