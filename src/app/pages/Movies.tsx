import { useState, useEffect } from 'react';
import { Play, Info, Plus, Search, Film, Loader2, ChevronRight } from 'lucide-react';
import { supabase, API_URL } from '../lib/supabase';
import { Link } from 'react-router';

export default function Movies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/movies`).then(res => res.json()).then(data => {
      setMovies(data.movies || []);
      setLoading(false);
    });
  }, []);

  const featured = movies[0]; // The latest upload is featured

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans">
      {/* FEATURED HERO SECTION */}
      {featured && (
        <section className="relative h-[70vh] w-full overflow-hidden">
          <img src={featured.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-10 left-0 px-6 space-y-4 max-w-xl">
            <div className="flex items-center gap-2 text-orange-500 font-black italic uppercase text-xs tracking-widest">
              {featured.genre} • VJ {featured.vj} • {featured.releaseYear}
            </div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter">{featured.title}</h1>
            <p className="text-gray-300 text-sm line-clamp-2">{featured.description}</p>
            <div className="flex gap-3 pt-2">
              <Link to={`/movies/watch/${featured.id}`} className="bg-white text-black px-8 py-3 rounded-full font-black flex items-center gap-2 hover:bg-gray-200 transition">
                <Play fill="black" size={18} /> Play
              </Link>
              <button className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/10">
                <Plus size={20} />
              </button>
              <button className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/10">
                <Info size={20} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* MOVIE ROWS */}
      <section className="px-4 mt-8 space-y-10">
        <MovieRow title="Recently Added Movies" items={movies} />
        <MovieRow title="Trending VJ Junior" items={movies.filter(m => m.vj === 'Junior')} />
        <MovieRow title="Action Blockbusters" items={movies.filter(m => m.genre === 'Action')} />
      </section>
    </div>
  );
}

function MovieRow({ title, items }: { title: string, items: any[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black italic uppercase tracking-tight">{title}</h2>
        <button className="text-xs text-gray-500 font-bold flex items-center gap-1">View all <ChevronRight size={14}/></button>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
        {items.map((m) => (
          <Link key={m.id} to={`/movies/watch/${m.id}`} className="shrink-0 w-36 group">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/5 shadow-lg">
              <img src={m.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              {/* VJ BADGE LIKE SCREENSHOT */}
              <div className="absolute top-2 left-2 bg-pink-600 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg uppercase">
                VJ {m.vj || 'ICE P'}
              </div>
            </div>
            <h3 className="mt-2 text-[11px] font-bold truncate uppercase">{m.title}</h3>
            <p className="text-[9px] text-gray-500 font-bold">{m.genre} • {m.releaseYear}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}