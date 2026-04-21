import { useState, useEffect } from 'react';
import { Download, Upload, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

interface Software {
  id: string;
  title: string;
  description: string;
  version: string;
  platform: string; // Windows, Android, macOS, Linux
  category: string;
  price: string;
  downloadUrl: string;
  fileName: string;
}

export default function Software() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [software, setSoftware] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchSoftware();
  }, []);

  const fetchSoftware = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/software/list`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );
      const data = await response.json();
      setSoftware(Array.isArray(data.software) ? data.software : Object.values(data.software || {}));
    } catch (error) {
      console.error('Error fetching software:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSoftware = software.filter(item => {
    if (filter === 'all') return true;
    return item.platform.toLowerCase() === filter.toLowerCase();
  });

  const handleDownload = (item: Software) => {
    if (item.platform === 'Android') {
      // Android is free
      window.open(item.downloadUrl, '_blank');
    } else {
      // Check if user is logged in
      if (!user) {
        navigate('/login');
        return;
      }

      // Redirect to payment page
      sessionStorage.setItem("pending_payment_item", JSON.stringify({
        id: item.id,
        name: item.title,
        price: 5000,
        type: 'software',
        platform: item.platform,
        downloadUrl: item.downloadUrl,
      }));
      navigate('/payment');
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            DJ Software
          </h1>
          <div className="bg-orange-600/10 border border-orange-600/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-orange-600 flex-shrink-0 mt-1" size={20} />
            <div className="text-sm">
              <p className="font-semibold mb-1">Download Information:</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Android software: <span className="text-green-400">FREE</span></li>
                <li>• Other platforms (Windows, macOS, Linux): <span className="text-orange-400">5,000 UGX</span></li>
                <li>• Payment via Airtel Money to <span className="font-semibold">+256747816444</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-orange-600' : 'bg-gray-800'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('android')}
            className={`px-4 py-2 rounded-lg ${filter === 'android' ? 'bg-orange-600' : 'bg-gray-800'}`}
          >
            Android
          </button>
          <button
            onClick={() => setFilter('windows')}
            className={`px-4 py-2 rounded-lg ${filter === 'windows' ? 'bg-orange-600' : 'bg-gray-800'}`}
          >
            Windows
          </button>
          <button
            onClick={() => setFilter('macos')}
            className={`px-4 py-2 rounded-lg ${filter === 'macos' ? 'bg-orange-600' : 'bg-gray-800'}`}
          >
            macOS
          </button>
          <button
            onClick={() => setFilter('linux')}
            className={`px-4 py-2 rounded-lg ${filter === 'linux' ? 'bg-orange-600' : 'bg-gray-800'}`}
          >
            Linux
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading software...</div>
        ) : filteredSoftware.length === 0 ? (
          <div className="text-center text-gray-400">No software available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSoftware.map((item) => (
              <div key={item.id} className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.category}</p>
                  </div>
                  <span className="bg-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {item.platform}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-4">{item.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                  <span>Version {item.version}</span>
                  {item.platform === 'Android' ? (
                    <span className="text-green-400 font-semibold">FREE</span>
                  ) : (
                    <span className="text-orange-400 font-semibold">5,000 UGX</span>
                  )}
                </div>

                <button
                  onClick={() => handleDownload(item)}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                    item.platform === 'Android'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  <Download size={18} />
                  {item.platform === 'Android' ? 'Download Free' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
