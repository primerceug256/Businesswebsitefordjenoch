import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const BUCKET_NAME = "make-98d801c7-music";

// Initialize storage bucket
export async function initializeSoftwareStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === BUCKET_NAME);

    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false, // Software is for paid download
        fileSizeLimit: 5368709120, // 5GB limit per file
      });
      if (error) {
        console.error("Error creating software bucket:", error);
      } else {
        console.log("Software bucket created successfully");
      }
    }
  } catch (error) {
    console.error("Error initializing software storage:", error);
  }
}

// Upload software file
export async function uploadSoftwareFile(
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
      console.error("Error uploading software:", error);
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
    console.error("Software upload error:", error);
    throw error;
  }
}

// Save software metadata
export async function saveSoftwareMetadata(softwareData: {
  id: string;
  title: string;
  description: string;
  version: string;
  platform: string;
  category: string;
  price: string;
  downloadUrl: string;
  fileName: string;
}) {
  await kv.set(`software:${softwareData.id}`, softwareData);
}

// Get all software
export async function getAllSoftware() {
  const software = await kv.getByPrefix("software:");
  return software;
}

// Delete software
export async function deleteSoftware(softwareId: string, fileName: string) {
  try {
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (storageError) {
      console.error("Error deleting software from storage:", storageError);
    }

    await kv.del(`software:${softwareId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting software:", error);
    throw error;
  }
}
