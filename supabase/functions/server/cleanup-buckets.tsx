import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// List and optionally delete old buckets
export async function cleanupOldBuckets() {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("Error listing buckets:", error);
      return;
    }

    console.log("Existing buckets:", buckets?.map(b => b.name));

    // Delete old separate buckets if they exist
    const oldBuckets = ["make-98d801c7-music", "make-98d801c7-movies", "make-98d801c7-software"];

    for (const bucketName of oldBuckets) {
      const exists = buckets?.some(b => b.name === bucketName);
      if (exists) {
        console.log(`Deleting old bucket: ${bucketName}`);
        const { error: deleteError } = await supabase.storage.deleteBucket(bucketName);
        if (deleteError) {
          console.error(`Error deleting ${bucketName}:`, deleteError);
        } else {
          console.log(`Successfully deleted ${bucketName}`);
        }
      }
    }
  } catch (error) {
    console.error("Error cleaning up buckets:", error);
  }
}
