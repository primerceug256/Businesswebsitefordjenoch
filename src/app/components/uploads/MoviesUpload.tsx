import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const VJ_LIST = ['VJ Junior', 'VJ Jingo', 'VJ Emmy', 'VJ Kevo', 'VJ Ulio', 'VJ Shield', 'VJ Soul', 'VJ Banks', 'VJ Sammy', 'VJ HD', 'VJ Heavy Q', 'VJ Mark', 'VJ Ice P', 'VJ Kin', 'VJ Ham', 'VJ Mumba', 'VJ Nelly', 'VJ Zaid', 'VJ Kriss', 'VJ MK', 'VJ Uncle T', 'VJ Waza'];

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance', 'Science Fiction', 'Fantasy', 'Documentary', 'Animation'];

export default function MoviesUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Action');
  const [vj, setVj] = useState('VJ Junior');
  const [type, setType] = useState<'movie' | 'series'>('movie');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(null);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setThumbnail(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim() || !description.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields and select a file' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('genre', genre);
      formData.append('vj', vj);
      formData.append('type', type);
      if (thumbnail) formData.append('thumbnail', thumbnail);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/make-server-98d801c7/movies/upload`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${publicAnonKey}` },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || 'Upload failed');
      }

      setMessage({ type: 'success', text: 'Movie uploaded successfully!' });
      setFile(null);
      setThumbnail(null);
      setTitle('');
      setDescription('');
      setGenre('Action');
      setVj('VJ Junior');
      setType('movie');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Upload failed' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Movies & Series Upload</h2>
        <p className="text-gray-400">Upload movies and TV series content with metadata</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Movie or Series title"
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-orange-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter detailed description"
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-orange-600 outline-none resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-3">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:border-orange-600 outline-none"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3">VJ/Host</label>
              <select
                value={vj}
                onChange={(e) => setVj(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:border-orange-600 outline-none"
              >
                {VJ_LIST.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Content Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="movie"
                  checked={type === 'movie'}
                  onChange={() => setType('movie')}
                  className="w-4 h-4"
                />
                <span>Movie (Full Length)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="series"
                  checked={type === 'series'}
                  onChange={() => setType('series')}
                  className="w-4 h-4"
                />
                <span>Series (Episodes)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Video File *</label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-orange-600 transition-colors cursor-pointer">
              <input
                type="file"
                onChange={handleFileSelect}
                accept="video/*"
                className="hidden"
                id="movie-file"
              />
              <label htmlFor="movie-file" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={32} className="text-gray-500" />
                <p className="font-semibold">{file ? file.name : 'Click to upload'}</p>
                {file && <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Thumbnail (Optional)</label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-orange-600 transition-colors cursor-pointer">
              <input
                type="file"
                onChange={handleThumbnailSelect}
                accept="image/*"
                className="hidden"
                id="movie-thumbnail"
              />
              <label htmlFor="movie-thumbnail" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={24} className="text-gray-500" />
                <p className="text-sm">{thumbnail ? thumbnail.name : 'Upload thumbnail'}</p>
              </label>
            </div>
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {message && (
            <div
              className={`p-3 rounded-lg flex items-center justify-between ${
                message.type === 'success'
                  ? 'bg-green-600/20 border border-green-600/50 text-green-400'
                  : 'bg-red-600/20 border border-red-600/50 text-red-400'
              }`}
            >
              <span>{message.text}</span>
              <button onClick={() => setMessage(null)}>
                <X size={18} />
              </button>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || !file || !title.trim() || !description.trim()}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Movie/Series'}
          </button>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <div className="bg-pink-600/10 border border-pink-600/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Video File Requirements</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Supported formats: MP4, MOV, AVI, MKV</li>
              <li>• Maximum size: 5 GB</li>
              <li>• Resolution: 1080p (1920x1080) minimum</li>
              <li>• Codec: H.264 video, AAC audio</li>
              <li>• Frame rate: 24-30fps</li>
              <li>• Bitrate: 5-10 Mbps for quality</li>
            </ul>
          </div>

          <div className="bg-cyan-600/10 border border-cyan-600/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Thumbnail Requirements</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Format: JPG, PNG</li>
              <li>• Size: 500x750px (9:16 aspect ratio)</li>
              <li>• Maximum: 2 MB</li>
              <li>• High contrast and clear image</li>
            </ul>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Best Practices</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>✓ Use clear, descriptive titles</li>
              <li>✓ Write detailed descriptions</li>
              <li>✓ Choose appropriate genre</li>
              <li>✓ Assign correct VJ/Host</li>
              <li>✓ Upload high-quality thumbnail</li>
              <li>✓ Test video playback before uploading</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
