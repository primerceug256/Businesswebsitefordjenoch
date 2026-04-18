import { useState, useEffect } from "react";
import { Play, Ticket, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const plans = [
  { t: "2Hrs", p: "500" }, { t: "6Hrs", p: "800" }, { t: "24Hrs", p: "1100" },
  { t: "3Days", p: "3500" }, { t: "Weekly", p: "6000" }, { t: "2Weeks", p: "11000" },
  { t: "1Month", p: "19000" }, { t: "3Months", p: "39500" }, { t: "6Months", p: "65000" },
  { t: "1Year", p: "110000" }, { t: "Unlimited", p: "350000" }
];

export function MoviesSection({ searchQuery = "" }: any) {
  const [movies, setMovies] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/movies/list`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` }
    }).then(r => r.json()).then(d => setMovies(d.movies || []));
  }, []);

  const filtered = movies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <section id="movies" className="bg-[#050505] py-20 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 border-l-4 border-orange-600 pl-4">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Primerce <span className="text-orange-600">Cinema Zone</span></h2>
          <p className="text-gray-500 text-xs font-bold">Watch and Download the Latest Movies</p>
        </div>

        {/* Subscription Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-16">
          {plans.map(p => (
            <div key={p.t} className="bg-white/5 border border-white/10 p-3 rounded-xl text-center hover:bg-orange-600/20 transition-all">
              <p className="text-[9px] font-black text-gray-400 uppercase">{p.t}</p>
              <p className="text-xs font-black text-orange-500">{p.p} UGX</p>
            </div>
          ))}
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map(m => (
            <div key={m.id} onClick={() => setSelected(m)} className="relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer group">
              <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-all" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="bg-orange-600 p-3 rounded-full shadow-xl"><Play fill="white" size={20}/></div>
              </div>
              <div className="absolute bottom-0 p-4 bg-gradient-to-t from-black to-transparent w-full">
                <p className="text-[10px] font-bold text-orange-500 uppercase">{m.quality || 'HD'}</p>
                <h4 className="text-sm font-black uppercase truncate">{m.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-4xl bg-[#111] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <video src={selected.videoUrl} controls autoPlay className="w-full aspect-video bg-black" />
              <div className="p-6 flex justify-between items-center">
                <h3 className="text-xl font-black uppercase italic text-orange-500">{selected.title}</h3>
                <button onClick={() => setSelected(null)} className="bg-white text-black px-6 py-2 rounded-full font-black text-[10px]">CLOSE</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}