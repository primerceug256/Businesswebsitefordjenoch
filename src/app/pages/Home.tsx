import { Link } from 'react-router';
import { Music, Film, Download, Star, Play, Zap, Code } from 'lucide-react';
import { FAQ } from '../components/FAQ'; // Import new
import { Testimonials } from '../components/Testimonials'; // Import new

export default function Home() {
  return (
    <div className="bg-black text-white">
      {/* --- EXISTING HERO SECTION (UNCHANGED) --- */}
      <section className="relative h-[600px] bg-gradient-to-br from-orange-600 via-orange-500 to-pink-500">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 italic font-black">DJ ENOCH PRO UG</h1>
          <p className="text-2xl md:text-3xl mb-8 uppercase font-bold tracking-tighter">
            The Party Beast Experience
          </p>
          <div className="flex gap-4">
            <Link to="/subscription" className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-50 flex items-center gap-2">
              <Play size={24} /> Start Watching
            </Link>
            <Link to="/music" className="bg-transparent border-2 border-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10">
              Browse Music
            </Link>
          </div>
        </div>
      </section>

      {/* --- EXISTING QUICK LINKS (UNCHANGED) --- */}
      <section className="py-16 bg-gray-900 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/music" className="bg-gradient-to-br from-orange-600 to-orange-700 p-8 rounded-[32px] hover:scale-105 transition-transform group">
              <Music size={48} className="mb-4 group-hover:animate-bounce" />
              <h3 className="text-2xl font-bold mb-2">Music Library</h3>
              <p className="text-orange-100">Free high-quality downloads</p>
            </Link>
            <Link to="/movies" className="bg-gradient-to-br from-pink-600 to-pink-700 p-8 rounded-[32px] hover:scale-105 transition-transform group">
              <Film size={48} className="mb-4 group-hover:animate-pulse" />
              <h3 className="text-2xl font-bold mb-2">HD Movies</h3>
              <p className="text-pink-100">Translated and HD Series</p>
            </Link>
            <Link to="/dj-drops" className="bg-gradient-to-br from-purple-600 to-purple-700 p-8 rounded-[32px] hover:scale-105 transition-transform group">
              <Zap size={48} className="mb-4 group-hover:rotate-12" />
              <h3 className="text-2xl font-bold mb-2">Custom DJ Drops</h3>
              <p className="text-purple-100">Personalized voice tags</p>
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURE HIGHLIGHTS SECTION --- */}
      <section id="offerings" className="py-20 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm uppercase tracking-[.35em] text-orange-400 font-bold">What we offer</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-4">Mixes, Drops, Software & More</h2>
            <p className="text-slate-400 max-w-3xl mx-auto mt-4">
              Download mixtapes, order custom drops, get premium DJ software, and browse movies and posters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
            <div className="bg-gray-900 rounded-3xl p-8 border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-orange-600/20 text-orange-200 flex items-center justify-center mb-5">
                <Music size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Mixtape Downloads</h3>
              <p className="text-slate-400 text-sm">Browse and download the latest mixes for offline listening.</p>
            </div>
            <div className="bg-gray-900 rounded-3xl p-8 border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-200 flex items-center justify-center mb-5">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Custom DJ Drops</h3>
              <p className="text-slate-400 text-sm">Order personalized voice tags and branding drops for your DJ sets.</p>
            </div>
            <div className="bg-gray-900 rounded-3xl p-8 border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-pink-600/20 text-pink-200 flex items-center justify-center mb-5">
                <Download size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">DJ Software</h3>
              <p className="text-slate-400 text-sm">Access Windows and Mac software for mixing, editing, and live performance.</p>
            </div>
            <div className="bg-gray-900 rounded-3xl p-8 border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-green-600/20 text-green-200 flex items-center justify-center mb-5">
                <Code size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Website Development</h3>
              <p className="text-slate-400 text-sm">Build modern websites for your music brand, events, and digital services.</p>
              <p className="text-xs text-orange-400 uppercase font-bold mt-3">Application development coming soon</p>
            </div>
            <div className="bg-gray-900 rounded-3xl p-8 border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 text-cyan-200 flex items-center justify-center mb-5">
                <Film size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">HD Movies</h3>
              <p className="text-slate-400 text-sm">Stream and download movies and video mixes, with access for subscribers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW TESTIMONIALS SECTION --- */}
      <Testimonials />

      {/* --- NEW FAQ SECTION --- */}
      <FAQ />

      {/* --- EXISTING CTA (UNCHANGED) --- */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-pink-600 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-black mb-6 uppercase italic">Ready to Party?</h2>
          <p className="text-xl mb-10 font-bold opacity-80">Join the platform used by thousands in Mukono.</p>
          <Link to="/signup" className="bg-white text-orange-600 px-12 py-5 rounded-full text-xl font-black uppercase hover:bg-gray-100 transition-all shadow-2xl">
            Join the Beast Mode
          </Link>
        </div>
      </section>
    </div>
  );
}