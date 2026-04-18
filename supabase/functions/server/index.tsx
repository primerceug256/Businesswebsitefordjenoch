import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as auth from "./auth.tsx";

// Initialize Hono with the exact function name prefix
const app = new Hono().basePath("/make-server-98d801c7");

// Middleware
app.use('*', logger());
app.use("*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

/**
 * 404 Handler: Ensures that even if a URL is wrong, 
 * the server returns JSON instead of text.
 */
app.notFound((c) => {
  return c.json({ 
    error: "Path Not Found", 
    requestedPath: c.req.path,
    hint: "Check for trailing slashes or typos in the frontend URL"
  }, 404);
});

/**
 * Error Handler: Intercepts code crashes and returns JSON.
 */
app.onError((err, c) => {
  console.error(`Backend Error: ${err.message}`);
  return c.json({ error: "Internal Server Error", details: err.message }, 500);
});

// ==================== AUTH ROUTES ====================

app.post("/auth/signup", async (c) => {
  const { email, password, name } = await c.req.json();
  const user = await auth.signup(email, password, name);
  // Remove password before sending to frontend
  const { passwordHash, ...safeUser } = user;
  return c.json({ user: safeUser });
});

app.post("/auth/login", async (c) => {
  const { email, password } = await c.req.json();
  const user = await auth.login(email, password);
  // Remove password before sending to frontend
  const { passwordHash, ...safeUser } = user;
  return c.json({ user: safeUser });
});

Deno.serve(app.fetch);