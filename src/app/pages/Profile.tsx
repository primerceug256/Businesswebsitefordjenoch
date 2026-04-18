import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Upload, Clock, Download, Play } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Calculate time left on subscription
    if (user.subscription?.expiresAt) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const expires = new Date(user.subscription!.expiresAt).getTime();
        const diff = expires - now;

        if (diff <= 0) {
          setTimeLeft('Expired');
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours}h ${minutes}m`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [user, navigate]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, would upload photo to storage first
      await updateProfile({ name });
      alert('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          My Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 rounded-2xl p-6">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={64} />
                )}
              </div>
              <label className="inline-block bg-orange-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-700">
                <Upload size={16} className="inline mr-2" />
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg opacity-50"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">Subscription</h2>
              {user.subscription ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-400">Current Plan</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {user.subscription.plan.toUpperCase()} PASS
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-600/20 px-4 py-2 rounded-lg">
                      <Clock size={20} className="text-orange-600" />
                      <span className="font-bold">{timeLeft}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/subscription')}
                    className="w-full bg-orange-600 py-3 rounded-lg font-semibold hover:bg-orange-700"
                  >
                    Upgrade Plan
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-4">No active subscription</p>
                  <button
                    onClick={() => navigate('/subscription')}
                    className="bg-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
                  >
                    Choose a Plan
                  </button>
                </div>
              )}
            </div>

            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <Play size={32} className="mx-auto mb-2 text-orange-600" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-400">Movies Watched</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <Download size={32} className="mx-auto mb-2 text-orange-600" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-400">Downloads</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
