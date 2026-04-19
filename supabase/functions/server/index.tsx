import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as auth from "./auth.tsx";

const app = new Hono();

app.use("*", cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.options("*", (c) => c.text("", 204));

app.post("/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    const user = await auth.signup(email, password, name);
    const { passwordHash, ...safeUser } = user;
    return c.json({ user: safeUser });
  } catch (error: any) {
    // This sends the specific "Already have an account" message to your phone
    return c.json({ error: error.message }, 400);
  }
});

app.post("/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const user = await auth.login(email, password);
    const { passwordHash, ...safeUser } = user;
    return c.json({ user: safeUser });
  } catch (error: any) {
    return c.json({ error: error.message }, 401);
  }
});

Deno.serve(app.fetch);