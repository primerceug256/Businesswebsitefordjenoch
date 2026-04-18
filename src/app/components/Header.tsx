import { useState } from "react";
import { Menu, X, ShoppingCart, Search, Phone, User } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export function Header({ cartCount, onCartClick }: HeaderProps) {
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
      {/* Top Bar */}
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

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-2 group"
          >
            <div className="text-2xl font-black text-gray-900">
              DJ ENOCH <span className="text-orange-600">PRO</span>
            </div>
          </button>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for DJ drops, software, and more..."
                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button className="absolute right-0 top-0 bottom-0 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-r-lg transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("shop")}
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
            >
              Shop
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
            >
              Contact
            </button>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="lg:hidden pb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="absolute right-0 top-0 bottom-0 px-4 bg-orange-600 text-white rounded-r-lg">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-4">
            <button
              onClick={() => scrollToSection("shop")}
              className="block w-full text-left text-gray-700 hover:text-orange-600 font-semibold py-2"
            >
              Shop
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left text-gray-700 hover:text-orange-600 font-semibold py-2"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="block w-full text-left text-gray-700 hover:text-orange-600 font-semibold py-2"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left text-gray-700 hover:text-orange-600 font-semibold py-2"
            >
              Contact
            </button>
            <button
              onClick={onCartClick}
              className="flex items-center gap-2 w-full text-left text-gray-700 hover:text-orange-600 font-semibold py-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart {cartCount > 0 && `(${cartCount})`}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}