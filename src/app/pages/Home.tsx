import { Link } from 'react-router';
import { Music, Film, Download, Smartphone, Zap, Code, Play } from 'lucide-react';
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

      {/* --- QUICK LINKS GRID --- */}
      <section className="py-12 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 relative z-20">
            <Link to="/music" className="bg-slate-900 p-8 rounded-[40px] border border-white/5 hover:border-orange-500/30 transition-all group shadow-2xl">
              <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                <Music size={28} />
              </div>
              <h3 className="text-xl font-black uppercase italic mb-2">Mixtapes</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Free Audio Downloads</p>
            </Link>

            <Link to="/movies" className="bg-slate-900 p-8 rounded-[40px] border border-white/5 hover:border-pink-500/30 transition-all group shadow-2xl">
              <div className="w-14 h-14 bg-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Film size={28} />
              </div>
              <h3 className="text-xl font-black uppercase italic mb-2">HD Movies</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Translated Series</p>
            </Link>

            <Link to="/apps" className="bg-slate-900 p-8 rounded-[40px] border border-white/5 hover:border-cyan-500/30 transition-all group shadow-2xl">
              <div className="w-14 h-14 bg-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:-rotate-12 transition-transform">
                <Smartphone size={28} />
              </div>
              <h3 className="text-xl font-black uppercase italic mb-2">Mobile Apps</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Android & iOS Tools</p>
            </Link>

            <Link to="/dj-drops" className="bg-slate-900 p-8 rounded-[40px] border border-white/5 hover:border-purple-500/30 transition-all group shadow-2xl">
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-pulse transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-black uppercase italic mb-2">DJ Drops</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Custom Voice Tags</p>
            </Link>
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-8">Professional <span className="text-orange-600 text-6xl">Digital</span> Services</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="bg-slate-900 p-4 rounded-2xl h-fit border border-white/5"><Code className="text-orange-500"/></div>
                  <div>
                    <h4 className="text-xl font-black uppercase italic">Web Development</h4>
                    <p className="text-slate-400 mt-2">Get a custom website for your DJ brand or music business. We build responsive sites with payment integration.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="bg-slate-900 p-4 rounded-2xl h-fit border border-white/5"><Download className="text-blue-500"/></div>
                  <div>
                    <h4 className="text-xl font-black uppercase italic">Software Hub</h4>
                    <p className="text-slate-400 mt-2">Access premium DJ software for Windows and Mac including Sony Acid, Virtual DJ, and more.</p>
                  </div>
                </div>
              </div>
              <Link to="/web-development" className="inline-block mt-12 bg-orange-600 px-8 py-4 rounded-full font-black uppercase italic tracking-widest hover:bg-orange-500 transition-all">Hire the beast</Link>
            </div>
            <div className="bg-slate-900 p-2 rounded-[60px] border border-white/5">
              <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000" className="rounded-[58px] grayscale hover:grayscale-0 transition-all duration-700" alt="DJ Enoch" />
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <FAQ />
      
      {/* --- CTA --- */}
      <section className="py-32 bg-gradient-to-t from-orange-600 to-pink-600 text-center">
         <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-10">Join the Beast</h2>
         <Link to="/signup" className="bg-white text-orange-600 px-16 py-6 rounded-full text-2xl font-black uppercase hover:scale-110 transition-all shadow-2xl">Create Account</Link>
      </section>

      <Footer />
    </div>
  );
}