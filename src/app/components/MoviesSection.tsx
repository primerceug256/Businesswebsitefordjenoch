import { useState, useEffect } from "react";
import { Play, Info, X, Star, Calendar, Clock, Lock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Movie {
  id: string; title: string; description: string; genre: string;
  duration: string; releaseYear: string; quality: string; videoUrl: string;
}

export function MoviesSection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/movies/list`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` }
    }).then(r => r.json()).then(data => {
      setMovies(data.movies || []);
      setLoading(false);
    });
  }, []);

  return (
    <section id="movies" className="bg-[#0f0f0f] py-20 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Cinema Header */}
        <div className="flex items-end justify-between mb-8 border-l-4 border-orange-600 pl-4">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter">Primerce <span className="text-orange-600">Cinema</span></h2>
            <p className="text-gray-400 text-sm">Streaming the best movies in Uganda</p>
          </div>
          <button className="text-orange-500 font-bold text-sm flex items-center gap-1">View All <ChevronRight size={16}/></button>
        </div>

        {/* Featured Hero Banner (App Style) */}
        <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-12 group cursor-pointer shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10 max-w-xl">
            <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block italic">TRENDING NOW</span>
            <h3 className="text-5xl font-black mb-4 uppercase italic">The DJ Enoch Story</h3>
            <p className="text-gray-300 mb-6 line-clamp-2">Experience the journey of Uganda's party beast. Exclusive behind-the-scenes and live concert footage.</p>
            <div className="flex gap-4">
              <button onClick={() => alert("Please subscribe to watch")} className="bg-white text-black px-8 py-3 rounded-full font-black flex items-center gap-2 hover:bg-orange-600 hover:text-white transition-all"><Play fill="currentColor" size={20}/> START WATCHING</button>
            </div>
          </div>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <motion.div 
              whileHover={{ scale: 1.05, y: -10 }}
              key={movie.id} 
              className="relative aspect-[2/3] bg-gray-800 rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-gray-700/50 group"
              onClick={() => setSelectedMovie(movie)}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all" />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold border border-white/20">{movie.quality}</div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-orange-600 p-4 rounded-full shadow-orange-500/50 shadow-xl"><Play fill="white" size={24}/></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <h4 className="font-bold text-sm line-clamp-1">{movie.title}</h4>
                <p className="text-[10px] text-gray-400">{movie.genre} • {movie.releaseYear}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* VIDEO PLAYER MODAL (Stream Zone Style) */}
      <AnimatePresence>
        {selectedMovie && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
              onClick={() => setSelectedMovie(null)} 
            />
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
              className="relative w-full max-w-5xl bg-[#1a1a1a] rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(234,88,12,0.3)] border border-white/10"
            >
              {/* Custom Player UI */}
              <div className="relative aspect-video bg-black group">
                <video 
                  controls 
                  autoPlay 
                  className="w-full h-full"
                  src={selectedMovie.videoUrl}
                />
                <button 
                  onClick={() => setSelectedMovie(null)}
                  className="absolute top-6 right-6 bg-black/50 p-2 rounded-full hover:bg-orange-600 transition-all"
                ><X size={24}/></button>
              </div>

              <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-xs text-orange-500 font-bold mb-3">
                      <Star size={14} fill="currentColor"/> 9.8 RATING • {selectedMovie.releaseYear} • {selectedMovie.quality}
                    </div>
                    <h2 className="text-3xl font-black uppercase italic mb-4">{selectedMovie.title}</h2>
                    <p className="text-gray-400 leading-relaxed text-sm">{selectedMovie.description || "Get ready for an adrenaline-pumping experience. Streamed exclusively on DJ Enoch Pro Primerce Cinema."}</p>
                  </div>
                  <div className="md:w-64 space-y-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Subscription Required</p>
                      <p className="text-sm font-bold mb-4">Watch full movie without limits</p>
                      <button onClick={() => {document.getElementById('contact')?.scrollIntoView(); setSelectedMovie(null);}} className="w-full bg-orange-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2"><Lock size={14}/> SUBSCRIBE NOW</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}