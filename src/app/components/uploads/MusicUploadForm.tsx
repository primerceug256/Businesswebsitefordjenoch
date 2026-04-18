import { useState } from "react";
import { Upload, Music, Loader, CheckCircle } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function MusicUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ title: "", duration: "" });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    setProgress(5); // Start progress

    try {
      // 1. Upload File Directly to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const bucketName = "make-98d801c7-music";
      
      const uploadUrl = `https://${projectId}.supabase.co/storage/v1/object/${bucketName}/${fileName}`;
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': selectedFile.type,
          'x-upsert': 'true'
        },
        body: selectedFile
      });

      if (!uploadResponse.ok) throw new Error("Storage upload failed");
      setProgress(70);

      // 2. Get the Public URL
      const publicUrl = `https://${projectId}.supabase.co/storage/v1/object/public/${bucketName}/${fileName}`;

      // 3. Save the Metadata (Title, Duration) to your database
      const metadataResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title || selectedFile.name,
          type: "Latest Mix",
          duration: formData.duration || "00:00",
          audioUrl: publicUrl,
          fileName: fileName
        })
      });

      if (metadataResponse.ok) {
        setProgress(100);
        alert("Upload Successful!");
        onSuccess();
        window.location.reload();
      } else {
        throw new Error("Metadata save failed");
      }

    } catch (err) {
      console.error(err);
      alert("Upload failed. Please ensure you ran the SQL script in Step 1.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="p-6 border-2 border-dashed rounded-xl text-center bg-gray-50 hover:bg-purple-50 transition-colors">
        <input 
          type="file" 
          accept="audio/*" 
          onChange={e => setSelectedFile(e.target.files?.[0] || null)} 
          className="hidden" 
          id="music-upload-field" 
        />
        <label htmlFor="music-upload-field" className="cursor-pointer block">
          <Upload className="mx-auto mb-2 text-purple-600 w-8 h-8" />
          <p className="font-medium text-gray-900">
            {selectedFile ? selectedFile.name : "Select DJ Mix (No size limit)"}
          </p>
          <p className="text-xs text-gray-500 mt-1">MP3, WAV, or M4A</p>
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Track Title</label>
        <input 
          required 
          placeholder="e.g. DJ ENOCH - DANCEHALL VOL 3" 
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Duration (Optional)</label>
        <input 
          placeholder="e.g. 1:20:00" 
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
          value={formData.duration} 
          onChange={e => setFormData({...formData, duration: e.target.value})} 
        />
      </div>

      <button 
        disabled={uploading || !selectedFile} 
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold disabled:opacity-50 shadow-lg transition-all"
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader className="animate-spin w-5 h-5" />
            Uploading... {progress}%
          </div>
        ) : (
          "Publish Mix Now"
        )}
      </button>
    </form>
  );
}