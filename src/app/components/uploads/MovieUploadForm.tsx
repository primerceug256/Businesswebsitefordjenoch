import { useState } from "react";
import { Upload, Film, Loader } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

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
      // 1. Create the Premium Name (e.g. movies/premium-12345.mp4)
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `movies/premium-${Date.now()}.${fileExt}`;
      
      // 2. Upload to the HYPHENATED bucket ID
      const { error: uploadError } = await supabase.storage
        .from('primerce-fresh-hit-music') 
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;
      setProgress(70);

      // 3. Get the Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('primerce-fresh-hit-music')
        .getPublicUrl(fileName);

      // 4. Save to your 'movies' database table
      const { error: dbError } = await supabase
        .from('movies')
        .insert([{
          title: title || selectedFile.name,
          video_url: publicUrl,
          quality: "HD 1080p",
          release_year: new Date().getFullYear().toString()
        }]);

      if (dbError) throw dbError;

      alert("Premium Movie Published!");
      onSuccess();
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert("Upload Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="p-6 border-2 border-dashed rounded-3xl text-center bg-gray-50 border-red-100">
        <input 
          type="file" 
          accept="video/*" 
          onChange={e => setSelectedFile(e.target.files?.[0] || null)} 
          className="hidden" 
          id="movie-upload-premium" 
        />
        <label htmlFor="movie-upload-premium" className="cursor-pointer block">
          <Film className="mx-auto mb-2 text-red-600 w-10 h-10" />
          <p className="font-bold text-gray-900">
            {selectedFile ? selectedFile.name : "Select Movie (MP4/AVI)"}
          </p>
        </label>
      </div>

      <input 
        placeholder="Enter Movie Title" 
        className="w-full p-4 bg-gray-100 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-red-500" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        required 
      />

      <button 
        disabled={uploading || !selectedFile} 
        className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-black uppercase shadow-lg shadow-red-600/30 transition-all"
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader className="animate-spin w-5 h-5" />
            Uploading {progress}%
          </div>
        ) : (
          "Publish Premium Movie"
        )}
      </button>
    </form>
  );
}