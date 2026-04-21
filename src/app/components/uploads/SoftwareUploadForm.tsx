--- START OF FILE Businesswebsitefordjenoch-main/src/app/components/uploads/SoftwareUploadForm.tsx ---
import { useState } from "react";
import { projectId, publicAnonKey } from "../../../../utils/supabase/info";

export function SoftwareUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [prog, setProg] = useState(0);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", platform: "Windows", price: "0" });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true); 
    setErr(null); 
    setProg(0);

    const data = new FormData();
    data.append("file", file);
    data.append("title", form.title);
    data.append("platform", form.platform);
    data.append("price", form.price);
    data.append("category", form.platform === "Android" ? "App" : "Software");

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProg(Math.floor((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        setProg(100);
        setSuccess(true);
        setUploading(false);
        setFile(null);
        setTimeout(() => { onSuccess(); setSuccess(false); }, 2000);
      } else {
        setErr("Upload Error: " + xhr.status);
        setUploading(false);
      }
    };

    xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/software/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
    xhr.send(data);
  };

  return (
    <div className="space-y-4">
      {success && <div className="bg-green-600/20 text-green-400 p-3 rounded-lg border border-green-600/30 font-bold">Successfully Added!</div>}
      <form onSubmit={handleUpload} className="space-y-3">
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-xs" />
        <input placeholder="Name" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none" required />
        
        <div className="grid grid-cols-2 gap-2">
          <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <option>Windows</option><option>Android</option><option>iOS</option><option>macOS</option>
          </select>
          <input placeholder="Price (UGX)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="bg-slate-950 p-3 rounded-xl border border-slate-800" />
        </div>

        {uploading && (
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full" style={{ width: `${prog}%` }}></div>
          </div>
        )}

        <button type="submit" disabled={uploading || !file} className="w-full bg-orange-600 py-4 rounded-xl font-black uppercase text-white">
          {uploading ? `Processing ${prog}%` : "Publish App/Software"}
        </button>
      </form>
    </div>
  );
}