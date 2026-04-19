import { useState } from "react";
import { Upload, Music, Loader, CheckCircle } from "lucide-react";
import { projectId, publicAnonKey } from "../../../../utils/supabase/info";

export function MusicUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    artist: "DJ ENOCH PRO",
    genre: "Mix",
    duration: "",
    releaseDate: new Date().toISOString().split("T")[0],
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
      data.append("artist", formData.artist);
      data.append("genre", formData.genre);
      data.append("duration", formData.duration);
      data.append("releaseDate", formData.releaseDate);
      data.append("mediaType", "audio"); 

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200 || xhr.status === 201) {
          setUploadSuccess(true);
          setUploading(false);
          setSelectedFile(null);
          setFormData({ ...formData, title: "" });
          setTimeout(() => {
            onSuccess();
            setUploadSuccess(false);
          }, 3000);
        } else {
          try {
            const response = JSON.parse(xhr.responseText || "{}");
            setError(response.error || "Upload failed on server.");
          } catch (err) {
            setError("Server error during processing.");
          }
          setUploading(false);
        }
      });

      xhr.addEventListener("error", () => {
        setError("Network failed. Check your connection.");
        setUploading(false);
      });

      xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
      xhr.send(data);
    } catch (err) {
      setError("An unexpected error occurred.");
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {uploadSuccess && (
        <div className="bg-green-600/20 text-green-400 p-3 rounded-lg flex items-center gap-2 border border-green-600/30 text-sm">
          <CheckCircle size={16} /> Mix Uploaded Successfully!
        </div>
      )}
      
      {error && (
        <div className="bg-red-600/20 text-red-400 p-3 rounded-lg border border-red-600/30 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-3 text-white">
        <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center hover:border-purple-500 transition-colors">
            <input 
              type="file" 
              accept="audio/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if(file) {
                  setSelectedFile(file);
                  if(!formData.title) setFormData({...formData, title: file.name.split('.')[0]});
                }
              }} 
              className="hidden" 
              id="music-upload-input"
            />
            <label htmlFor="music-upload-input" className="cursor-pointer">
                {selectedFile ? (
                    <p className="text-purple-400 font-bold truncate px-2">{selectedFile.name}</p>
                ) : (
                    <div className="flex flex-col items-center gap-2 opacity-50">
                        <Upload size={24} />
                        <p className="text-xs uppercase font-black tracking-tighter">Click to select MP3</p>
                    </div>
                )}
            </label>
        </div>
        
        <input
          type="text"
          placeholder="Mix Title (e.g. Vol 4 Dancehall)"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm outline-none focus:border-purple-600"
          required
        />

        <button
          type="submit"
          disabled={uploading || !selectedFile}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-800 text-white font-black py-3 rounded-lg transition-all text-sm uppercase tracking-tighter flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader size={16} className="animate-spin" />
              {uploadProgress}%
            </>
          ) : (
            "Upload Mix"
          )}
        </button>
      </form>
    </div>
  );
}