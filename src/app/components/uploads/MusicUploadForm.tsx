import { useState } from "react";
import { Upload, Music, Loader } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function MusicUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ title: "", artist: "DJ ENOCH PRO", genre: "Latest Mix", duration: "" });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);

    const data = new FormData();
    data.append("file", selectedFile);
    data.append("title", formData.title);
    data.append("type", formData.genre); 
    data.append("duration", formData.duration);
    data.append("releaseDate", new Date().toISOString());

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => setProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      if (xhr.status === 200) { 
        alert("Upload Complete!"); 
        onSuccess(); 
        window.location.reload(); 
      } else {
        alert("Upload failed. Check file size (Max 5GB).");
      }
      setUploading(false);
    };
    xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
    xhr.send(data);
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="p-4 border-2 border-dashed rounded-lg text-center bg-gray-50">
        <input type="file" accept="audio/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="hidden" id="music-upload-input" />
        <label htmlFor="music-upload-input" className="cursor-pointer">
          <Upload className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">{selectedFile ? selectedFile.name : "Select Audio File (Max 5GB)"}</p>
        </label>
      </div>
      <input required placeholder="Track Title" className="w-full p-3 border rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
      <input placeholder="Duration (e.g. 45:00)" className="w-full p-3 border rounded" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
      <button disabled={uploading || !selectedFile} className="w-full bg-purple-600 py-3 text-white rounded font-bold disabled:opacity-50">
        {uploading ? `Uploading ${progress}%` : "Start Music Upload"}
      </button>
    </form>
  );
}