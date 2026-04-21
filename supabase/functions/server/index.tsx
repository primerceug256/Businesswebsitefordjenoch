import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as pesapal from "./pesapal_logic.tsx";

const app = new Hono();
app.use("*", cors());

// 1. START PESAPAL PAYMENT
app.post("/make-server-98d801c7/payments/initiate-pesapal", async (c) => {
  try {
    const { orderId, total, email, name, items, userId } = await c.req.json();
    const token = await pesapal.getPesapalToken();
    const ipnId = await pesapal.registerIPN(token);
    
    const orderRequest = await pesapal.createPesapalOrder(token, ipnId, { orderId, total, email, name });

    // Save pending order
    await kv.set(`order:${orderId}`, { id: orderId, userId, items, total, status: "pending", createdAt: new Date().toISOString() });
    
    return c.json({ redirect_url: orderRequest.redirect_url });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

// 2. PESAPAL IPN (AUTOMATIC VERIFICATION)
app.get("/make-server-98d801c7/payments/pesapal-ipn", async (c) => {
  const trackingId = c.req.query("OrderTrackingId");
  const reference = c.req.query("OrderMerchantReference");

  if (trackingId && reference) {
    const token = await pesapal.getPesapalToken();
    const res = await fetch(`https://cybil.pesapal.com/api/Transactions/GetTransactionStatus?orderTrackingId=${trackingId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();

    if (data.payment_status_description === "Completed") {
        const order = await kv.get(`order:${reference}`);
        if (order) {
            order.status = "completed";
            await kv.set(`order:${reference}`, order);
            // Auto-unlock software/music downloads here
        }
    }
  }
  return c.json({ status: "ok" });
});

// MUSIC TRACKS LIST
app.get("/make-server-98d801c7/music/tracks", async (c) => c.json({ tracks: await kv.getByPrefix("track:") }));

// MOVIE LIST
app.get("/make-server-98d801c7/movies/list", async (c) => c.json({ movies: await kv.getByPrefix("movie:") }));

// SOFTWARE LIST
app.get("/make-server-98d801c7/software/list", async (c) => c.json({ software: await kv.getByPrefix("software:") }));

Deno.serve(app.fetch);