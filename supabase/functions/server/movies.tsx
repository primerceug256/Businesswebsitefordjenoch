import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const BUCKET_NAME = "make-98d801c7-music";

// Initialize storage bucket
export async function initializeMoviesStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === BUCKET_NAME);

    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false, // Movies are for paid download
        fileSizeLimit: 5368709120, // 5GB limit per file
      });
      if (error) {
        console.error("Error creating movies bucket:", error);
      } else {
        console.log("Movies bucket created successfully");
      }
    }
  } catch (error) {
    console.error("Error initializing movies storage:", error);
  }
}

// Upload movie file
export async function uploadMovieFile(
  fileName: string,
  fileData: ArrayBuffer,
  contentType: string
) {
  try {
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${timestamp}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueFileName, fileData, {
        contentType,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading movie:", error);
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uniqueFileName);

    return {
      fileName: uniqueFileName,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (error) {
    console.error("Movie upload error:", error);
    throw error;
  }
}

// Save movie metadata
export async function saveMovieMetadata(movieData: {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: string;
  releaseYear: string;
  quality: string;
  videoUrl: string;
  fileName: string;
}) {
  await kv.set(`movie:${movieData.id}`, movieData);
}

// Get all movies
export async function getAllMovies() {
  const movies = await kv.getByPrefix("movie:");
  return movies;
}

// Delete movie
export async function deleteMovie(movieId: string, fileName: string) {
  try {
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (storageError) {
      console.error("Error deleting movie from storage:", storageError);
    }

    await kv.del(`movie:${movieId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
}
