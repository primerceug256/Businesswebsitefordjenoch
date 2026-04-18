import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as auth from "./auth.tsx";

// Set base path to match the Supabase Function name
const app = new Hono().basePath("/make-server-98d801c7");

app.use("*", cors());

// Explicitly handle 404s with JSON so the frontend "raw body" log is helpful
app.notFound((c) => {
  return c.json({ error: `Path Not Found: ${c.req.path}` }, 404);
});

app.post("/auth/signup", async (c) => {
  const { email, password, name } = await c.req.json();
  const user = await auth.signup(email, password, name);
  return c.json({ user });
});

app.post("/auth/login", async (c) => {
  const { email, password } = await c.req.json();
  const user = await auth.login(email, password);
  return c.json({ user });
});

Deno.serve(app.fetch);