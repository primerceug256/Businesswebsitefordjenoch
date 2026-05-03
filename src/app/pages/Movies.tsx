
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Play, Info, Plus, ChevronRight, Loader2, Search, Bell, Cast } from 'lucide-react';
// FIXED: Using the @ alias to point directly to the lib folder
import { API_URL } from '@/app/lib/supabase';
import { useAuth } from '@/app/context/AuthContext';
import { Card, CardContent } from '@/app/components/ui/card';

export default function Movies() {
  const { user, userData, isAdmin } = useAuth();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API_URL}/movies`);
        if (response.ok) {
          const data = await response.json();
          setMovies(data.movies || []);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const featured = movies[0];
  const filteredContent = movies.filter(m => 
    m.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-orange-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-32 pt-4 font-sans">
      {/* FEATURED HERO (Stream Zone Look) */}
      {featured && !searchQuery && (
        <section className="relative h-[65vh] w-full mb-8">
          <img src={featured.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-10 left-0 px-6 space-y-4 max-w-xl">
            <div className="flex items-center gap-2 text-orange-500 font-black italic uppercase text-xs tracking-widest">
              {featured.genre} • VJ {featured.vj} • {featured.releaseYear}
            </div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{featured.title}</h1>
            <p className="text-gray-300 text-sm line-clamp-2">{featured.description}</p>
            <div className="flex gap-3 pt-2">
              <Link to={`/movies/watch/${featured.id}`} className="bg-white text-black px-8 py-3 rounded-full font-black flex items-center gap-2 hover:bg-gray-200 transition">
                <Play fill="black" size={18} /> Play
              </Link>
              <button className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/10 text-white">
                <Plus size={20} />
              </button>
              <button className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/10 text-white">
                <Info size={20} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SEARCH BAR */}
      <div className="px-6 mb-8 mt-20 md:mt-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text"
            placeholder="Search movies, series..." 
            className="w-full bg-[#111827] border border-white/10 p-3 pl-10 rounded-xl text-sm focus:outline-none focus:border-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* MOVIE ROWS */}
      <div className="px-6 space-y-10">
        <MovieRow title="Recently Added Movies" items={filteredContent} />
        <MovieRow title="VJ Junior Specials" items={filteredContent.filter(m => m.vj === 'Junior')} />
        <MovieRow title="Trending Action" items={filteredContent.filter(m => m.genre === 'Action')} />
      </div>
    </div>
  );
}

function MovieRow({ title, items }: { title: string; items: any[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black italic uppercase tracking-tight text-white">{title}</h2>
        <button className="text-xs text-gray-500 font-bold flex items-center gap-1">View all <ChevronRight size={14}/></button>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
        {items.map((m) => (
          <Link key={m.id} to={`/movies/watch/${m.id}`} className="shrink-0 w-36 group">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/5 shadow-lg bg-gray-900">
              {m.thumbnail ? (
                <img src={m.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><Film className="text-gray-800" /></div>
              )}
              {/* THE PINK VJ BADGE (Matches your screenshot) */}
              <div className="absolute top-2 left-2 bg-pink-600 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg uppercase">
                VJ {m.vj || 'ICE P'}
              </div>
            </div>
            <h3 className="mt-2 text-[11px] font-black truncate uppercase text-white tracking-tight">{m.title}</h3>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{m.genre} • {m.releaseYear}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}