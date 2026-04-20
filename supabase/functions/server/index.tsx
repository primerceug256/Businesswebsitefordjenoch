import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as auth from "./auth.tsx";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";

const app = new Hono();
app.use("*", cors());

// ==================== DJ DROP ORDERS (FIXED) ====================
app.post("/make-server-98d801c7/drops/order", async (c) => {
  try {
    const fd = await c.req.formData();
    const id = `drop-${Date.now()}`;
    
    // Check if proof file exists
    const proofFile = fd.get("proof") as File;
    let proofUrl = "";
    
    if (proofFile) {
      const arrayBuffer = await proofFile.arrayBuffer();
      const res = await music.uploadMusicFile(`proofs/${id}_${proofFile.name}`, arrayBuffer, proofFile.type);
      proofUrl = res.publicUrl;
    }

    const orderData = {
      id,
      userId: fd.get("userId"),
      djName: fd.get("djName"),
      contact: fd.get("contact"),
      email: fd.get("email"), // Now included
      transactionId: fd.get("transactionId"),
      proofUrl: proofUrl,
      status: "pending",
      dropUrl: null,
      createdAt: new Date().toISOString()
    };

    await kv.set(`drop_order:${id}`, orderData);
    return c.json({ success: true, id });
  } catch (error) {
    console.error("Drop Order Error:", error);
    return c.json({ error: "Failed to process order" }, 500);
  }
});

// ==================== MOVIE LIST (FIXED 404) ====================
app.get("/make-server-98d801c7/movies/list", async (c) => {
  const allMovies = await kv.getByPrefix("movie:");
  // Always return an object with a movies array to prevent frontend crashes
  return c.json({ movies: allMovies || [] });
});

// ==================== PAYMENTS (FIXED SUBMISSION) ====================
app.post("/make-server-98d801c7/payments/submit", async (c) => {
  try {
    const fd = await c.req.formData();
    const id = `pay-${Date.now()}`;
    const proof = fd.get("proof") as File;
    const arrayBuffer = await proof.arrayBuffer();
    const res = await music.uploadMusicFile(`proofs/${id}`, arrayBuffer, proof.type);

    const data = {
      id, userId: fd.get("userId"), userName: fd.get("userName"),
      items: fd.get("items"), total: fd.get("total"),
      transactionId: fd.get("transactionId"), proofUrl: res.publicUrl,
      status: "pending"
    };

    await kv.set(`payment:${id}`, data);
    await kv.set(`payment:pending:${id}`, id);
    return c.json({ success: true });
  } catch (e) { return c.json({ error: "Server Error" }, 500); }
});

Deno.serve(app.fetch);