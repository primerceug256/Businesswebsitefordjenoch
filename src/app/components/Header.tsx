import { useState } from "react";
import { Menu, X, ShoppingCart, Youtube, Facebook, Instagram, Phone, User, LogOut } from "lucide-react";
import { useAuth, AuthModal } from "./AdminAuth";

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
      {/* Top Socials */}
      <div className="bg-black text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
          <div className="flex gap-4">
            <a href="https://youtube.com/@primercemovies" className="flex items-center gap-1 hover:text-red-500"><Youtube size={12}/> YouTube</a>
            <a href="https://facebook.com/primercemovies" className="flex items-center gap-1 hover:text-blue-500"><Facebook size={12}/> Facebook</a>
            <a href="https://instagram.com/primercemovies" className="flex items-center gap-1 hover:text-pink-500"><Instagram size={12}/> Instagram</a>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-bold"><Phone size={10}/> +256 747 816 444</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-2xl font-black italic tracking-tighter">
          DJ ENOCH <span className="text-orange-600">PRO</span>
        </button>

        <nav className="hidden lg:flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
          <button onClick={() => scrollTo("about")} className="hover:text-orange-600">About</button>
          <button onClick={() => scrollTo("gallery")} className="hover:text-orange-600">Gallery</button>
          <button onClick={() => scrollTo("downloads")} className="hover:text-orange-600">Music</button>
          <button onClick={() => scrollTo("software")} className="hover:text-orange-600">Software</button>
          <button onClick={() => scrollTo("shop")} className="hover:text-orange-600">DJ Drops</button>
          <button onClick={() => scrollTo("movies")} className="text-orange-600 hover:scale-110 transition-all">Primerce Cinema</button>
          <button onClick={() => scrollTo("contact")} className="hover:text-orange-600">Contact</button>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:block text-[9px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-1 rounded-full">{user.email}</span>
              <button onClick={() => signOut()} className="flex items-center gap-1 text-[10px] font-black uppercase bg-red-50 text-red-600 px-3 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                <LogOut size={14}/> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setAuthMode({show: true, mode: "login"})} className="text-[10px] font-black uppercase bg-gray-100 px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all">Login</button>
              <button onClick={() => setAuthMode({show: true, mode: "signup"})} className="text-[10px] font-black uppercase bg-orange-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-orange-600/20 hover:scale-105 transition-all">Sign Up</button>
            </div>
          )}

          <button onClick={onCartClick} className="relative p-2 ml-2">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="absolute top-0 right-0 bg-black text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartCount}</span>}
          </button>

          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t p-8 flex flex-col gap-6 text-center font-black uppercase text-sm shadow-2xl">
          <button onClick={() => scrollTo("about")}>About Us</button>
          <button onClick={() => scrollTo("gallery")}>Gallery</button>
          <button onClick={() => scrollTo("downloads")}>Music center</button>
          <button onClick={() => scrollTo("software")}>Software store</button>
          <button onClick={() => scrollTo("shop")}>DJ Drops</button>
          <button onClick={() => scrollTo("movies")} className="text-orange-600">Cinema Zone</button>
          <button onClick={() => scrollTo("contact")}>Contact</button>
        </div>
      )}

      {authMode.show && <AuthModal mode={authMode.mode} onClose={() => setAuthMode({show: false, mode: "login"})} />}
    </header>
  );
}