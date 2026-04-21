import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Download } from 'lucide-react';
import { projectId, publicAnonKey } from '@utils/supabase/info';

export default function MoviePlayer() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth(); // Destructure isAdmin from AuthContext
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // UPDATED: If user is Admin, they don't need a subscription record to view the player
    if (!isAdmin && !user.subscription) {
      navigate('/subscription');
      return;
    }

    fetchMovie();
  }, [id, user, isAdmin, navigate]);

  const fetchMovie = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/movies/list`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );
      const data = await response.json();
      const movies = Array.isArray(data.movies) ? data.movies : Object.values(data.movies || {});
      const foundMovie = movies.find((m: any) => m.id === id);
      setMovie(foundMovie);
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-xl">Movie not found</p>
      </div>
    );
  }

  // UPDATED LOGIC: canDownload is TRUE if you are Admin OR have a valid plan
  const canDownload = isAdmin || (user?.subscription &&
    ['weekly', 'monthly', '2months', 'gold', 'platinum', 'diamond', 'unlimited'].includes(user.subscription.plan));

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/movies')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          Back to Movies
        </button>

        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
          <video
            src={movie.videoUrl}
            controls
            autoPlay
            className="w-full h-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <div className="flex items-center gap-4 text-gray-400 mb-6">
              <span className="bg-orange-600 px-3 py-1 rounded text-white">{movie.quality}</span>
              <span>{movie.genre}</span>
              <span>{movie.releaseYear}</span>
              <span>{movie.duration}</span>
            </div>
            {movie.vj && (
              <p className="text-lg text-orange-600 mb-4">By {movie.vj}</p>
            )}
            <p className="text-gray-300 text-lg">{movie.description}</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 h-fit">
            <h3 className="text-xl font-bold mb-4">Actions</h3>
            {canDownload ? (
              <a
                href={movie.videoUrl}
                download
                className="w-full bg-orange-600 py-3 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2 mb-3"
              >
                <Download size={20} />
                Download Movie {isAdmin && "(Lifetime Access)"}
              </a>
            ) : (
              <div className="mb-4">
                <p className="text-sm text-red-500 font-bold mb-2">Subscription Required</p>
                <p className="text-xs text-gray-400">
                  Upgrade to Weekly Pass or higher to download movies.
                </p>
              </div>
            )}
            
            {/* Show subscription plans button only if the user isn't already fully authorized */}
            {!isAdmin && (
              <button
                onClick={() => navigate('/subscription')}
                className="w-full bg-gray-800 py-3 rounded-lg hover:bg-gray-700"
              >
                View Plans
              </button>
            )}

            {isAdmin && (
              <div className="mt-4 p-4 border border-orange-500/30 rounded bg-orange-500/5">
                <p className="text-[10px] text-orange-500 uppercase font-black">Admin Notice</p>
                <p className="text-xs text-gray-400">You are logged in as the owner. All downloads are unlocked for you.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}