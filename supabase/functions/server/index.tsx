import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
import * as orders from "./orders.tsx";
import * as auth from "./auth.tsx";
import * as payments from "./payments.tsx";
import { initializeUnifiedStorage } from "./unified-storage.tsx";
import { cleanupOldBuckets } from "./cleanup-buckets.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Clean up old buckets and initialize unified storage
(async () => {
  await cleanupOldBuckets();
  await initializeUnifiedStorage();
})();

// ==================== AUTH ENDPOINTS ====================

// Signup
app.post("/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    const user = await auth.signup(email, password, name);

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user;

    return c.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: String(error) }, 400);
  }
});

// Login
app.post("/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const user = await auth.login(email, password);

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user;

    return c.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: String(error) }, 401);
  }
});

// Google OAuth Login
app.post("/auth/google", async (c) => {
  try {
    console.log("Google login request received");
    const body = await c.req.json();
    console.log("Request body received:", body ? "credential present" : "no credential");
    
    if (!body.credential) {
      return c.json({ error: "No credential provided" }, 400);
    }

    const user = await auth.googleLogin(body.credential);
    console.log("Google login successful for user:", user.email);

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user;

    return c.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Google login error:", error);
    return c.json({ error: String(error) }, 400);
  }
});

// Update user profile
app.put("/user/update", async (c) => {
  try {
    const { userId, ...updates } = await c.req.json();
    const user = await auth.updateUser(userId, updates);

    const { passwordHash, ...userWithoutPassword } = user;

    return c.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Update user error:", error);
    return c.json({ error: String(error) }, 400);
  }
});

// Health check endpoint
app.get("/make-server-98d801c7/health", (c) => {
  return c.json({ status: "ok" });
});

// Upload music file
app.post("/music/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const mediaType = formData.get("mediaType") as string; // 'audio' or 'video'
    const duration = formData.get("duration") as string;
    const releaseDate = formData.get("releaseDate") as string;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Get file data
    const arrayBuffer = await file.arrayBuffer();

    // Upload file
    const { fileName, publicUrl } = await music.uploadMusicFile(
      file.name,
      arrayBuffer,
      file.type
    );

    // Save metadata
    const trackId = `track-${Date.now()}`;
    await music.saveTrackMetadata({
      id: trackId,
      title: title || file.name,
      type: type || "Latest Mix",
      mediaType: mediaType || "audio",
      duration: duration || "00:00",
      releaseDate: releaseDate || new Date().toLocaleDateString(),
      audioUrl: publicUrl,
      fileName,
    });

    return c.json({
      success: true,
      trackId,
      audioUrl: publicUrl,
      message: "Track uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading music:", error);
    return c.json({ error: "Failed to upload music", details: String(error) }, 500);
  }
});

// Get all tracks
app.get("/make-server-98d801c7/music/tracks", async (c) => {
  try {
    const tracks = await music.getAllTracks();
    return c.json({ tracks });
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return c.json({ error: "Failed to fetch tracks", details: String(error) }, 500);
  }
});

// Delete track
app.delete("/make-server-98d801c7/music/tracks/:trackId", async (c) => {
  try {
    const trackId = c.req.param("trackId");
    const fileName = c.req.query("fileName");

    if (!fileName) {
      return c.json({ error: "fileName is required" }, 400);
    }

    await music.deleteTrack(trackId, fileName);
    return c.json({ success: true, message: "Track deleted successfully" });
  } catch (error) {
    console.error("Error deleting track:", error);
    return c.json({ error: "Failed to delete track", details: String(error) }, 500);
  }
});

// ==================== MOVIES ENDPOINTS ====================

// Upload movie file
app.post("/movies/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const genre = formData.get("genre") as string;
    const vj = formData.get("vj") as string;
    const type = formData.get("type") as string; // 'movie' or 'series'
    const duration = formData.get("duration") as string;
    const releaseYear = formData.get("releaseYear") as string;
    const quality = formData.get("quality") as string;
    const thumbnail = formData.get("thumbnail") as File | null;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();

    const { fileName, publicUrl } = await movies.uploadMovieFile(
      file.name,
      arrayBuffer,
      file.type
    );

    // Handle thumbnail upload if provided
    let thumbnailUrl = "";
    if (thumbnail) {
      const thumbBuffer = await thumbnail.arrayBuffer();
      const thumbResult = await movies.uploadMovieFile(
        `thumb_${thumbnail.name}`,
        thumbBuffer,
        thumbnail.type
      );
      thumbnailUrl = thumbResult.publicUrl;
    }

    const movieId = `movie-${Date.now()}`;
    await movies.saveMovieMetadata({
      id: movieId,
      title: title || file.name,
      description: description || "",
      genre: genre || "General",
      vj: vj || "",
      type: type || "movie",
      duration: duration || "00:00",
      releaseYear: releaseYear || new Date().getFullYear().toString(),
      quality: quality || "1080p",
      videoUrl: publicUrl,
      thumbnail: thumbnailUrl,
      fileName,
    });

    return c.json({
      success: true,
      movieId,
      videoUrl: publicUrl,
      message: `${type === 'series' ? 'Series' : 'Movie'} uploaded successfully`,
    });
  } catch (error) {
    console.error("Error uploading movie:", error);
    return c.json({ error: "Failed to upload movie", details: String(error) }, 500);
  }
});

// Get all movies
app.get("/make-server-98d801c7/movies/list", async (c) => {
  try {
    const moviesList = await movies.getAllMovies();
    return c.json({ movies: moviesList });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return c.json({ error: "Failed to fetch movies", details: String(error) }, 500);
  }
});

// Delete movie
app.delete("/make-server-98d801c7/movies/:movieId", async (c) => {
  try {
    const movieId = c.req.param("movieId");
    const fileName = c.req.query("fileName");

    if (!fileName) {
      return c.json({ error: "fileName is required" }, 400);
    }

    await movies.deleteMovie(movieId, fileName);
    return c.json({ success: true, message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return c.json({ error: "Failed to delete movie", details: String(error) }, 500);
  }
});

// ==================== SOFTWARE ENDPOINTS ====================

// Upload software file
app.post("/software/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const version = formData.get("version") as string;
    const platform = formData.get("platform") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    
    const { fileName, publicUrl } = await software.uploadSoftwareFile(
      file.name,
      arrayBuffer,
      file.type || "application/octet-stream"
    );

    const softwareId = `software-${Date.now()}`;
    await software.saveSoftwareMetadata({
      id: softwareId,
      title: title || file.name,
      description: description || "",
      version: version || "1.0",
      platform: platform || "Windows",
      category: category || "Software",
      price: price || "0",
      downloadUrl: publicUrl,
      fileName,
    });

    return c.json({
      success: true,
      softwareId,
      downloadUrl: publicUrl,
      message: "Software uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading software:", error);
    return c.json({ error: "Failed to upload software", details: String(error) }, 500);
  }
});

// Get all software
app.get("/make-server-98d801c7/software/list", async (c) => {
  try {
    const softwareList = await software.getAllSoftware();
    return c.json({ software: softwareList });
  } catch (error) {
    console.error("Error fetching software:", error);
    return c.json({ error: "Failed to fetch software", details: String(error) }, 500);
  }
});

// Delete software
app.delete("/make-server-98d801c7/software/:softwareId", async (c) => {
  try {
    const softwareId = c.req.param("softwareId");
    const fileName = c.req.query("fileName");

    if (!fileName) {
      return c.json({ error: "fileName is required" }, 400);
    }

    await software.deleteSoftware(softwareId, fileName);
    return c.json({ success: true, message: "Software deleted successfully" });
  } catch (error) {
    console.error("Error deleting software:", error);
    return c.json({ error: "Failed to delete software", details: String(error) }, 500);
  }
});

// ==================== PAYMENTS ENDPOINTS ====================

// Submit payment for approval
app.post("/payments/submit", async (c) => {
  try {
    const formData = await c.req.formData();
    const userId = formData.get("userId") as string;
    const items = formData.get("items") as string;
    const total = parseFloat(formData.get("total") as string);
    const transactionId = formData.get("transactionId") as string;

    // Get user name
    let userName = "Guest";
    if (userId !== "guest") {
      const user = await kv.get(`user:${userId}`) as any;
      userName = user?.name || userName;
    }

    const payment = await payments.submitPayment(
      userId,
      userName,
      items,
      total,
      transactionId
    );

    return c.json({
      success: true,
      payment,
      message: "Payment submitted for approval",
    });
  } catch (error) {
    console.error("Error submitting payment:", error);
    return c.json({ error: "Failed to submit payment", details: String(error) }, 500);
  }
});

// Get pending payments (admin only)
app.get("/make-server-98d801c7/payments/pending", async (c) => {
  try {
    const pendingPayments = await payments.getPendingPayments();
    return c.json({ payments: pendingPayments });
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    return c.json({ error: "Failed to fetch payments", details: String(error) }, 500);
  }
});

// Approve payment (admin only)
app.post("/payments/:paymentId/approve", async (c) => {
  try {
    const paymentId = c.req.param("paymentId");
    await payments.approvePayment(paymentId);
    return c.json({ success: true, message: "Payment approved" });
  } catch (error) {
    console.error("Error approving payment:", error);
    return c.json({ error: "Failed to approve payment", details: String(error) }, 500);
  }
});

// Reject payment (admin only)
app.post("/payments/:paymentId/reject", async (c) => {
  try {
    const paymentId = c.req.param("paymentId");
    await payments.rejectPayment(paymentId);
    return c.json({ success: true, message: "Payment rejected" });
  } catch (error) {
    console.error("Error rejecting payment:", error);
    return c.json({ error: "Failed to reject payment", details: String(error) }, 500);
  }
});

// ==================== ORDERS ENDPOINTS ====================

// Create new order
app.post("/orders/create", async (c) => {
  try {
    const body = await c.req.json();
    const order = await orders.createOrder(body);
    
    return c.json({
      success: true,
      order,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return c.json({ error: "Failed to create order", details: String(error) }, 500);
  }
});

// Confirm payment and deliver products
app.post("/orders/:orderId/confirm", async (c) => {
  try {
    const orderId = c.req.param("orderId");
    const order = await orders.getOrder(orderId) as orders.Order;
    
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }
    
    // Generate delivery links
    const deliveryLinks = orders.generateDeliveryLinks(order.items);
    
    // Update order status to paid and delivered
    const updatedOrder = await orders.updateOrderStatus(orderId, "delivered", deliveryLinks);
    
    return c.json({
      success: true,
      order: updatedOrder,
      deliveryLinks,
      message: "Payment confirmed! Download links are ready.",
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return c.json({ error: "Failed to confirm payment", details: String(error) }, 500);
  }
});

// Get order details
app.get("/make-server-98d801c7/orders/:orderId", async (c) => {
  try {
    const orderId = c.req.param("orderId");
    const order = await orders.getOrder(orderId);
    
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }
    
    return c.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return c.json({ error: "Failed to fetch order", details: String(error) }, 500);
  }
});

// ==================== EVENT BOOKINGS ENDPOINTS ====================

// Submit event booking
app.post("/event-bookings/submit", async (c) => {
  try {
    const bookingData = await c.req.json();
    const bookingId = `booking-${Date.now()}`;
    
    const booking = {
      ...bookingData,
      id: bookingId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`event-booking:${bookingId}`, booking);
    
    return c.json({
      success: true,
      bookingId,
      message: "Event booking submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting event booking:", error);
    return c.json({ error: "Failed to submit booking", details: String(error) }, 500);
  }
});

// Get all event bookings (admin only)
app.get("/make-server-98d801c7/event-bookings/list", async (c) => {
  try {
    const bookings = await kv.getByPrefix("event-booking:");
    return c.json({ bookings });
  } catch (error) {
    console.error("Error fetching event bookings:", error);
    return c.json({ error: "Failed to fetch bookings", details: String(error) }, 500);
  }
});

// ==================== DJ DROPS ENDPOINTS ====================

// Submit DJ drop order
app.post("/dj-drops/submit", async (c) => {
  try {
    const formData = await c.req.formData();
    const djName = formData.get("djName") as string;
    const transactionId = formData.get("transactionId") as string;
    const amount = formData.get("amount") as string;
    const screenshot = formData.get("screenshot") as File | null;

    const dropId = `dj-drop-${Date.now()}`;
    
    let screenshotUrl = "";
    if (screenshot) {
      // In a production environment, you would upload the screenshot to storage
      // For now, we'll just note that it was provided
      screenshotUrl = "screenshot-provided";
    }

    const djDrop = {
      id: dropId,
      djName,
      transactionId,
      amount: parseInt(amount),
      screenshot: screenshotUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`dj-drop:${dropId}`, djDrop);
    
    return c.json({
      success: true,
      dropId,
      message: "DJ drop order submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting DJ drop order:", error);
    return c.json({ error: "Failed to submit order", details: String(error) }, 500);
  }
});

// Get all DJ drop orders (admin only)
app.get("/make-server-98d801c7/dj-drops/list", async (c) => {
  try {
    const djDrops = await kv.getByPrefix("dj-drop:");
    return c.json({ djDrops });
  } catch (error) {
    console.error("Error fetching DJ drops:", error);
    return c.json({ error: "Failed to fetch DJ drops", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);