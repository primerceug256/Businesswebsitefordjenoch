--- START OF FILE Businesswebsitefordjenoch-main/src/app/pages/Home.tsx ---
import { Link } from 'react-router';
import { Music, Film, Download, Smartphone, Zap, Code, Play } from 'lucide-react';
import { FAQ } from '../components/FAQ';
import { Testimonials } from '../components/Testimonials';

export default function Home() {
  return (
    <div className="bg-black text-white font-sans">
      {/* --- HERO SECTION --- */}
      <section className="relative h-[700px] bg-gradient-to-br from-orange-600 via-orange-500 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10">
          <span className="bg-black text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">Established 2024</span>
          <h1 className="text-7xl md:text-9xl font-black mb-6 italic tracking-tighter uppercase">DJ ENOCH PRO</h1>
          <p className="text-xl md:text-3xl mb-12 uppercase font-black tracking-widest text-white/90">
            THE PARTY BEAST EXPERIENCE <span className="text-black">UGANDA</span>
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/subscription" className="bg-white text-orange-600 px-10 py-5 rounded-full text-xl font-black uppercase hover:scale-105 transition-all flex items-center gap-2 shadow-2xl shadow-orange-900/40">
              <Play size={24} fill="currentColor" /> Watch Movies
            </Link>
            <Link to="/music" className="bg-black/20 backdrop-blur-xl border-2 border-white/30 px-10 py-5 rounded-full text-xl font-black uppercase hover:bg-white/10 transition-all">
              Music Library
            </Link>
          </div>
        </div>
      </section>

      {/* --- TOP 3 QUICK LINKS --- */}
      <section className="py-10 bg-slate-950 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-20">
            <Link to="/music" className="bg-slate-900 p-8 rounded-[40px] border border-white/5 hover:border-orange-500/30 hover:scale-[1.02] transition-all group shadow-2xl">
              <div className="w-16 h-16 bg-orange-600 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-orange-900/20">
                <Music size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase italic italic tracking-tighter mb-2">Music Mixtapes</h3>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wid