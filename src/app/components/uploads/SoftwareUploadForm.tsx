import { useState } from "react";
import { Upload, Package, Loader } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function SoftwareUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("15000");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);

    const data = new FormData();
    data.append("file", selectedFile);
    data.append("title", title || selectedFile.name);
    data.append("price", price);
    data.append("platform", "Windows");

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => setProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      if (xhr.status === 200) { alert("Software Uploaded!"); onSuccess(); window.location.reload(); }
      else alert("Upload failed.");
      setUploading(false);
    };
    xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/software/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
    xhr.send(data);
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="p-4 border-2 border-dashed rounded-lg text-center bg-gray-50">
        <input type="file" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="hidden" id="soft-upload-input" />
        <label htmlFor="soft-upload-input" className="cursor-pointer">
          <Package className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">{selectedFile ? selectedFile.name : "Select Software File (Max 5GB)"}</p>
        </label>
      </div>
      <input required placeholder="Software Name" className="w-full p-3 border rounded" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Price (UGX)" className="w-full p-3 border rounded" value={price} onChange={e => setPrice(e.target.value)} />
      <button disabled={uploading || !selectedFile} className="w-full bg-orange-600 py-3 text-white rounded font-bold disabled:opacity-50">
        {uploading ? `Uploading ${progress}%` : "Start Software Upload"}
      </button>
    </form>
  );
}