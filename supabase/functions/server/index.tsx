import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as music from "./music.tsx";
import * as movies from "./movies.tsx";
import * as software from "./software.tsx";
import * as orders from "./orders.tsx";

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

// Initialize music storage on startup
music.initializeMusicStorage();
movies.initializeMoviesStorage();
software.initializeSoftwareStorage();

// Health check endpoint
app.get("/make-server-98d801c7/health", (c) => {
  return c.json({ status: "ok" });
});

// Upload music file
app.post("/make-server-98d801c7/music/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
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
app.post("/make-server-98d801c7/movies/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const genre = formData.get("genre") as string;
    const duration = formData.get("duration") as string;
    const releaseYear = formData.get("releaseYear") as string;
    const quality = formData.get("quality") as string;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    
    const { fileName, publicUrl } = await movies.uploadMovieFile(
      file.name,
      arrayBuffer,
      file.type
    );

    const movieId = `movie-${Date.now()}`;
    await movies.saveMovieMetadata({
      id: movieId,
      title: title || file.name,
      description: description || "",
      genre: genre || "General",
      duration: duration || "00:00",
      releaseYear: releaseYear || new Date().getFullYear().toString(),
      quality: quality || "1080p",
      videoUrl: publicUrl,
      fileName,
    });

    return c.json({
      success: true,
      movieId,
      videoUrl: publicUrl,
      message: "Movie uploaded successfully",
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
app.post("/make-server-98d801c7/software/upload", async (c) => {
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

// ==================== ORDERS ENDPOINTS ====================

// Create new order
app.post("/make-server-98d801c7/orders/create", async (c) => {
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
app.post("/make-server-98d801c7/orders/:orderId/confirm", async (c) => {
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

Deno.serve(app.fetch);