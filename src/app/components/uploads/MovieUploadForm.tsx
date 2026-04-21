import { useState } from "react";
import { Film, CheckCircle } from "lucide-react";
import { projectId, publicAnonKey } from "../../../../utils/supabase/info";

export function MovieUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [prog, setProg] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true); setProg(0);

    const data = new FormData();
    data.append("file", selectedFile);
    data.append("title", title);
    data.append("quality", "HD");

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProg(Math.floor((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        setProg(100);
        setSuccess(true);
        setUploading(false);
        setTimeout(() => { onSuccess(); setSuccess(false); }, 2000);
      } else {
        setUploading(false);
        alert("Upload failed");
      }
    };

    xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/movies/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
    xhr.send(data);
  };

  return (
    <div className="space-y-4">
      {success && <div className="bg-red-600 text-white p-3 rounded-lg font-bold">MOVIE UPLOADED!</div>}
      <form onSubmit={handleUpload} className="space-y-3">
        <input type="file" accept="video/*" onChange={e => {
            const f = e.target.files?.[0];
            if(f) { setSelectedFile(f); setTitle(f.name.split('.')[0]); }
        }} className="w-full text-xs text-slate-400" />
        <input placeholder="Movie Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" required />
        
        {uploading && (
          <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
            <div className="bg-red-600 h-full" style={{ width: `${prog}%` }}></div>
          </div>
        )}

        <button type="submit" disabled={uploading || !selectedFile} className="w-full bg-red-600 py-4 rounded-xl font-black uppercase text-white">
          {uploading ? `UPLOADING ${prog}%` : "UPLOAD MOVIE"}
        </button>
      </form>
    </div>
  );
}