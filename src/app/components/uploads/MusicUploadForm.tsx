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

      const xhr = new XMLHttpRequest();
      
      // Track Progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      // Handle Completion
      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          setUploadSuccess(true);
          setUploading(false);
          setSelectedFile(null);
          // Refresh the list without 404-ing the page
          setTimeout(() => {
            onSuccess();
            setUploadSuccess(false);
          }, 3000);
        } else {
          setError("Server rejected the upload");
          setUploading(false);
        }
      });

      xhr.open("POST", `https://${projectId}.supabase.