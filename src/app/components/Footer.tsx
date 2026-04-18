// src/app/components/Footer.tsx
import { Youtube, Facebook, Instagram, Phone, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12">
        <div>
          <h3 className="text-2xl font-black italic mb-4">DJ ENOCH <span className="text-orange-600">PRO</span></h3>
          <p className="text-gray-400 text-sm leading-relaxed">The Party Beast & Cinema Zone. Uganda's premier destination for DJ mixes, high-quality software, and cinematic streaming.</p>
        </div>
        
        <div>
          <h4 className="font-bold uppercase text-orange-600 mb-6">Contact Us</h4>
          <div className="space-y-4 text-sm font-bold">
            <a href="tel:+256747816444" className="flex items-center gap-3 hover:text-orange-500"><Phone size={18}/> +256 747 816 444</a>
            <a href="https://wa.me/256747816444" className="flex items-center gap-3 hover:text-green-500"><MessageCircle size={18}/> WhatsApp Admin</a>
          </div>
        </div>

        <div>
          <h4 className="font-bold uppercase text-orange-600 mb-6">Follow The Beast</h4>
          <div className="flex gap-4">
            <a href="https://youtube.com/@primercemovies" className="bg-white/10 p-3 rounded-full hover:bg-red-600"><Youtube size={20}/></a>
            <a href="https://facebook.com/primercemovies" className="bg-white/10 p-3 rounded-full hover:bg-blue-600"><Facebook size={20}/></a>
            <a href="https://instagram.com/primercemovies" className="bg-white/10 p-3 rounded-full hover:bg-pink-600"><Instagram size={20}/></a>
          </div>
        </div>
      </div>
      <p className="text-center text-[10px] text-gray-600 mt-8 uppercase tracking-widest font-bold">© {new Date().getFullYear()} Primerce Movies & DJ Enoch Pro. Developed for The Party Beast.</p>
    </footer>
  );
}