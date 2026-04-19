import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Upload, Music, Film, Download } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [uploadType, setUploadType] = useState<'music' | 'movies' | 'software'>('music');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) navigate('/');
  }, [user, isAdmin, navigate]);

  const handleUpload = async () => {
    if (!file || !title) {
      alert('Please select a file and enter a title');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      const endpoint = uploadType === 'music' ? 'music/upload' : uploadType === 'movies' ? 'movies/upload' : 'software/upload';
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/${endpoint}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${publicAnonKey}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Upload failed');
      alert('Uploaded successfully!');
      setTitle('');
      setFile(null);
    } catch (error) {
      alert('Upload failed. Check your connection.');
    } finally {
      setUploading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Admin Upload Center</h1>
        <div className="bg-gray-900 p-8 rounded-2xl space-y-6">
          <div className="flex gap-4">
            <button onClick={() => setUploadType('music')} className={`flex-1 py-2 rounded ${uploadType === 'music' ? 'bg-orange-600' : 'bg-gray-800'}`}>Music</button>
            <button onClick={() => setUploadType('movies')} className={`flex-1 py-2 rounded ${uploadType === 'movies' ? 'bg-orange-600' : 'bg-gray-800'}`}>Movie</button>
            <button onClick={() => setUploadType('software')} className={`flex-1 py-2 rounded ${uploadType === 'software' ? 'bg-orange-600' : 'bg-gray-800'}`}>Software</button>
          </div>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 p-3 rounded"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full bg-gray-800 p-3 rounded"
          />

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-orange-600 py-4 rounded font-bold hover:bg-orange-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Start Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}