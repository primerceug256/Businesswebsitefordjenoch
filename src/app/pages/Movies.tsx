import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Play, Download, Search, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function Movies() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/movies/list`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      const data = await res.json();
      setMovies(data.movies || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDownload = (movie: any) => {
    if (!isAdmin && !user?.subscription?.active) {
        alert("Please subscribe to download movies!");
        return navigate('/subscription');
    }

    // EXACT NAME LOGIC
    const link = document.createElement("a");
    link.href = movie.videoUrl;
    // This forces the browser to save it with the exact title from the website
    link.setAttribute("download", `${movie.title}.mp4`); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`Downloading: ${movie.title} \nCheck your downloads folder.`);
  };

  const filtered = movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-black text-white min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-7xl">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-4xl font-black uppercase italic text-orange-500 tracking-tighter">HD Movie Library</h1>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-4 text-gray-500" size={20} />
            <input 
              placeholder="Search movies..." 
              className="w-full bg-slate-900 border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500"
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 uppercase font-black animate-pulse text-gray-600">Loading Cinema...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filtered.map((movie) => (
              <div key={movie.id} className="bg-slate-900 rounded-[32px] overflow-hidden border border-white/5 group hover:border-orange-500/50 transition-all">
                <div className="relative aspect-[2/3]">
                  <img src={movie.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    {/* FIXED PLAYER ROUTE: movies/watch/:id */}
                    <Link to={`/movies/watch/${movie.id}`} className="bg-orange-600 p-4 rounded-full hover:scale-110 transition-all"><Play fill="white"/></Link>
                    <button onClick={() => handleDownload(movie)} className="bg-white text-black p-4 rounded-full hover:scale-110 transition-all"><Download/></button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-sm truncate">{movie.title}</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-black mt-1">{movie.genre} • {movie.quality}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}