import { useState, useEffect } from "react";
import { Play, Ticket, Loader } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

export function MoviesSection({ searchQuery = "" }: any) {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
      setMovies(data || []);
      setLoading(false);
    };
    fetchMovies();
  }, []);

  const filtered = movies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <section id="movies" className="bg-[#050505] py-20 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-black uppercase italic mb-8 border-l-4 border-orange-600 pl-4">Primerce <span className="text-orange-600">Cinema Zone</span></h2>
        {loading ? <Loader className="animate-spin mx-auto"/> : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filtered.map(m => (
              <div key={m.id} className="relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer group">
                <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <div className="bg-orange-600 p-3 rounded-full"><Play fill="white"/></div>
                </div>
                <div className="absolute bottom-0 p-4 bg-gradient-to-t from-black to-transparent w-full">
                  <h4 className="text-sm font-black uppercase truncate">{m.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}