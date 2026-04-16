import { supabase } from "@/utils/supabase/info";

export const uploadFile = async (
  file: File,
  bucket: string,
  onProgress?: (progress: number) => void
) => {
  const filePath = `${Date.now()}-${file.name}`;

  try {
    onProgress?.(10);

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    onProgress?.(70);

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    onProgress?.(100);

    return data.publicUrl;

  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
};