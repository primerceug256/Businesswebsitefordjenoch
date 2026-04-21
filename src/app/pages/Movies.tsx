import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Play, Download, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function Movies() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userHasPass, setUserHasPass] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/movies/list`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        });

        if (!response.ok) {
          throw new Error('Failed to load movies');
        }

        const d = await response.json();
        setMovies(Array.isArray(d.movies) ? d.movies : []);

        // Check if user has a valid pass
        if (user) {
          checkUserPass();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Movie fetch failed');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [user]);

  const checkUserPass = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/movies/check-pass`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserHasPass(data.hasValidPass || false);
      }
    } catch (err) {
      console.error('Failed to check user pass:', err);
    }
  };

  const handleMoviePayment = (m: any) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const price = typeof m.price === 'number' ? m.price : 5000;

    sessionStorage.setItem('pending_payment_item', JSON.stringify({
      id: m.id,
      name: m.title,
      price,
      type: 'movie',
      downloadUrl: m.videoUrl,
    }));

    navigate('/payment');
  };

  const download = (m: any) => {
    const link = document.createElement("a");
    link.href = m.videoUrl;
    link.setAttribute("download", `${m.title}.mp4`); // EXACT NAME
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white px-4">
        <div className="text-center space-y-3">
          <p className="text-xl font-bold">Loading movies...</p>
          <p className="text-sm text-slate-400">Fetching the latest uploads from the server.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white px-4">
        <div className="text-center space-y-3">
          <p className="text-xl font-bold">Unable to load movies</p>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white px-4">
        <div className="text-center space-y-3">
          <p className="text-xl font-bold">No movies available yet</p>
          <p className="text-sm text-slate-400">Please upload any movie in the admin panel or check the server endpoint.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen p-8">
      {!user && (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-orange-900/30 border border-orange-500 rounded-lg">
          <p className="text-center text-orange-200">
            <button onClick={() => navigate('/login')} className="underline font-bold hover:text-orange-100">
              Log in
            </button>
            {' '}or{' '}
            <button onClick={() => navigate('/signup')} className="underline font-bold hover:text-orange-100">
              sign up
            </button>
            {' '}to unlock movies
          </p>
        </div>
      )}

      {user && !userHasPass && (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-orange-900/30 border border-orange-500 rounded-lg">
          <p className="text-center text-orange-200 mb-3">
            You need a pass to watch movies
          </p>
          <button
            onClick={() => navigate('/subscription')}
            className="w-full bg-orange-600 py-3 rounded-lg font-bold hover:bg-orange-700 transition"
          >
            Get a Pass Now
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map(m => (
          <div key={m.id} className="bg-slate-900 rounded-3xl overflow-hidden border border-white/5 relative group">
            <img src={m.thumbnailUrl} className="aspect-[2/3] object-cover" />
            
            {/* Overlay when locked */}
            {!userHasPass && user && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 group-hover:bg-black/80 transition">
                <Lock className="text-orange-500" size={40} />
                <button
                  onClick={() => handleMoviePayment(m)}
                  className="bg-orange-600 px-4 py-3 rounded-full text-white font-bold uppercase tracking-[0.08em] hover:bg-orange-500 transition"
                >
                  Buy Movie Access
                </button>
              </div>
            )}

            {/* Action buttons */}
            {userHasPass && (
              <div className="p-4 flex justify-between items-center">
                <Link to={`/movies/watch/${m.id}`} className="text-orange-500 hover:text-orange-400">
                  <Play size={30}/>
                </Link>
                <button onClick={()=>download(m)} className="text-white hover:text-orange-500 transition">
                  <Download/>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}