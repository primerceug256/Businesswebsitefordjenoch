import { useState, useEffect } from "react";
import { Play, X, Star, Lock, ChevronRight, Ticket } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const plans = [
  { time: "2 Hours", price: "500" }, { time: "6 Hours", price: "800" },
  { time: "24 Hours", price: "1100" }, { time: "3 Days", price: "3500" },
  { time: "Weekly", price: "6000" }, { time: "1 Month", price: "19000" }
];

export function MoviesSection({ searchQuery = "" }: { searchQuery?: string }) {
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/movies/list`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` }
    }).then(r => r.json()).then(data => setMovies(data.movies || []));
  }, []);

  const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <section id="movies" className="bg-[#0a0a0a] py-20 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-black italic mb-8 border-l-4 border-orange-600 pl-4 uppercase tracking-tighter">
          Primerce <span className="text-orange-600">Cinema Zone</span>
        </h2>

        {/* Subscription Table */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-16">
          {plans.map(p => (
            <div key={p.time} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center hover:border-orange-500 transition-all">
              <Ticket className="mx-auto mb-2 text-orange-500" size={18}/>
              <p className="text-[10px] font-bold uppercase text-gray-400">{p.time}</p>
              <p className="text-sm font-black text-white">{p.price} UGX</p>
            </div>
          ))}
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <div 
              key={movie.id} 
              className="relative aspect-[2/3] bg-gray-900 rounded-2xl overflow-hidden cursor-pointer group border border-white/5"
              onClick={() => setSelectedMovie(movie)}
            >
              <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="bg-orange-600 p-3 rounded-full"><Play fill="white"/></div>
              </div>
              <div className="absolute bottom-0 p-4 w-full bg-gradient-to-t from-black to-transparent">
                <p className="text-[10px] font-bold text-orange-500">{movie.quality}</p>
                <h4 className="font-bold text-sm truncate">{movie.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedMovie && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-4xl bg-[#111] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <video controls autoPlay className="w-full aspect-video bg-black" src={selectedMovie.videoUrl} />
              <div className="p-6">
                <h2 className="text-2xl font-black italic uppercase text-orange-500">{selectedMovie.title}</h2>
                <p className="text-gray-400 text-sm mt-2 mb-6">Enjoy high-quality streaming on DJ Enoch Pro Website.</p>
                <button onClick={() => setSelectedMovie(null)} className="bg-white text-black px-6 py-2 rounded-full font-bold text-xs">CLOSE PLAYER</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}