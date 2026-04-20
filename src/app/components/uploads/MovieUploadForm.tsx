import { useState } from "react";
import { Upload, Film, Loader, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from "../../../../utils/supabase/info";

export function MovieUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const data = new FormData();
      data.append("file", selectedFile);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("genre", formData.genre);
      data.append("duration", formData.duration);
      data.append("releaseYear", formData.releaseYear);
      data.append("quality", formData.quality);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          setUploadSuccess(true);
          setUploading(false);
          setSelectedFile(null);
          // THIS IS THE FIX: We call onSuccess() to refresh the list 
          // but we DO NOT call window.location.reload()
          setTimeout(() => {
            onSuccess();
            setUploadSuccess(false);
          }, 3000);
        } else {
          setError("Upload failed server-side");
          setUploading(false);
        }
      });

      xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/movies/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
      xhr.send(data);
    } catch (err) {
      setError("Network error");
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {uploadSuccess && (
        <div className="bg-green-600/20 text-green-400 p-3 rounded-lg flex items-center gap-2 border border-green-600/30">
          <CheckCircle size={18} /> Success!
        </div>
      )}
      {error && <div className="bg-red-600/20 text-red-400 p-3 rounded-lg border border-red-600/30">Failed: {error}</div>}

      <form onSubmit={handleUpload} className="space-y-4">
        <input 
            type="file" 
            accept="video/*" 
            onChange={(e) => {
                const file = e.target.files?.[0];
                if(file) {
                    setSelectedFile(file);
                    setFormData({...formData, title: file.name.split('.')[0]});
                }
            }} 
            className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
        />
        
        <input
          type="text"
          placeholder="Movie Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm outline-none focus:border-red-600"
          required
        />

        <button
          type="submit"
          disabled={uploading || !selectedFile}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-800 text-white font-bold py-3 rounded-lg transition-all"
        >
          {uploading ? `Uploading ${uploadProgress}%...` : "Start Upload"}
        </button>
      </form>
    </div>
  );
}