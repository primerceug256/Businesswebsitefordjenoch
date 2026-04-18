import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Upload, Trash2, Users, DollarSign, Music, Film, Download, Check, X } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'manage' | 'payments'>('overview');
  const [stats, setStats] = useState({ users: 0, movies: 0, music: 0, revenue: 0 });
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);

  // Upload states
  const [uploadType, setUploadType] = useState<'music' | 'movies' | 'software'>('music');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Music upload fields
  const [musicTitle, setMusicTitle] = useState('');
  const [musicType, setMusicType] = useState<'audio' | 'video'>('audio');

  // Movie upload fields
  const [movieTitle, setMovieTitle] = useState('');
  const [movieDescription, setMovieDescription] = useState('');
  const [movieGenre, setMovieGenre] = useState('Action');
  const [movieVJ, setMovieVJ] = useState('VJ Junior');
  const [movieType, setMovieType] = useState<'movie' | 'series'>('movie');
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  // Software upload fields
  const [softwareTitle, setSoftwareTitle] = useState('');
  const [softwareDescription, setSoftwareDescription] = useState('');
  const [softwarePlatform, setSoftwarePlatform] = useState('Windows');

  const VJ_LIST = ['VJ Junior', 'VJ Jingo', 'VJ Emmy', 'VJ Kevo', 'VJ Ulio', 'VJ Shield', 'VJ Soul', 'VJ Banks', 'VJ Sammy', 'VJ HD', 'VJ Heavy Q', 'VJ Mark', 'VJ Ice P', 'VJ Kin', 'VJ Ham', 'VJ Mumba', 'VJ Nelly', 'VJ Zaid', 'VJ Kriss', 'VJ MK', 'VJ Uncle T', 'VJ Waza'];

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }
    fetchStats();
    fetchPendingPayments();
  }, [user, isAdmin, navigate]);

  const fetchStats = async () => {
    // Fetch admin stats
    setStats({ users: 125, movies: 450, music: 320, revenue: 15000000 });
  };

  const fetchPendingPayments = async () => {
    // Fetch pending payment approvals
    setPendingPayments([]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      if (uploadType === 'music') {
        formData.append('title', musicTitle);
        formData.append('type', musicType === 'audio' ? 'Audio' : 'Video');
        formData.append('mediaType', musicType);

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/upload`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${publicAnonKey}` },
            body: formData,
          }
        );

        if (!response.ok) throw new Error('Upload failed');
        alert('Music uploaded successfully!');
        setMusicTitle('');
        setFile(null);
      } else if (uploadType === 'movies') {
        formData.append('title', movieTitle);
        formData.append('description', movieDescription);
        formData.append('genre', movieGenre);
        formData.append('vj', movieVJ);
        formData.append('type', movieType);
        if (thumbnail) formData.append('thumbnail', thumbnail);

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/movies/upload`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${publicAnonKey}` },
            body: formData,
          }
        );

        if (!response.ok) throw new Error('Upload failed');
        alert('Movie/Series uploaded successfully!');
        setMovieTitle('');
        setMovieDescription('');
        setFile(null);
        setThumbnail(null);
      } else if (uploadType === 'software') {
        formData.append('title', softwareTitle);
        formData.append('description', softwareDescription);
        formData.append('platform', softwarePlatform);

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/software/upload`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${publicAnonKey}` },
            body: formData,
          }
        );

        if (!response.ok) throw new Error('Upload failed');
        alert('Software uploaded successfully!');
        setSoftwareTitle('');
        setSoftwareDescription('');
        setFile(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-black text-white min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-semibold ${activeTab === 'overview' ? 'bg-orange-600' : 'bg-gray-800'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 rounded-lg font-semibold ${activeTab === 'upload' ? 'bg-orange-600' : 'bg-gray-800'}`}
          >
            Upload Content
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 rounded-lg font-semibold ${activeTab === 'manage' ? 'bg-orange-600' : 'bg-gray-800'}`}
          >
            Manage Content
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-3 rounded-lg font-semibold ${activeTab === 'payments' ? 'bg-orange-600' : 'bg-gray-800'}`}
          >
            Payments ({pendingPayments.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 p-6 rounded-xl">
              <Users className="text-orange-600 mb-3" size={32} />
              <p className="text-3xl font-bold mb-1">{stats.users}</p>
              <p className="text-gray-400">Total Users</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl">
              <Film className="text-orange-600 mb-3" size={32} />
              <p className="text-3xl font-bold mb-1">{stats.movies}</p>
              <p className="text-gray-400">Movies & Series</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl">
              <Music className="text-orange-600 mb-3" size={32} />
              <p className="text-3xl font-bold mb-1">{stats.music}</p>
              <p className="text-gray-400">Music Tracks</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl">
              <DollarSign className="text-orange-600 mb-3" size={32} />
              <p className="text-3xl font-bold mb-1">{stats.revenue.toLocaleString()} UGX</p>
              <p className="text-gray-400">Monthly Revenue</p>
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="bg-gray-900 rounded-xl p-8">
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setUploadType('music')}
                className={`px-6 py-3 rounded-lg ${uploadType === 'music' ? 'bg-orange-600' : 'bg-gray-800'}`}
              >
                <Music size={20} className="inline mr-2" />
                Music
              </button>
              <button
                onClick={() => setUploadType('movies')}
                className={`px-6 py-3 rounded-lg ${uploadType === 'movies' ? 'bg-orange-600' : 'bg-gray-800'}`}
              >
                <Film size={20} className="inline mr-2" />
                Movies/Series
              </button>
              <button
                onClick={() => setUploadType('software')}
                className={`px-6 py-3 rounded-lg ${uploadType === 'software' ? 'bg-orange-600' : 'bg-gray-800'}`}
              >
                <Download size={20} className="inline mr-2" />
                Software
              </button>
            </div>

            {uploadType === 'music' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Title</label>
                  <input
                    type="text"
                    value={musicTitle}
                    onChange={(e) => setMusicTitle(e.target.value)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                    placeholder="Track title"
                  />
                </div>
                <div>
                  <label className="block mb-2">Type</label>
                  <select
                    value={musicType}
                    onChange={(e) => setMusicType(e.target.value as 'audio' | 'video')}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                  >
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">File (up to 5GB)</label>
                  <input
                    type="file"
                    accept={musicType === 'audio' ? 'audio/*' : 'video/*'}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                  />
                </div>
              </div>
            )}

            {uploadType === 'movies' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Type</label>
                  <select
                    value={movieType}
                    onChange={(e) => setMovieType(e.target.value as 'movie' | 'series')}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                  >
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Title</label>
                  <input
                    type="text"
                    value={movieTitle}
                    onChange={(e) => setMovieTitle(e.target.value)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                    placeholder="Movie/Series title"
                  />
                </div>
                <div>
                  <label className="block mb-2">Description</label>
                  <textarea
                    value={movieDescription}
                    onChange={(e) => setMovieDescription(e.target.value)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                    rows={3}
                    placeholder="Description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Genre</label>
                    <select
                      value={movieGenre}
                      onChange={(e) => setMovieGenre(e.target.value)}
                      className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                    >
                      <option>Action</option>
                      <option>Comedy</option>
                      <option>Drama</option>
                      <option>Horror</option>
                      <option>Romance</option>
                      <option>Thriller</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2">VJ</label>
                    <select
                      value={movieVJ}
                      onChange={(e) => setMovieVJ(e.target.value)}
                      className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                    >
                      {VJ_LIST.map(vj => <option key={vj}>{vj}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Thumbnail</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-2">Video File (up to 5GB)</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                  />
                </div>
              </div>
            )}

            {uploadType === 'software' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Title</label>
                  <input
                    type="text"
                    value={softwareTitle}
                    onChange={(e) => setSoftwareTitle(e.target.value)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                    placeholder="Software name"
                  />
                </div>
                <div>
                  <label className="block mb-2">Description</label>
                  <textarea
                    value={softwareDescription}
                    onChange={(e) => setSoftwareDescription(e.target.value)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-2">Platform</label>
                  <select
                    value={softwarePlatform}
                    onChange={(e) => setSoftwarePlatform(e.target.value)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                  >
                    <option>Windows</option>
                    <option>Android</option>
                    <option>macOS</option>
                    <option>Linux</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">File (up to 5GB)</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full mt-6 bg-orange-600 py-4 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              {uploading ? `Uploading... ${uploadProgress}%` : 'Upload'}
            </button>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-gray-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Pending Payment Approvals</h2>
            {pendingPayments.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No pending payments</p>
            ) : (
              <div className="space-y-4">
                {pendingPayments.map(payment => (
                  <div key={payment.id} className="bg-gray-800 p-6 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold">{payment.userName}</p>
                      <p className="text-sm text-gray-400">{payment.items} - {payment.total} UGX</p>
                      <p className="text-xs text-gray-500">Transaction ID: {payment.transactionId}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-green-600 p-2 rounded hover:bg-green-700">
                        <Check size={20} />
                      </button>
                      <button className="bg-red-600 p-2 rounded hover:bg-red-700">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
