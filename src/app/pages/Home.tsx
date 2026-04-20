import { Link } from 'react-router';
import { Music, Film, Smartphone, Zap, Code, Play, Download } from 'lucide-react';
import { FAQ } from '../components/FAQ';
import { Testimonials } from '../components/Testimonials';
import { Footer } from '../components/Footer';

export default function Home() {
  return (
    <div className="bg-black text-white font-sans">
      {/* --- HERO SECTION --- */}
      <section className="relative h-[700px] bg-gradient-to-br from-orange-600 via-orange-500 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10">
          <span className="bg-black text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-xl">Since 2024</span>
          <h1 className="text-7xl md:text-9xl font-black mb-6 italic tracking-tighter uppercase leading-none">DJ ENOCH PRO</h1>
          <p className="text-xl md:text-3xl mb-12 uppercase font-black tracking-widest text-white/90">
            THE PARTY BEAST EXPERIENCE <span className="text-black ml-2 underline decoration-4">UGANDA</span>
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

      {/* --- QUICK ACTIONS GRID --- */}
      <section className="py-12 bg-slate-950 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24">
            <Link to="/music" className="bg-slate-900 p-8 rounded-[40px] border border-white/5 hover:border-orange-500/30 transition-all group shadow-2xl">
              <div className="w-16 h-16 bg-orange-600 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-orange-900/20">
                <Music size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">Mixtapes</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Free Audio Downloads</p>
            </Link>

            <Link to="/movies" className="bg-slate-900 p-8 rounded-[40px] border border-white/5 hover:border-pink-500/30 transition-all group shadow-2xl">
              <div className="w-16 h-16 bg-pink-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-pink-900/20">
                <Film size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">HD Movies</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Translated Series</p>
            </Link>

            <Link to="/apps" className="bg-slate-900 p-8 rounded-[40px] border border-white/5 hover:border-cyan-500/30 transition-all group shadow-2xl">
              <div className="w-16 h-16 bg-cyan-600 rounded-3xl flex items-center justify-center mb-6 group-hover:-rotate-12 transition-transform shadow-lg shadow-cyan-900/20">
                <Smartphone size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">Mobile Apps</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Android & iOS Tools</p>
            </Link>

            <Link to="/dj-drops" className="bg-slate-900 p-8 rounded-[40px] border border-white/5 hover:border-purple-500/30 transition-all group shadow-2xl">
              <div className="w-16 h-16 bg-purple-600 rounded-3xl flex items-center justify-center mb-6 group-hover:animate-pulse transition-transform shadow-lg shadow-purple-900/20">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">DJ Drops</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Custom Voice Tags</p>
            </Link>
          </div>
        </div>
      </section>

      {/* --- SERVICES --- */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-10 leading-none">
                HIRE THE <span className="text-orange-600">BEAST</span> FOR YOUR BRAND
              </h2>
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="bg-slate-900 p-5 rounded-2xl h-fit border border-white/10 text-orange-500 shadow-xl"><Code size={32}/></div>
                  <div>
                    <h4 className="text-2xl font-black uppercase italic tracking-tighter">Web Development</h4>
                    <p className="text-slate-400 mt-2 leading-relaxed">Professional custom websites for DJs, radio stations, and business brands. Fully responsive with mobile optimization.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="bg-slate-900 p-5 rounded-2xl h-fit border border-white/10 text-blue-500 shadow-xl"><Download size={32}/></div>
                  <div>
                    <h4 className="text-2xl font-black uppercase italic tracking-tighter">Software Hub</h4>
                    <p className="text-slate-400 mt-2 leading-relaxed">Get the latest DJ software tools for PC and Mac. Installation guides and support provided for every download.</p>
                  </div>
                </div>
              </div>
              <Link to="/web-development" className="inline-block mt-12 bg-orange-600 px-12 py-5 rounded-full font-black uppercase italic tracking-widest hover:bg-orange-500 transition-all shadow-xl shadow-orange-900/20">Get a Quote</Link>
            </div>
            <div className="order-1 lg:order-2">
                <div className="relative">
                    <div className="absolute -inset-4 bg-orange-600/20 blur-3xl rounded-full"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000" 
                        className="rounded-[60px] border-4 border-white/5 relative z-10 grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl" 
                        alt="DJ Enoch Experience" 
                    />
                </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <FAQ />

      {/* --- FOOTER CTA --- */}
      <section className="py-32 bg-gradient-to-b from-orange-600 to-pink-600 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-black/10"></div>
         <h2 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter mb-12 relative z-10">BEAST MODE</h2>
         <Link to="/signup" className="relative z-10 bg-white text-orange-600 px-20 py-6 rounded-full text-2xl font-black uppercase hover:scale-110 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)]">Join Now</Link>
      </section>

      <Footer />
    </div>
  );
}