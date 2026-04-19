import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Users, DollarSign, Music, Film } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If someone tries to go to /admin and it's NOT you, kick them out
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-black mb-12 text-yellow-400">ADMIN CONTROL CENTER</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <Users className="text-orange-500 mb-2" />
            <p className="text-4xl font-black">125</p>
            <p className="text-gray-400">Total Members</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <DollarSign className="text-green-500 mb-2" />
            <p className="text-4xl font-black">1.5M</p>
            <p className="text-gray-400">UGX Revenue</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <Music className="text-purple-500 mb-2" />
            <p className="text-4xl font-black">320</p>
            <p className="text-gray-400">Mixes Uploaded</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <Film className="text-red-500 mb-2" />
            <p className="text-4xl font-black">450</p>
            <p className="text-gray-400">Movies Online</p>
          </div>
        </div>

        <div className="bg-gray-900 p-8 rounded-3xl border-2 border-yellow-400/20">
          <h2 className="text-2xl font-bold mb-4">Quick Instructions</h2>
          <p className="text-gray-300">Welcome back, DJ Enoch. To upload new content, use the floating buttons at the bottom right of the screen. To manage users or check payments, use the tools above.</p>
        </div>
      </div>
    </div>
  );
}