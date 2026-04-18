import { useState } from "react";
import { Upload, Film, Loader } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

export function MovieUploadForm({ onSuccess }: { onSuccess: () => void }) {
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
      const fileName = `${Date.now()}-${selectedFile.name.replace(/\s/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('make-98d801c7-movies')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;
      setProgress(60);

      const { data: { publicUrl } } = supabase.storage
        .from('make-98d801c7-movies')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('movies')
        .insert([{
          title: title || selectedFile.name,
          video_url: publicUrl,
          quality: "HD 1080p",
          release_year: new Date().getFullYear().toString()
        }]);

      if (dbError) throw dbError;
      alert("Movie Published Successfully!");
      onSuccess();
      window.location.reload();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally { setUploading(false); }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="p-6 border-2 border-dashed rounded-2xl text-center bg-gray-50">
        <input type="file" accept="video/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="hidden" id="mov-file" />
        <label htmlFor="mov-file" className="cursor-pointer block">
          <Film className="mx-auto mb-2 text-red-600" />
          <p className="text-xs font-bold text-gray-500">{selectedFile ? selectedFile.name : "Select Movie File"}</p>
        </label>
      </div>
      <input placeholder="Movie Title" className="w-full p-4 bg-gray-100 rounded-xl font-bold" value={title} onChange={e => setTitle(e.target.value)} required />
      <button disabled={uploading || !selectedFile} className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase">
        {uploading ? `Uploading... ${progress}%` : "Publish Movie"}
      </button>
    </form>
  );
}