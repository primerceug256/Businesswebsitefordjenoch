import { useState } from "react";
import { Upload, Music, Loader, CheckCircle } from "lucide-react";
import { projectId, publicAnonKey } from "../../../../utils/supabase/info";

export function MusicUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [prog, setProg] = useState(0);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setProg(0);

    const data = new FormData();
    data.append("file", selectedFile);
    data.append("title", title);
    data.append("mediaType", "audio");

    const xhr = new XMLHttpRequest();
    
    // PROGRESS TRACKER 0 to 100
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProg(Math.floor((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        onSuccess();
        setUploading(false);
        setSelectedFile(null);
      } else {
        alert("Upload Failed");
        setUploading(false);
      }
    };

    xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/music/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
    xhr.send(data);
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <