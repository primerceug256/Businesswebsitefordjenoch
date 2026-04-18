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
      // 1. Generate unique file name
      const fileName = `${Date.now()}-${selectedFile.name.replace(/\s/g, '_')}`;
      
      // 2. Upload to the MOVIE bucket
      const { error: uploadError } = await supabase.storage
        .from('make-98d801c7-movies')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;
      setProgress(70);

      // 3. Get the link
      const { data: { publicUrl } } = supabase.storage
        .from('make-98d801c7-movies')
        .getPublicUrl(fileName);

      // 4. Save to Database Table
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
    } catch (