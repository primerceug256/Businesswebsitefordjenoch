import { useState } from "react";
import { Upload, Package, Loader } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

export function SoftwareUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    setProgress(10);

    try {
      const fileName = `software/${Date.now()}-${selectedFile.name.replace(/\s/g, '_')}`;
      
      const { error: uploadError } = await supabase.storage
        .from('make-98d801c7-music')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;
      setProgress(70);

      const { data: { publicUrl } } = supabase.storage
        .from('make-98d801c7-music')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('software')
        .insert([{
          title: title || selectedFile.name,
          download_url: publicUrl,
          price: "5500",
          platform: "Windows/PC"
        }]);

      if (dbError) throw dbError;
      alert("Software Published Successfully!");
      onSuccess();
      window.location.reload();
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally { setUploading(false); }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="p-6 border-2 border-dashed rounded-2xl text-center bg-gray-50">
        <input type="file" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="hidden" id="soft-up" />
        <label htmlFor="soft-up" className="cursor-pointer block">
          <Package className="mx-auto mb-2 text-orange-600 w-8 h-8" />
          <p className="text-xs font-bold text-gray-900">{selectedFile ? selectedFile.name : "Select Software"}</p>
        </label>
      </div>
      <input placeholder="Software Name" className="w-full p-4 bg-gray-100 rounded-xl font-bold" value={title} onChange={e => setTitle(e.target.value)} required />
      <button disabled={uploading || !selectedFile} className="w-full bg-orange-600 text-white py-4 rounded-xl font-black uppercase">
        {uploading ? `Uploading... ${progress}%` : "Publish Software"}
      </button>
    </form>
  );
}