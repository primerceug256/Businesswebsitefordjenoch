import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
import * as auth from "./auth.tsx";
import * as payments from "./payments.tsx";

const app = new Hono();

// Enable Logger
app.use('*', logger());

// Enable CORS
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

// ERROR HANDLER: Ensure all errors return JSON
app.onError((err, c) => {
  console.error(`App Error: ${err.message}`);
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

// 404 HANDLER: Ensure 404s return JSON
app.notFound((c) => {
  return c.json({ error: `Route not found: ${c.req.path}` }, 404);
});

// ROUTING: Explicitly include the function name prefix so paths match exactly
const prefix = "/make-server-98d801c7";

// Auth
app.post(`${prefix}/auth/signup`, async (c) => {
  const { email, password, name } = await c.req.json();
  const user = await auth.signup(email, password, name);
  const { passwordHash, ...safeUser } = user;
  return c.json({ user: safeUser });
});

app.post(`${prefix}/auth/login`, async (c) => {
  const { email, password } = await c.req.json();
  const user = await auth.login(email, password);
  const { passwordHash, ...safeUser } = user;
  return c.json({ user: safeUser });
});

app.put(`${prefix}/user/update`, async (c) => {
  const { userId, ...updates } = await c.req.json();
  const user = await auth.updateUser(userId, updates);
  const { passwordHash, ...safeUser } = user;
  return c.json({ user: safeUser });
});

// Content List Endpoints
app.get(`${prefix}/music/tracks`, async (c) => {
  const tracks = await music.getAllTracks();
  return c.json({ tracks });
});

app.get(`${prefix}/movies/list`, async (c) => {
  const moviesList = await movies.getAllMovies();
  return c.json({ movies: moviesList });
});

app.get(`${prefix}/software/list`, async (c) => {
  const softwareList = await software.getAllSoftware();
  return c.json({ software: softwareList });
});

// Payment Submission
app.post(`${prefix}/payments/submit`, async (c) => {
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