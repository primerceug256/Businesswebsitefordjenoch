import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function UploadMusic() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) {
      alert("Select a file first");
      return;
    }

    // 🚫 limit size (important for your issue)
    if (file.size > 50 * 1024 * 1024) {
      alert("File too large (max 50MB)");
      return;
    }

    setUploading(true);

    const filePath = `tracks/${Date.now()}-${file.name}`;

    try {
      const { data, error } = await supabase.storage
        .from("music")
        .upload(filePath, file);

      if (error) throw error;

      setProgress(100);
      alert("Upload successful!");

    } catch (err: any) {
      console.error(err.message);
      alert("Upload failed. Try better network.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload Music</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 mt-3"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {/* Progress bar */}
      {uploading && (
        <div className="w-full bg-gray-200 mt-4">
          <div
            className="bg-green-500 text-white text-center"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
}