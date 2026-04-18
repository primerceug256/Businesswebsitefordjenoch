import { useState } from "react";
import { Menu, X, ShoppingCart, Search, Phone, User } from "lucide-react";

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
      <div className="bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">+256 747 816 444</span>
              </div>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">📍 Nyenje, Mukono</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <button onClick={() => scrollToSection("home")} className="flex items-center gap-2 group">
            <div className="text-2xl font-black text-gray-900">
              DJ ENOCH <span className="text-orange-600">PRO</span>
            </div>
          </button>

          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search for DJ drops, software, and more..."
                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection("shop")} className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Shop</button>
            <button onClick={() => scrollToSection("about")} className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">About</button>
            <button onClick={() => scrollToSection("services")} className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Services</button>
            <button onClick={() => scrollToSection("contact")} className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Contact</button>

            <button onClick={onCartClick} className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>

          <button className="md:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div className="lg:hidden pb-4">
          <div className="relative w-full">
            <input
              type="text"
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu ... */}
    </header>
  );
}