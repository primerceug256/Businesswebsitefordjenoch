import { useState } from "react";
import { Upload, Package, Loader, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB in bytes

interface UploadFormData {
  title: string;
  description: string;
  version: string;
  platform: string;
  category: string;
  price: string;
}

export function SoftwareUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    description: "",
    version: "1.0",
    platform: "Windows",
    category: "Software",
    price: "15000",
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
      formDataToSend.append("version", formData.version);
      formDataToSend.append("platform", formData.platform);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("price", formData.price);

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

      xhr.open("POST", `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/software/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${publicAnonKey}`);
      xhr.send(formDataToSend);
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to upload software";
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
            <p className="text-green-700 text-sm">Software uploaded and ready for sale.</p>
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
          <label className="block text-gray-900 font-semibold mb-3">Software File *</label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="software-file"
              disabled={uploading}
            />
            <label
              htmlFor="software-file"
              className={`block w-full p-6 border-2 border-dashed ${
                selectedFile ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-gray-50"
              } rounded-lg cursor-pointer hover:border-orange-400 transition-colors text-center`}
            >
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <Package className="w-6 h-6 text-orange-600" />
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
                  <p className="text-gray-900">Click to select software file</p>
                  <p className="text-gray-600 text-sm mt-1">EXE, ZIP, RAR, or other formats (max 5GB)</p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="software-title" className="block text-gray-900 font-semibold mb-2">
            Software Name *
          </label>
          <input
            type="text"
            id="software-title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
            placeholder="e.g., DJ Software Pro 2026"
            disabled={uploading}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="software-description" className="block text-gray-900 font-semibold mb-2">
            Description
          </label>
          <textarea
            id="software-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none resize-none"
            rows={3}
            placeholder="Brief description of the software..."
            disabled={uploading}
          />
        </div>

        {/* Version & Platform */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="software-version" className="block text-gray-900 font-semibold mb-2">
              Version
            </label>
            <input
              type="text"
              id="software-version"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
              placeholder="e.g., 1.0"
              disabled={uploading}
            />
          </div>
          <div>
            <label htmlFor="software-platform" className="block text-gray-900 font-semibold mb-2">
              Platform
            </label>
            <select
              id="software-platform"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
              disabled={uploading}
            >
              <option value="Windows">Windows</option>
              <option value="Mac">Mac</option>
              <option value="Linux">Linux</option>
              <option value="Android">Android</option>
              <option value="iOS">iOS</option>
              <option value="Cross-platform">Cross-platform</option>
            </select>
          </div>
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="software-category" className="block text-gray-900 font-semibold mb-2">
              Category
            </label>
            <input
              type="text"
              id="software-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
              placeholder="e.g., DJ Software"
              disabled={uploading}
            />
          </div>
          <div>
            <label htmlFor="software-price" className="block text-gray-900 font-semibold mb-2">
              Price (UGX)
            </label>
            <input
              type="text"
              id="software-price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
              placeholder="e.g., 15000"
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
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {uploading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Uploading... {uploadProgress}%
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload Software
            </>
          )}
        </button>
      </form>
    </>
  );
}
