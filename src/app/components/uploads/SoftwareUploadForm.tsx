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
      // 1. Generate unique file name
      const fileName = `${Date.now()}-${selectedFile.name.replace(/\s/g, '_')}`;
      
      // 2. Upload to the SOFTWARE bucket
      const { error: uploadError } = await supabase.storage
        .from('make-98d801c7-software')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;
      setProgress(70);

      // 3. Get the link
      const { data: { publicUrl } } = supabase.storage
        .from('make-98d801c7-software')
        .getPublicUrl(fileName);

      // 4. Save to Database Table
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
      console.error(err);
      alert("Error: " + err.message + ". Make sure you created the 'make-98d801c7-software' bucket in Supabase.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="p-6 border-2 border-dashed rounded-2xl text-center bg-gray-50">
        <input 
          type="file" 
          onChange={e => setSelectedFile(e.target.files?.[0] || null)} 
          className="hidden" 
          id="soft-upload-input" 
        />
        <label htmlFor="soft-upload-input" className="cursor-pointer block">
          <Package className="mx-auto mb-2 text-orange-600 w-8 h-8" />
          <p className="text-xs font-bold text-gray-900">
            {selectedFile ? selectedFile.name : "Tap to Select Software File"}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">EXE, ZIP or RAR</p>
        </label>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Software Name</label>
        <input 
          placeholder="e.g. Virtual DJ Pro 2026" 
          className="w-full p-4 bg-gray-100 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-orange-500" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
        />
      </div>

      <button 
        disabled={uploading || !selectedFile} 
        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-black uppercase shadow-lg shadow-orange-600/30 transition-all"
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader className="animate-spin w-4 h-4" />
            Uploading... {progress}%
          </div>
        ) : (
          "Publish to Store (5,500 UGX)"
        )}
      </button>
    </form>
  );
}