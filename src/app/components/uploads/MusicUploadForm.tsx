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

    const data = new FormData();
    data.append("file", selectedFile);
    data.append("title", formData.title);
    data.append("artist", formData.artist);
    data.append("genre", formData.genre);
    data.append("duration", formData.duration);
    data.append("releaseDate", formData.releaseDate);
    data.append("mediaType", "audio");

    const xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        setUploadProgress(100);
        setUploadSuccess(true);
        setUploading(false);
        setSelectedFile(null);
        setTimeout(() => {
          onSuccess();
          setUploadSuccess(false);
        }, 2000);
      } else {
        setError("Upload failed. Status: " + xhr.status);
        setUploading(false);
      }
    };

    xhr.onerror = () => {
      setError("Network error occurred.");
      setUploading(false);
    };

    xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/music/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
    xhr.send(data);
  };

  return (
    <div className="space-y-4">
      {uploadSuccess && (
        <div className="bg-green-600/20 text-green-400 p-3 rounded-lg flex items-center gap-2 border border-green-600/30 text-sm font-bold">
          <CheckCircle size={16} /> MIX PUBLISHED!
        </div>
      )}
      {error && <div className="bg-red-600/20 text-red-400 p-3 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleUpload} className="space-y-3">
        <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center bg-slate-900/50 cursor-pointer">
            <input type="file" accept="audio/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if(file) {
                    setSelectedFile(file);