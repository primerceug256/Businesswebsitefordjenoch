import { useState } from "react";
import { Upload, Music, Loader, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB in bytes

interface UploadFormData {
  title: string;
  artist: string;
  genre: string;
  duration: string;
  releaseDate: string;
}

export function MusicUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<UploadFormData>({
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size exceeds 5GB limit. Selected file: ${(file.size / 1024 / 1024 / 1024).toFixed(2)}GB`);
        setSelectedFile(null);
        return;
      }
      if (!file.type.startsWith("audio/")) {
        setError("Please select an audio file (MP3, WAV, etc.)");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
      if (!formData.title) {
        setFormData({ ...formData, title: file.name.replace(/\.[^/.]+$/, "") });
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", selectedFile);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("artist", formData.artist);
      formDataToSend.append("genre", formData.genre);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("releaseDate", formData.releaseDate);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(progress));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          console.log("Upload successful:", data);
          setUploadSuccess(true);
          setTimeout(() => {
            onSuccess();
            window.location.reload();
          }, 2000);
        } else {
          const data = JSON.parse(xhr.responseText);
          throw new Error(data.error || "Upload failed");
        }
      });

      xhr.addEventListener("error", () => {
        throw new Error("Network error during upload");
      });

      xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
      xhr.send(formDataToSend);
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to upload music";
      setError(`Upload failed: ${errorMessage}`);
      setUploading(false);
    }
  };

  return (
    <>
      {uploadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3"
        >
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-green-800 font-semibold">Upload Successful!</p>
            <p className="text-green-700 text-sm">Music track uploaded and ready for download.</p>
          </div>
        </motion.div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-6">
        {/* File Input */}
        <div>
          <label className="block text-gray-900 font-semibold mb-3">Audio File *</label>
          <div className="relative">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
              id="music-file"
              disabled={uploading}
            />
            <label
              htmlFor="music-file"
              className={`block w-full p-6 border-2 border-dashed ${
                selectedFile ? "border-purple-500 bg-purple-50" : "border-gray-300 bg-gray-50"
              } rounded-lg cursor-pointer hover:border-purple-400 transition-colors text-center`}
            >
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <Music className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <p className="text-gray-900 font-semibold">{selectedFile.name}</p>
                    <p className="text-gray-600 text-sm">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-900">Click to select audio file</p>
                  <p className="text-gray-600 text-sm mt-1">MP3, WAV, or other formats (max 5GB)</p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="music-title" className="block text-gray-900 font-semibold mb-2">
            Track Title *
          </label>
          <input
            type="text"
            id="music-title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
            placeholder="e.g., PRIMERCE FRESH HITS #2026"
            disabled={uploading}
          />
        </div>

        {/* Artist & Genre */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="music-artist" className="block text-gray-900 font-semibold mb-2">
              Artist
            </label>
            <input
              type="text"
              id="music-artist"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              disabled={uploading}
            />
          </div>
          <div>
            <label htmlFor="music-genre" className="block text-gray-900 font-semibold mb-2">
              Genre
            </label>
            <input
              type="text"
              id="music-genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              placeholder="e.g., Dance, Hip Hop"
              disabled={uploading}
            />
          </div>
        </div>

        {/* Duration & Release Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="music-duration" className="block text-gray-900 font-semibold mb-2">
              Duration
            </label>
            <input
              type="text"
              id="music-duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              placeholder="e.g., 45:30"
              disabled={uploading}
            />
          </div>
          <div>
            <label htmlFor="music-date" className="block text-gray-900 font-semibold mb-2">
              Release Date
            </label>
            <input
              type="date"
              id="music-date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              disabled={uploading}
            />
          </div>
        </div>

        {/* Progress Bar */}
        {uploading && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {uploading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Uploading... {uploadProgress}%
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload Music
            </>
          )}
        </button>
      </form>
    </>
  );
}
"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/info";

export default function MusicUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    if (!title || !artist) {
      alert("Please fill all fields");
      return;
    }

    // 🚫 Prevent your main issue
    if (file.size > 50 * 1024 * 1024) {
      alert("File too large. Max 50MB");
      return;
    }

    setUploading(true);
    setProgress(10);

    const filePath = `tracks/${Date.now()}-${file.name}`;

    try {
      // Upload file
      const { data, error } = await supabase.storage
        .from("music")
        .upload(filePath, file);

      if (error) throw error;

      setProgress(70);

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from("music")
        .getPublicUrl(filePath);

      setProgress(85);

      // Save metadata (if you have a table like "music")
      const { error: dbError } = await supabase.from("music").insert([
        {
          title,
          artist,
          file_url: publicUrl.publicUrl,
        },
      ]);

      if (dbError) throw dbError;

      setProgress(100);

      alert("Upload successful!");

      // Reset form
      setFile(null);
      setTitle("");
      setArtist("");
      setProgress(0);

    } catch (err: any) {
      console.error(err.message);
      alert("Upload failed. Check network or file size.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-xl">
      <h2 className="text-xl font-bold mb-4">Upload Music</h2>

      <input
        type="text"
        placeholder="Song Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block w-full p-2 mb-3 text-black"
      />

      <input
        type="text"
        placeholder="Artist Name"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        className="block w-full p-2 mb-3 text-black"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-3"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {/* Progress Bar */}
      {uploading && (
        <div className="w-full bg-gray-700 mt-4 rounded">
          <div
            className="bg-green-500 text-center text-sm p-1"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
}