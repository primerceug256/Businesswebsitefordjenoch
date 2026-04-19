import { Outlet, Link, useNavigate } from 'react-router';
import { ShoppingCart, User, LogOut, Home, Music, Film, Download, Phone, CreditCard, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-xl md:text-2xl font-black text-white tracking-tighter">
              DJ ENOCH <span className="text-black">PRO UG</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/" className="flex items-center gap-1 hover:text-orange-100 transition-colors">
                <Home size={18} /> Home
              </Link>
              <Link to="/music" className="flex items-center gap-1 hover:text-orange-100 transition-colors">
                <Music size={18} /> Music
              </Link>
              <Link to="/movies" className="flex items-center gap-1 hover:text-orange-100 transition-colors">
                <Film size={18} /> Movies
              </Link>
              <Link to="/software" className="flex items-center gap-1 hover:text-orange-100 transition-colors">
                <Download size={18} /> Software
              </Link>
              <Link to="/subscription" className="flex items-center gap-1 hover:text-orange-100 transition-colors">
                <CreditCard size={18} /> Plans
              </Link>
              <Link to="/contact" className="flex items-center gap-1 hover:text-orange-100 transition-colors">
                <Phone size={18} /> Contact
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link to="/cart" className="relative p-2 hover:bg-orange-700 rounded-full transition-colors">
                <ShoppingCart size={24} />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {items.length}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="hidden md:flex items-center gap-3 border-l border-orange-400 pl-4">
                  {isAdmin && (
                    <Link to="/admin" className="bg-black/20 px-3 py-1 rounded text-xs font-bold hover:bg-black/40">
                      ADMIN
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 hover:opacity-80">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <span className="text-sm font-medium truncate max-w-[100px]">{user.name || 'User'}</span>
                  </Link>
                  <button onClick={handleLogout} className="p-2 hover:text-red-200 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/login" className="text-sm font-bold hover:underline">Login</Link>
                  <Link to="/signup" className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-50 transition-all">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden bg-orange-600 border-t border-orange-400 pb-6 shadow-xl animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col px-4 pt-4 gap-4">
              <Link onClick={() => setIsMenuOpen(false)} to="/" className="flex items-center gap-3 py-2 text-lg font-bold"><Home /> Home</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/music" className="flex items-center gap-3 py-2 text-lg font-bold"><Music /> Music</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/movies" className="flex items-center gap-3 py-2 text-lg font-bold"><Film /> Movies</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/software" className="flex items-center gap-3 py-2 text-lg font-bold"><Download /> Software</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/subscription" className="flex items-center gap-3 py-2 text-lg font-bold"><CreditCard /> Subscription</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/contact" className="flex items-center gap-3 py-2 text-lg font-bold"><Phone /> Contact</Link>
              <hr className="border-orange-400" />
              {user ? (
                <>
                  <Link onClick={() => setIsMenuOpen(false)} to="/profile" className="flex items-center gap-3 py-2 text-lg font-bold"><User /> Profile</Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 py-2 text-lg font-bold text-red-100"><LogOut /> Logout</button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Link onClick={() => setIsMenuOpen(false)} to="/login" className="text-center py-3 border border-white rounded-lg font-bold">Login</Link>
                  <Link onClick={() => setIsMenuOpen(false)} to="/signup" className="text-center py-3 bg-white text-orange-600 rounded-lg font-bold">Sign Up</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xl font-black mb-4 tracking-tighter">DJ ENOCH PRO UG</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Uganda's number one source for professional DJ drops, mixing software, and non-stop music mixes. 
                Based in Nyenje, Mukono.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>Email: primerceug@gmail.com</li>
                <li>WhatsApp: +256 747 816 444</li>
                <li>Airtel Money: +256 747 816 444</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                <Link to="/music" className="hover:text-orange-500">Music</Link>
                <Link to="/movies" className="hover:text-orange-500">Movies</Link>
                <Link to="/software" className="hover:text-orange-500">Software</Link>
                <Link to="/contact" className="hover:text-orange-500">Booking</Link>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-900 text-center text-gray-500 text-xs">
            <p>&copy; {new Date().getFullYear()} DJ ENOCH PRO UG. Built for the party beast.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}