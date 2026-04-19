import { useState } from "react";
import { Upload, Package, Loader, CheckCircle } from "lucide-react";
import { projectId, publicAnonKey } from "../../../../utils/supabase/info";

export function SoftwareUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [prog, setProg] = useState(0);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", platform: "Windows", price: "15000" });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true); setErr(null); setProg(0);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("title", form.title);
      data.append("platform", form.platform);
      data.append("price", form.price);
      data.append("category", "Software");

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) setProg(Math.round((e.loaded / e.total) * 100));
      });
      xhr.addEventListener("load", () => {
        if (xhr.status === 200 || xhr.status === 201) {
          setSuccess(true); setUploading(false); setFile(null);
          setTimeout(() => { onSuccess(); setSuccess(false); }, 3000);
        } else {
          setErr("Upload failed on server"); setUploading(false);
        }
      });
      xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/software/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
      xhr.send(data);
    } catch (ex) { setErr("Network error"); setUploading(false); }
  };

  return (
    <div className="space-y-4 text-white">
      {success && <div className="bg-green-600/20 text-green-400 p-3 rounded-lg flex items-center gap-2 border border-green-600/30 text-sm"><CheckCircle size={16} /> Software Added!</div>}
      {err && <div className="bg-red-600/20 text-red-400 p-3 rounded-lg border border-red-600/30 text-sm">{err}</div>}
      <form onSubmit={handleUpload} className="space-y-3">
        <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center bg-slate-900/50">
          <input type="file" onChange={(e) => { const f = e.target.files?.[0]; if(f){ setFile(f); setForm({...form, title: f.name.split('.')[0]}); } }} className="hidden" id="sw-file" />
          <label htmlFor="sw-file" className="cursor-pointer">{file ? <p className="text-orange-400 font-bold truncate">{file.name}</p> : <div className="flex flex-col items-center opacity-50"><Upload size={20}/><p className="text-[10px] uppercase font-black">Select File</p></div>}</label>
        </div>
        <input type="text" placeholder="Software Name" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm outline-none focus:border-orange-600" required />
        <div className="grid grid-cols-2 gap-2">
          <select value={form.platform} onChange={(e) => setForm({...form, platform: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm outline-none">
            <option>Windows</option><option>Android</option><option>macOS</option>
          </select>
          <input type="text" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm outline-none" />
        </div>
        <button type="submit" disabled={uploading || !file} className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black py-3 rounded-lg transition-all text-sm uppercase flex items-center justify-center gap-2">
          {uploading ? <><Loader size={16} className="animate-spin" /> {prog}%</> : "Add Software"}
        </button>
      </form>
    </div>
  );
}