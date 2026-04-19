import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as auth from "./auth.tsx";
import * as kv from "./kv_store.tsx"; // Import the database helper

const app = new Hono();

// Robust CORS for Supabase and Web Apps
app.use("*", cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.options("*", (c) => c.text("", 204));

// ==================== AUTH ENDPOINTS ====================

app.post("/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    const user = await auth.signup(email, password, name);
    const { passwordHash, ...safeUser } = user;
    return c.json({ user: safeUser });
  } catch (error: any) {
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

// ==================== ADMIN ENDPOINTS ====================

// 1. Get All Users (Admin only)
app.get("/make-server-98d801c7/admin/users", async (c) => {
  try {
    // This looks for all keys starting with "user:"
    const users = await kv.getByPrefix("user:");
    
    // Filter out the "user:email:..." lookup keys, keep only the full user objects
    const userList = users.filter(u => u && typeof u === 'object' && u.id); 
    
    return c.json({ users: userList });
  } catch (error) {
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// 2. Approve Subscription and Payment
app.post("/make-server-98d801c7/admin/approve-subscription", async (c) => {
  try {
    const { paymentId, userId, planId, durationDays } = await c.req.json();
    
    // 1. Update Payment Status to 'approved'
    const payment = await kv.get(`payment:${paymentId}`);
    if (payment) {
      payment.status = 'approved';
      await kv.set(`payment:${paymentId}`, payment);
      // Remove from the pending list
      await kv.del(`payment:pending:${paymentId}`);
    }

    // 2. Update the User's account with the subscription
    const user = await kv.get(`user:${userId}`);
    if (user) {
      const now = new Date();
      // Add the chosen number of days to today's date
      const expires = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
      
      user.subscription = {
        plan: planId,
        expiresAt: expires.toISOString(),
        status: 'active'
      };
      
      await kv.set(`user:${userId}`, user);
    } else {
        return c.json({ error: "User not found" }, 404);
    }

    return c.json({ success: true, message: "Subscription activated successfully" });
  } catch (error) {
    return c.json({ error: "Approval process failed" }, 500);
  }
});

// Start the server
Deno.serve(app.fetch);