import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
import * as orders from "./orders.tsx";

const app = new Hono();

app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Initialize storage
music.initializeMusicStorage();
movies.initializeMoviesStorage();
software.initializeSoftwareStorage();

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Function to send the delivery email
async function sendDeliveryEmail(order: any, links: any) {
  if (!RESEND_API_KEY) {
    console.error("No Resend API Key found!");
    return;
  }

  const itemsHtml = order.items.map((item: any) => `
    <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #eee;">
      <strong>${item.productName}</strong><br>
      <a href="${links[item.productId]}" style="background: #ea580c; color: white; padding: 8px 15px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 5px;">Download Now</a>
    </div>
  `).join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "DJ Enoch Pro <onboarding@resend.dev>", // Once you add your domain to Resend, change this to your email
      to: [order.customerEmail],
      subject: "Your DJ Enoch Pro Digital Downloads are Ready!",
      html: `
        <h1>Thanks for your purchase, ${order.customerName}!</h1>
        <p>Your payment has been verified. You can find your download links below:</p>
        ${itemsHtml}
        <hr>
        <p>If you have any issues, reply to this email or WhatsApp us at +256747816444.</p>
      `,
    }),
  });
  
  return res.ok;
}

// ... Music/Movies/Software endpoints remain same ...
app.get("/make-server-98d801c7/music/tracks", async (c) => {
  const tracks = await music.getAllTracks();
  return c.json({ tracks });
});

app.post("/make-server-98d801c7/music/upload", async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File;
  const arrayBuffer = await file.arrayBuffer();
  const { fileName, publicUrl } = await music.uploadMusicFile(file.name, arrayBuffer, file.type);
  await music.saveTrackMetadata({
    id: `track-${Date.now()}`,
    title: formData.get("title") as string || file.name,
    type: formData.get("type") as string || "Mix",
    duration: formData.get("duration") as string || "00:00",
    releaseDate: new Date().toLocaleDateString(),
    audioUrl: publicUrl,
    fileName,
  });
  return c.json({ success: true });
});

// Create Order
app.post("/make-server-98d801c7/orders/create", async (c) => {
  const body = await c.req.json();
  const order = await orders.createOrder(body);
  return c.json({ success: true, order });
});

// THE KEY CHANGE: CONFIRM AND SEND EMAIL
app.post("/make-server-98d801c7/orders/:orderId/confirm", async (c) => {
  const orderId = c.req.param("orderId");
  const order = await orders.getOrder(orderId);
  
  if (!order) return c.json({ error: "Order not found" }, 404);
  
  const deliveryLinks = orders.generateDeliveryLinks(order.items);
  await orders.updateOrderStatus(orderId, "delivered", deliveryLinks);
  
  // Send the email automatically
  const emailSent = await sendDeliveryEmail(order, deliveryLinks);
  
  return c.json({ 
    success: true, 
    emailSent, 
    message: emailSent ? "Email delivered to customer!" : "Order confirmed, but email failed to send." 
  });
});

Deno.serve(app.fetch);