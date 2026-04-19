import { useState } from "react";
import { Upload, Package, Loader, CheckCircle } from "lucide-react";
import { projectId, publicAnonKey } from "../../../../utils/supabase/info";

export function SoftwareUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    version: "1.0",
    platform: "Windows",
    category: "DJ Software",
    price: "15000",
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
      data.append("description", formData.description);
      data.append("version", formData.version);
      data.append("platform", formData.platform);
      data.append("category", formData.category);
      data.append("price", formData.price);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          setUploadSuccess(true);
          setUploading(false);
          setSelectedFile(null);
          // Refresh list silently
          setTimeout(() => {
            onSuccess();
            setUploadSuccess(false);
          }, 3000);
        } else {
          setError("Upload failed at server");
          setUploading(false);
        }
      });

      xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/software/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
      xhr.send(data);
    } catch (err) {
      setError("Network error occurred");
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {uploadSuccess && (
        <div className="bg-green-600/20 text-green-400 p-3 rounded-lg flex items-center gap-2 border border-green-600/30 text-sm">
          <CheckCircle size={16} /> Software Uploaded!
        </div>
      )}
      {error && <div className="bg-red-600/20 text-red-400 p-3 rounded-lg border border-red-600/30 text-sm">{error}</div>}

      <form onSubmit={handleUpload} className="space-y-3">
        <input 
          type="file" 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if(file) {
              setSelectedFile(file);
              if(!formData.title) setFormData({...formData, title: file.name.split('.')[0]});
            }
          }} 
          className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
        />
        
        <input
          type="text"
          placeholder="Software Name"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm outline-none focus:border-orange-600"
          required
        />

        <div className="grid grid-cols-2 gap-2">
            <select 
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value})}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm outline-none"
            >
                <option value="Windows">Windows</option>
                <option value="Android">Android</option>
                <option value="macOS">macOS</option>
            </select>
            <input
                type="text"
                placeholder="Price (UGX)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm outline-none"
            />
        </div>

        <button
          type="submit"
          disabled={uploading || !selectedFile}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-800 text-white font-black py-3 rounded-lg transition-all text-sm uppercase tracking-tighter"
        >
          {uploading ? `Uploading ${uploadPr