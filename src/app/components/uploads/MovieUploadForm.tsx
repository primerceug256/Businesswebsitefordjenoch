import { useState } from "react";
import { Upload, Film, Loader, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from "../../../../utils/supabase/info";

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB in bytes

interface UploadFormData {
  title: string;
  description: string;
  genre: string;
  duration: string;
  releaseYear: string;
  quality: string;
}

export function MovieUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    description: "",
    genre: "Action",
    duration: "",
    releaseYear: new Date().getFullYear().toString(),
    quality: "1080p",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size exceeds 5GB limit. Selected file: ${(file.size / 1024 / 1024 / 1024).toFixed(2)}GB`);
        setSelectedFile(null);
        return;
      }
      if (!file.type.startsWith("video/")) {
        setError("Please select a video file (MP4, MKV, AVI, etc.)");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
      if (!formData.title) {
        setFormData({ ...formData, title: file.name.replace(/\.[^/.]+$/, "") });
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", selectedFile);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("genre", formData.genre);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("releaseYear", formData.releaseYear);
      formDataToSend.append("quality", formData.quality);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(progress));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          setUploadSuccess(true);
          setTimeout(() => {
            onSuccess();
            window.location.reload();
          }, 2000);
        } else {
          const data = JSON.parse(xhr.responseText);
          throw new Error(data.error || "Upload failed");
        }
      });

      xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/movies/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
      xhr.send(formDataToSend);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload movie");
      setUploading(false);
    }
  };

  return (
    <>
      {uploadSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <p className="text-green-800 font-semibold">Upload Successful!</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label className="block text-gray-900 font-semibold mb-3">Video File *</label>
          <div className="relative">
            <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" id="movie-file" disabled={uploading} />
            <label htmlFor="movie-file" className={`block w-full p-6 border-2 border-dashed ${selectedFile ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"} rounded-lg cursor-pointer hover:border-red-400 transition-colors text-center`}>
              {selectedFile ? <p className="text-gray-900 font-semibold">{selectedFile.name}</p> : <p className="text-gray-900">Click to select video file</p>}
            </label>
          </div>
        </div>

        <div>
          <label className="block text-gray-900 font-semibold mb-2">Movie Title *</label>
          <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border rounded-lg" disabled={uploading} />
        </div>

        <button type="submit" disabled={!selectedFile || uploading} className="w-full bg-red-600 text-white px-6 py-4 rounded-lg font-bold">
          {uploading ? `Uploading... ${uploadProgress}%` : "Upload Movie"}
        </button>
      </form>
    </>
  );
}