import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Play, Download } from 'lucide-react';
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function Movies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Movie fetch failed');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

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
    <div className="bg-black min-h-screen p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
      {movies.map(m => (
        <div key={m.id} className="bg-slate-900 rounded-3xl overflow-hidden border border-white/5">
          <img src={m.thumbnailUrl} className="aspect-[2/3] object-cover" />
          <div className="p-4 flex justify-between items-center">
            <Link to={`/movies/watch/${m.id}`} className="text-orange-500"><Play size={30}/></Link>
            <button onClick={()=>download(m)} className="text-white"><Download/></button>
          </div>
        </div>
      ))}
    </div>
  );
}