import { useState } from "react";
import { Menu, X, ShoppingCart, Youtube, Facebook, Instagram, Phone, User, LogOut } from "lucide-react";
import { useAuth, AuthModal } from "./AdminAuth";

// TikTok Icon SVG
const TikTokIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.51 3.79-1.46 1.47-3.82 1.96-5.75 1.13-1.44-.63-2.5-1.91-2.87-3.46-.3-1.27-.06-2.61.58-3.71.51-.88 1.41-1.56 2.38-1.81v4.16c-.44.17-.87.49-1.1.93-.31.61-.25 1.4.15 1.96.43.6 1.17.88 1.9.73.48-.1.9-.45 1.13-.88.13-.25.19-.52.21-.81.01-5.61-.01-11.23.02-16.84z"/>
  </svg>
);

export function Header({ cartCount, onCartClick, onSearch }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<{show: boolean, mode: "login" | "signup"}>({show: false, mode: "login"});
  const { user, signOut } = useAuth();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      {/* Top Socials Bar */}
      <div className="bg-black text-white py-2 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[9px] font-black uppercase tracking-tighter whitespace-nowrap gap-4">
          <div className="flex gap-3">
            <a href="https://www.tiktok.com/@primerce1" target="_blank" className="flex items-center gap-1 hover:text-orange-500"><TikTokIcon /> TikTok Music</a>
            <a href="https://www.tiktok.com/@primercemovies" target="_blank" className="flex items-center gap-1 hover:text-orange-500"><TikTokIcon /> TikTok Movies</a>
            <a href="https://youtube.com/@primercemovies" target="_blank" className="flex items-center gap-1 hover:text-red-500"><Youtube size={12}/> YouTube</a>
          </div>
          <div className="flex items-center gap-2 font-bold"><Phone size={10}/> +256 747 816 444</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-2xl font-black italic tracking-tighter">
          DJ ENOCH <span className="text-orange-600">PRO</span>
        </button>

        <nav className="hidden lg:flex gap-5 text-[10px] font-black uppercase tracking-widest text-gray-500">
          <button onClick={() => scrollTo("about")} className="hover:text-orange-600">About</button>
          <button onClick={() => scrollTo("gallery")} className="hover:text-orange-600">Gallery</button>
          <button onClick={() => scrollTo("downloads")} className="hover:text-orange-600">Music</button>
          <button onClick={() => scrollTo("software")} className="hover:text-orange-600">Software</button>
          <button onClick={() => scrollTo("shop")} className="hover:text-orange-600">DJ Drops</button>
          <button onClick={() => scrollTo("movies")} className="text-orange-600 hover:scale-110 transition-all font-black">Cinema</button>
          <button onClick={() => scrollTo("contact")} className="hover:text-orange-600">Contact</button>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <button onClick={() => signOut()} className="text-[9px] font-black uppercase bg-red-50 text-red-600 px-3 py-2 rounded-xl">Logout</button>
          ) : (
            <button onClick={() => setAuthMode({show: true, mode: "login"})} className="text-[9px] font-black uppercase bg-gray-100 px-3 py-2 rounded-xl">Login</button>
          )}

          <button onClick={onCartClick} className="relative p-2 ml-1">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="absolute top-0 right-0 bg-black text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartCount}</span>}
          </button>

          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t p-8 flex flex-col gap-6 text-center font-black uppercase text-sm shadow-2xl">
          <button onClick={() => scrollTo("about")}>About</button>
          <button onClick={() => scrollTo("downloads")}>Music Center</button>
          <button onClick={() => scrollTo("movies")} className="text-orange-600">Cinema Zone</button>
          <div className="flex justify-center gap-4 pt-4 border-t">
             <a href="https://www.tiktok.com/@primerce1"><TikTokIcon size={20}/></a>
             <a href="https://youtube.com/@primercemovies"><Youtube size={20}/></a>
          </div>
        </div>
      )}

      {authMode.show && <AuthModal mode={authMode.mode} onClose={() => setAuthMode({show: false, mode: "login"})} />}
    </header>
  );
}