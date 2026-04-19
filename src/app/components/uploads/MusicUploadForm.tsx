import { useState } from "react";
import { Upload, Music, Loader, CheckCircle } from "lucide-react";
import { projectId, publicAnonKey } from "../../../../utils/supabase/info";

export function MusicUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    artist: "DJ ENOCH PRO",
    genre: "Mix",
    duration: "",
    releaseDate: new Date().toISOString().split("T")[0],
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const data = new FormData();
      data.append("file", selectedFile);
      data.append("title", formData.title);
      data.append("artist", formData.artist);
      data.append("genre", formData.genre);
      data.append("duration", formData.duration);
      data.append("releaseDate", formData.releaseDate);
      // Ensures the Music library can find and display the track
      data.append("mediaType", "audio"); 

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200 || xhr.status === 201) {
          setUploadSuccess(true);
          setUploading(false);
          setSelectedFile(null);
          setTimeout(() => {
            onSuccess();
            setUploadSuccess(false);
          }, 3000);
        } else {
          try {
            const response = JSON.parse(xhr.responseText || "{}");
            setError(response.error || "Server rejected the upload");
          } catch (e) {
            setError("Server error occurred.");
          }
          setUploading(false);
        }
      });

      xhr.addEventListener("error", () => {
        setError("Network connection failed.");
        setUploading(false);
      });

      xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
      xhr.send(data);
    } catch (err) {
      console.error("Upload error:", err);
      setError("An unexpected error occurred.");
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {uploadSuccess && (
        <div className="bg-green-600/20 text-green-400 p-3 rounded-lg flex items-center gap-2 border border-green-600/30 text-sm">
          <CheckCircle size={16} /> Mix Uploaded! Check the Music library now.
        </div>
      )}
      
      {error && (
        <div className="bg-red-600/20 text-red-400 p-3 rounded-lg border border-red-600/30 text-sm">
          {error}
        </div>
      )}

      <f