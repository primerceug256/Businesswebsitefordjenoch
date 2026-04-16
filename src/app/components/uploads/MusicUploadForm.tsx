import { uploadFile } from "@/lib/upload";

const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedFile) {
    setError("Select a file");
    return;
  }

  setUploading(true);
  setUploadProgress(0);

  try {
    const url = await uploadFile(selectedFile, "music", setUploadProgress);

    await supabase.from("music").insert([
      {
        title: formData.title,
        artist: formData.artist,
        file_url: url,
      },
    ]);

    setUploadSuccess(true);

  } catch {
    setError("Upload failed");
  } finally {
    setUploading(false);
  }
};