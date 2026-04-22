import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function MusicUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'audio' | 'video'>('audio');
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

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      setMessage({ type: 'error', text: 'Please select a file and enter a title' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('type', type === 'audio' ? 'Audio' : 'Video');
      formData.append('mediaType', type);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/make-server-98d801c7/music/upload`,
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

      setMessage({ type: 'success', text: 'Music uploaded successfully!' });
      setFile(null);
      setTitle('');
      setType('audio');
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
        <h2 className="text-3xl font-bold mb-2">Music Upload</h2>
        <p className="text-gray-400">Upload music tracks - audio files and music videos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">Song Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter song title"
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-orange-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Media Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="audio"
                  checked={type === 'audio'}
                  onChange={() => setType('audio')}
                  className="w-4 h-4"
                />
                <span>Audio File (MP3, WAV, etc.)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="video"
                  checked={type === 'video'}
                  onChange={() => setType('video')}
                  className="w-4 h-4"
                />
                <span>Music Video (MP4, etc.)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Select File</label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-orange-600 transition-colors cursor-pointer">
              <input
                type="file"
                onChange={handleFileSelect}
                accept={type === 'audio' ? 'audio/*' : 'video/*'}
                className="hidden"
                id="music-file"
              />
              <label htmlFor="music-file" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={32} className="text-gray-500" />
                <p className="font-semibold">{file ? file.name : 'Click to upload'}</p>
                {file && <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
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
            disabled={uploading || !file || !title.trim()}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Music'}
          </button>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Audio File Requirements</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Supported formats: MP3, WAV, FLAC, AAC</li>
              <li>• Maximum size: 500 MB</li>
              <li>• Recommended bitrate: 320 kbps</li>
              <li>• Sample rate: 44.1 kHz or higher</li>
            </ul>
          </div>

          <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Music Video Requirements</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Supported formats: MP4, MOV, AVI</li>
              <li>• Maximum size: 2 GB</li>
              <li>• Resolution: 1080p (1920x1080) minimum</li>
              <li>• Codec: H.264 video, AAC audio</li>
              <li>• Frame rate: 24fps or higher</li>
            </ul>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Tips for Success</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>✓ Use descriptive song titles</li>
              <li>✓ Ensure good audio quality</li>
              <li>✓ Test files before uploading</li>
              <li>✓ Keep file sizes reasonable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
