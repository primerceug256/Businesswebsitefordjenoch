import { Youtube, Facebook, Instagram, Phone, MessageCircle } from "lucide-react";

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.51 3.79-1.46 1.47-3.82 1.96-5.75 1.13-1.44-.63-2.5-1.91-2.87-3.46-.3-1.27-.06-2.61.58-3.71.51-.88 1.41-1.56 2.38-1.81v4.16c-.44.17-.87.49-1.1.93-.31.61-.25 1.4.15 1.96.43.6 1.17.88 1.9.73.48-.1.9-.45 1.13-.88.13-.25.19-.52.21-.81.01-5.61-.01-11.23.02-16.84z"/>
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-[#050505] text-white py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-3xl font-black italic mb-6 tracking-tighter">DJ ENOCH <span className="text-orange-600">PRO</span></h3>
          <p className="text-gray-500 text-sm max-w-sm leading-relaxed font-bold uppercase text-[10px]">
            The Party Beast & Cinema Zone. Uganda's premier destination for high-quality DJ mixes, professional software, and movie streaming.
          </p>
        </div>
        
        <div>
          <h4 className="font-black uppercase text-orange-600 text-xs mb-6 tracking-widest">TikTok Channels</h4>
          <div className="space-y-4">
            <a href="https://www.tiktok.com/@primerce1" target="_blank" className="flex items-center gap-3 group text-xs font-bold">
              <div className="bg-white/10 p-2 rounded-full group-hover:bg-orange-600 transition-all"><TikTokIcon size={16}/></div>
              TikTok Music (@primerce1)
            </a>
            <a href="https://www.tiktok.com/@primercemovies" target="_blank" className="flex items-center gap-3 group text-xs font-bold">
              <div className="bg-white/10 p-2 rounded-full group-hover:bg-orange-600 transition-all"><TikTokIcon size={16}/></div>
              TikTok Movies (@primercemovies)
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-black uppercase text-orange-600 text-xs mb-6 tracking-widest">Other Socials</h4>
          <div className="flex gap-4">
            <a href="https://youtube.com/@primercemovies" className="bg-white/10 p-3 rounded-full hover:bg-red-600 transition-all"><Youtube size={20}/></a>
            <a href="https://facebook.com/primercemovies" className="bg-white/10 p-3 rounded-full hover:bg-blue-600 transition-all"><Facebook size={20}/></a>
            <a href="https://instagram.com/primercemovies" className="bg-white/10 p-3 rounded-full hover:bg-pink-600 transition-all"><Instagram size={20}/></a>
          </div>
          <div className="mt-6">
            <a href="https://wa.me/256747816444" className="flex items-center gap-2 text-xs font-black text-green-500"><MessageCircle size={16}/> WhatsApp Admin</a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 text-center">
        <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} Primerce Movies & DJ Enoch Pro. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}