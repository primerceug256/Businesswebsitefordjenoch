import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const UNIFIED_BUCKET_NAME = "make-98d801c7-media";

// Initialize unified storage bucket
export async function initializeUnifiedStorage() {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error("Error listing buckets:", listError);
      return;
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === UNIFIED_BUCKET_NAME);

    if (!bucketExists) {
      const { data, error } = await supabase.storage.createBucket(UNIFIED_BUCKET_NAME, {
        public: true,
      });

      if (error) {
        console.error("Error creating unified media bucket:", error);
        console.error("Error details:", JSON.stringify(error));
      } else {
        console.log("Unified media bucket created successfully:", data);
      }
    } else {
      console.log("Unified media bucket already exists");
    }
  } catch (error) {
    console.error("Error initializing unified storage:", error);
  }
}

// Upload file to unified bucket with folder organization
export async function uploadFileToUnified(
  fileName: string,
  fileData: ArrayBuffer,
  contentType: string,
  category: "music" | "movies" | "software"
) {
  try {
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const folderPath = `${category}/${timestamp}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from(UNIFIED_BUCKET_NAME)
      .upload(folderPath, fileData, {
        contentType,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error(`Error uploading ${category} file:`, error);
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(UNIFIED_BUCKET_NAME)
      .getPublicUrl(folderPath);

    return {
      fileName: folderPath,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

// Delete file from unified bucket
export async function deleteFileFromUnified(filePath: string) {
  try {
    const { error } = await supabase.storage
      .from(UNIFIED_BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error("Error deleting file from unified storage:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}

export { UNIFIED_BUCKET_NAME };
