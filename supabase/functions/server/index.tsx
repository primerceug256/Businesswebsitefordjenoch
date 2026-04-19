import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.options("*", (c) => c.text("", 204));

import * as auth from "./auth.tsx";

// SIGNUP ROUTE
app.post("/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    const user = await auth.signup(email, password, name);
    const { passwordHash, ...userWithoutPassword } = user;
    return c.json({ user: userWithoutPassword });
  } catch (error: any) {
    // Sends the "Already have account" message with a 400 error code
    return c.json({ error: error.message }, 400);
  }
});

// SIGNIN ROUTE
app.post("/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const user = await auth.login(email, password);
    const { passwordHash, ...userWithoutPassword } = user;
    return c.json({ user: userWithoutPassword });
  } catch (error: any) {
    return c.json({ error: error.message }, 401);
  }
});

Deno.serve(app.fetch);