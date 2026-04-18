// src/app/components/Header.tsx
import { useState } from "react";
import { Menu, X, ShoppingCart, Search, Phone, Youtube, Facebook, Instagram } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onSearch: (query: string) => void;
}

export function Header({ cartCount, onCartClick, onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      {/* Top Bar with Socials */}
      <div className="bg-black text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs">
          <div className="flex gap-4">
            <a href="https://youtube.com/@primercemovies" target="_blank" className="hover:text-red-500 flex items-center gap-1"><Youtube size={14}/> YouTube</a>
            <a href="https://facebook.com/primercemovies" target="_blank" className="hover:text-blue-500 flex items-center gap-1"><Facebook size={14}/> Facebook</a>
            <a href="https://instagram.com/primercemovies" target="_blank" className="hover:text-pink-500 flex items-center gap-1"><Instagram size={14}/> Instagram</a>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={12} /> <span>+256 747 816 444</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => scrollToSection("home")} className="text-xl font-black italic">
          DJ ENOCH <span className="text-orange-600">PRO</span>
        </button>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex gap-6 font-bold text-sm uppercase">
          <button onClick={() => scrollToSection("about")} className="hover:text-orange-600">About</button>
          <button onClick={() => scrollToSection("gallery")} className="hover:text-orange-600">Gallery</button>
          <button onClick={() => scrollToSection("downloads")} className="hover:text-orange-600">Music</button>
          <button onClick={() => scrollToSection("software")} className="hover:text-orange-600">Software</button>
          <button onClick={() => scrollToSection("shop")} className="hover:text-orange-600">DJ Drops</button>
          <button onClick={() => scrollToSection("movies")} className="hover:text-orange-600">Movies</button>
          <button onClick={() => scrollToSection("services")} className="hover:text-orange-600">Services</button>
          <button onClick={() => scrollToSection("contact")} className="hover:text-orange-600">Contact</button>
        </nav>

        <div className="flex gap-4 items-center">
          <button onClick={onCartClick} className="relative">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
          </button>
          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t p-4 flex flex-col gap-4 font-bold text-center">
          <button onClick={() => scrollToSection("about")}>About Us</button>
          <button onClick={() => scrollToSection("gallery")}>Gallery</button>
          <button onClick={() => scrollToSection("downloads")}>Download Music</button>
          <button onClick={() => scrollToSection("software")}>Software</button>
          <button onClick={() => scrollToSection("shop")}>DJ Drops</button>
          <button onClick={() => scrollToSection("movies")}>Movies (Subscription)</button>
          <button onClick={() => scrollToSection("services")}>Services</button>
          <button onClick={() => scrollToSection("contact")}>Contact</button>
        </div>
      )}
    </header>
  );
}