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
      // 1. Get the extension (mp4, mkv, etc)
      const fileExt = selectedFile.name.split('.').pop();
      
      // 2. Use your "premium" naming style inside the movies folder
      // This will look like: movies/premium-1713421000.mp4
      const fileName = `movies/premium-${Date.now()}.${fileExt}`;
      
      // 3. Upload to the specific bucket you requested
      const { error: uploadError } = await supabase.storage
        .from('primerce fresh hit music') 
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;
      setProgress(70);

      // 4. Get the public link
      const { data: { publicUrl } } = supabase.storage
        .from('primerce fresh hit music')
        .getPublicUrl(fileName);

      // 5. Save metadata to your 'movies' table
      const { error: dbError } = await supabase
        .from('movies')
        .insert([{
          title: title || selectedFile.name,
          video_url: publicUrl,
          quality: "HD",
          release_year: new Date().getFullYear().toString()
        }]);

      if (dbError) throw dbError;

      alert("Movie Published as Premium!");
      onSuccess();
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message + ". Check if bucket name matches exactly.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="p-6 border-2 border-dashed rounded-2xl text-center bg-gray-50">
        <input 
          type="file" 
          accept="video/*" 
          onChange={e => setSelectedFile(e.target.files?.[0] || null)} 
          className="hidden" 
          id="mov-up-premium" 
        />
        <label htmlFor="mov-up-premium" className="cursor-pointer block">
          <Film className="mx-auto mb-2 text-red-600 w-8 h-8" />
          <p className="text-xs font-bold text-gray-900">
            {selectedFile ? selectedFile.name : "Select Premium Movie"}
          </p>
        </label>
      </div>

      <input 
        placeholder="Movie Title" 
        className="w-full p-4 bg-gray-100 rounded-xl font-bold border-2 border-transparent focus:border-red-500 outline-none" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        required 
      />

      <button 
        disabled={uploading || !selectedFile} 
        className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase shadow-lg shadow-red-600/30 transition-all"
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader className="animate-spin w-4 h-4" />
            Uploading Premium... {progress}%
          </div>
        ) : (
          "Publish Premium Movie"
        )}
      </button>
    </form>
  );
}