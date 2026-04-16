import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const BUCKET_NAME = "make-98d801c7-music";

// Initialize storage bucket
export async function initializeMusicStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === BUCKET_NAME);

    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true, // Make files publicly accessible
        fileSizeLimit: 5368709120, // 5GB limit per file
      });
      if (error) {
        console.error("Error creating music bucket:", error);
      } else {
        console.log("Music bucket created successfully");
      }
    }
  } catch (error) {
    console.error("Error initializing music storage:", error);
  }
}

// Upload music file
export async function uploadMusicFile(
  fileName: string,
  fileData: ArrayBuffer,
  contentType: string
) {
  try {
    // Generate unique file name
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${timestamp}_${cleanFileName}`;

    // Upload to storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueFileName, fileData, {
        contentType,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
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
    console.error("Upload error:", error);
    throw error;
  }
}

// Save track metadata to KV store
export async function saveTrackMetadata(trackData: {
  id: string;
  title: string;
  type: string;
  duration: string;
  releaseDate: string;
  audioUrl: string;
  fileName: string;
}) {
  await kv.set(`track:${trackData.id}`, trackData);
}

// Get all tracks
export async function getAllTracks() {
  const tracks = await kv.getByPrefix("track:");
  return tracks;
}

// Delete track
export async function deleteTrack(trackId: string, fileName: string) {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (storageError) {
      console.error("Error deleting file from storage:", storageError);
    }

    // Delete metadata
    await kv.del(`track:${trackId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting track:", error);
    throw error;
  }
}