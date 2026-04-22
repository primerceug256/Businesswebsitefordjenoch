import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const PLATFORMS = ['Windows', 'macOS', 'Linux', 'Android', 'iOS', 'Web'];
const LICENSE_TYPES = ['Free', 'Trial', 'Premium', 'Enterprise'];

export default function SoftwareUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('Windows');
  const [version, setVersion] = useState('1.0');
  const [licenseType, setLicenseType] = useState('Free');
  const [price, setPrice] = useState('0');
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
      formData.append('platform', platform);
      formData.append('version', version);
      formData.append('licenseType', licenseType);
      formData.append('price', price);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/make-server-98d801c7/software/upload`,
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

      setMessage({ type: 'success', text: 'Software uploaded successfully!' });
      setFile(null);
      setTitle('');
      setDescription('');
      setPlatform('Windows');
      setVersion('1.0');
      setLicenseType('Free');
      setPrice('0');
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
        <h2 className="text-3xl font-bold mb-2">Software Upload</h2>
        <p className="text-gray-400">Upload software, applications, and tools for distribution</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">Software Name *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Application name"
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-orange-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe features, requirements, and usage"
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-orange-600 outline-none resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-3">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:border-orange-600 outline-none"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3">Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. 1.0"
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-orange-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-3">License Type</label>
              <select
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:border-orange-600 outline-none"
              >
                {LICENSE_TYPES.map((lt) => (
                  <option key={lt} value={lt}>{lt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3">Price (UGX)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0 for free"
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-orange-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">File (ZIP/EXE/DMG) *</label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-orange-600 transition-colors cursor-pointer">
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".zip,.exe,.dmg,.apk,.ipa,.tar.gz"
                className="hidden"
                id="software-file"
              />
              <label htmlFor="software-file" className="cursor-pointer flex flex-col items-center gap-2">
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
            disabled={uploading || !file || !title.trim() || !description.trim()}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Software'}
          </button>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <div className="bg-cyan-600/10 border border-cyan-600/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">File Requirements</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Windows: ZIP or EXE installer</li>
              <li>• macOS: DMG or ZIP archive</li>
              <li>• Linux: TAR.GZ or DEB packages</li>
              <li>• Android: APK file</li>
              <li>• iOS: IPA file (zipped)</li>
              <li>• Maximum size: 1 GB</li>
            </ul>
          </div>

          <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Licensing Options</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="font-semibold">Free:</span> No cost, open access</li>
              <li>• <span className="font-semibold">Trial:</span> Limited time access</li>
              <li>• <span className="font-semibold">Premium:</span> Full features paid</li>
              <li>• <span className="font-semibold">Enterprise:</span> Custom licensing</li>
            </ul>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Before Uploading</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>✓ Test software on target platform</li>
              <li>✓ Ensure virus scan passes</li>
              <li>✓ Document system requirements</li>
              <li>✓ Include installation instructions</li>
              <li>✓ Check for updates/patches</li>
              <li>✓ Verify license compliance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
