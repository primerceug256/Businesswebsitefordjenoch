import { useState } from "react";
import { Upload, Film, Loader, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB in bytes

interface UploadFormData {
  title: string;
  description: string;
  genre: string;
  duration: string;
  releaseYear: string;
  quality: string;
}

export function MovieUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    description: "",
    genre: "Action",
    duration: "",
    releaseYear: new Date().getFullYear().toString(),
    quality: "1080p",
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
      if (!file.type.startsWith("video/")) {
        setError("Please select a video file (MP4, MKV, AVI, etc.)");
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
      formDataToSend.append("description", formData.description);
      formDataToSend.append("genre", formData.genre);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("releaseYear", formData.releaseYear);
      formDataToSend.append("quality", formData.quality);

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

      xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/movies/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
      xhr.send(formDataToSend);
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to upload movie";
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
            <p className="text-green-700 text-sm">Movie uploaded and ready for download.</p>
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
          <label className="block text-gray-900 font-semibold mb-3">Video File *</label>
          <div className="relative">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              id="movie-file"
              disabled={uploading}
            />
            <label
              htmlFor="movie-file"
              className={`block w-full p-6 border-2 border-dashed ${
                selectedFile ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"
              } rounded-lg cursor-pointer hover:border-red-400 transition-colors text-center`}
            >
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <Film className="w-6 h-6 text-red-600" />
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
                  <p className="text-gray-900">Click to select video file</p>
                  <p className="text-gray-600 text-sm mt-1">MP4, MKV, AVI, or other formats (max 5GB)</p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="movie-title" className="block text-gray-900 font-semibold mb-2">
            Movie Title *
          </label>
          <input
            type="text"
            id="movie-title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
            placeholder="e.g., Action Movie 2026"
            disabled={uploading}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="movie-description" className="block text-gray-900 font-semibold mb-2">
            Description
          </label>
          <textarea
            id="movie-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none resize-none"
            rows={3}
            placeholder="Brief description of the movie..."
            disabled={uploading}
          />
        </div>

        {/* Genre & Quality */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="movie-genre" className="block text-gray-900 font-semibold mb-2">
              Genre
            </label>
            <input
              type="text"
              id="movie-genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
              placeholder="e.g., Action, Comedy"
              disabled={uploading}
            />
          </div>
          <div>
            <label htmlFor="movie-quality" className="block text-gray-900 font-semibold mb-2">
              Quality
            </label>
            <select
              id="movie-quality"
              value={formData.quality}
              onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
              disabled={uploading}
            >
              <option value="480p">480p</option>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
              <option value="4K">4K</option>
            </select>
          </div>
        </div>

        {/* Duration & Release Year */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="movie-duration" className="block text-gray-900 font-semibold mb-2">
              Duration
            </label>
            <input
              type="text"
              id="movie-duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
              placeholder="e.g., 2h 15m"
              disabled={uploading}
            />
          </div>
          <div>
            <label htmlFor="movie-year" className="block text-gray-900 font-semibold mb-2">
              Release Year
            </label>
            <input
              type="text"
              id="movie-year"
              value={formData.releaseYear}
              onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
              placeholder="e.g., 2026"
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
                className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {uploading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Uploading... {uploadProgress}%
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload Movie
            </>
          )}
        </button>
      </form>
    </>
  );
}
