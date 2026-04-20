import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as auth from "./auth.tsx";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
import * as payments from "./payments.tsx";

const app = new Hono();

app.use("*", cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.options("*", (c) => c.text("", 204));

// ==================== DELETE FUNCTIONALITY ====================
app.delete("/make-server-98d801c7/:type/delete/:id", async (c) => {
  try {
    const type = c.req.param("type"); 
    const id = c.req.param("id");
    const key = `${type}:${id}`;
    
    const item = await kv.get(key);
    if (!item) return c.json({ error: "Item not found" }, 404);

    if (item.fileName) {
      if (type === "track") await music.deleteTrack(id, item.fileName);
      else if (type === "movie") await movies.deleteMovie(id, item.fileName);
      else if (type === "software") await software.deleteSoftware(id, item.fileName);
    }

    await kv.del(key);
    return c.json({ success: true });
  } catch (error) { return c.json({ error: String(error) }, 500); }
});

// ==================== UPLOAD WITH THUMBNAILS ====================

app.post("/make-server-98d801c7/:category/upload", async (c) => {
  try {
    const category = c.req.param("category"); // music, movies, or software
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const thumb = formData.get("thumbnail") as File;
    const title = formData.get("title") as string;

    if (!file || !thumb) return c.json({ error: "File and Thumbnail required" }, 400);

    // 1. Upload Media File
    const { fileName, publicUrl } = await music.uploadMusicFile(file.name, await file.arrayBuffer(), file.type);
    
    // 2. Upload Thumbnail
    const thumbRes = await music.uploadMusicFile(`thumbs/${Date.now()}_${thumb.name}`, await thumb.arrayBuffer(), thumb.type);

    const itemId = `item-${Date.now()}`;
    const metadata = {
      id: itemId,
      title: title || file.name,
      url: publicUrl,
      thumbnailUrl: thumbRes.publicUrl,
      fileName: fileName,
      createdAt: new Date().toISOString(),
      // Specific fields for software/movies
      platform: formData.get("platform") || "Windows",
      price: formData.get("price") || "0",
      genre: formData.get("genre") || "General"
    };

    // Store in correct KV prefix
    const prefix = category === 'music' ? 'track' : category === 'movies' ? 'movie' : 'software';
    await kv.set(`${prefix}:${itemId}`, metadata);

    return c.json({ success: true, item: metadata });
  } catch (error) { return c.json({ error: String(error) }, 500); }
});

// ==================== DJ DROP ORDER SYSTEM ====================

// User Submit Order
app.post("/make-server-98d801c7/drops/order", async (c) => {
  try {
    const formData = await c.req.formData();
    const orderId = `order-${Date.now()}`;
    const proof = formData.get("proof") as File;
    
    let proofUrl = "";
    if (proof) {
      const res = await music.uploadMusicFile(`proofs/${orderId}`, await proof.arrayBuffer(), proof.type);
      proofUrl = res.publicUrl;
    }

    const orderData = {
      id: orderId,
      userId: formData.get("userId"),
      djName: formData.get("djName"),
      contact: formData.get("contact"),
      email: formData.get("email"),
      transactionId: formData.get("transactionId"),
      proofUrl: proofUrl,
      status: "pending", 
      dropUrl: null,
      createdAt: new Date().toISOString()
    };

    await kv.set(`drop_order:${orderId}`, orderData);
    return c.json({ success: true, orderId });
  } catch (error) { return c.json({ error: String(error) }, 500); }
});

// Admin View All Orders
app.get("/make-server-98d801c7/drops/list", async (c) => {
  const drops = await kv.getByPrefix("drop_order:");
  return c.json(drops);
});

// User View Their Orders
app.get("/make-server-98d801c7/drops/user/:userId", async (c) => {
  const userId = c.req.param("userId");
  const all = await kv.getByPrefix("drop_order:");
  return c.json(all.filter((d: any) => d.userId === userId));
});

// Admin Accept/Deny
app.po