import { useState } from "react";
import { Upload, Film, Loader } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function MovieUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);

    const data = new FormData();
    data.append("file", selectedFile);
    data.append("title", title || selectedFile.name);
    data.append("quality", "1080p");
    data.append("releaseYear", new Date().getFullYear().toString());

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => setProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      if (xhr.status === 200) { alert("Movie Uploaded!"); onSuccess(); window.location.reload(); }
      else alert("Upload failed.");
      setUploading(false);
    };
    xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/movies/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
    xhr.send(data);
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="p-4 border-2 border-dashed rounded-lg text-center bg-gray-50">
        <input type="file" accept="video/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="hidden" id="movie-upload-input" />
        <label htmlFor="movie-upload-input" className="cursor-pointer">
          <Film className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">{selectedFile ? selectedFile.name : "Select Video File (Max 5GB)"}</p>
        </label>
      </div>
      <input required placeholder="Movie Title" className="w-full p-3 border rounded" value={title} onChange={e => setTitle(e.target.value)} />
      <button disabled={uploading || !selectedFile} className="w-full bg-red-600 py-3 text-white rounded font-bold disabled:opacity-50">
        {uploading ? `Uploading ${progress}%` : "Start Movie Upload"}
      </button>
    </form>
  );
}