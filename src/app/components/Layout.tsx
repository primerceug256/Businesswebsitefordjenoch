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
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-xl md:text-2xl font-extrabold text-white tracking-tighter flex items-center gap-2">
              DJ ENOCH <span className="bg-black text-white px-2 py-0.5 rounded">PRO UG</span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/" className="flex items-center gap-1.5 hover:text-orange-100 font-semibold transition-colors">
                <Home size={18} /> Home
              </Link>
              <Link to="/music" className="flex items-center gap-1.5 hover:text-orange-100 font-semibold transition-colors">
                <Music size={18} /> Music
              </Link>
              <Link to="/movies" className="flex items-center gap-1.5 hover:text-orange-100 font-semibold transition-colors">
                <Film size={18} /> Movies
              </Link>
              <Link to="/software" className="flex items-center gap-1.5 hover:text-orange-100 font-semibold transition-colors">
                <Download size={18} /> Software
              </Link>
              <Link to="/subscription" className="flex items-center gap-1.5 hover:text-orange-100 font-semibold transition-colors">
                <CreditCard size={18} /> Plans
              </Link>
              <Link to="/contact" className="flex items-center gap-1.5 hover:text-orange-100 font-semibold transition-colors">
                <Phone size={18} /> Contact
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Cart Icon */}
              <Link to="/cart" className="relative p-2 hover:bg-orange-700 rounded-full transition-colors">
                <ShoppingCart size={24} />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-orange-100">
                    {items.length}
                  </span>
                )}
              </Link>

              {/* Desktop Auth Section */}
              {user ? (
                <div className="hidden md:flex items-center gap-3 border-l border-orange-400 pl-4">
                  {isAdmin && (
                    <Link to="/admin" className="bg-black text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-colors">
                      Admin
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all">
                      <User size={18} />
                    </div>
                    <span className="text-sm font-bold truncate max-w-[100px]">{user.name || 'Account'}</span>
                  </Link>
                  <button onClick={handleLogout} className="p-2 hover:text-red-100 transition-colors" title="Logout">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-4">
                  <Link to="/login" className="text-sm font-bold hover:underline transition-all">Login</Link>
                  <Link to="/signup" className="bg-white text-orange-600 px-5 py-2 rounded-full text-sm font-black hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
                    SIGN UP
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle Button */}
              <button 
                className="lg:hidden p-2 text-white hover:bg-orange-700 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown Panel */}
        {isMenuOpen && (
          <div className="lg:hidden bg-orange-600 border-t border-orange-400 pb-8 shadow-2xl animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col px-6 pt-6 gap-5">
              <Link onClick={() => setIsMenuOpen(false)} to="/" className="flex items-center gap-4 py-2 text-xl font-bold border-b border-orange-500/50"><Home /> Home</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/music" className="flex items-center gap-4 py-2 text-xl font-bold border-b border-orange-500/50"><Music /> Music</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/movies" className="flex items-center gap-4 py-2 text-xl font-bold border-b border-orange-500/50"><Film /> Movies</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/software" className="flex items-center gap-4 py-2 text-xl font-bold border-b border-orange-500/50"><Download /> Software</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/subscription" className="flex items-center gap-4 py-2 text-xl font-bold border-b border-orange-500/50"><CreditCard /> Subscription</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/contact" className="flex items-center gap-4 py-2 text-xl font-bold border-b border-orange-500/50"><Phone /> Contact</Link>
              
              <div className="pt-4 flex flex-col gap-4">
                {user ? (
                  <>
                    <Link onClick={() => setIsMenuOpen(false)} to="/profile" className="flex items-center gap-4 py-3 px-4 bg-orange-700 rounded-xl text-lg font-bold shadow-inner"><User /> My Profile</Link>
                    {isAdmin && <Link onClick={() => setIsMenuOpen(false)} to="/admin" className="flex items-center gap-4 py-3 px-4 bg-black rounded-xl text-lg font-bold"><Download /> Admin Panel</Link>}
                    <button onClick={handleLogout} className="flex items-center gap-4 py-3 px-4 bg-red-600 rounded-xl text-lg font-bold text-white shadow-lg"><LogOut /> Logout Account</button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link onClick={() => setIsMenuOpen(false)} to="/login" className="text-center py-4 border-2 border-white rounded-2xl font-black text-lg">LOGIN</Link>
                    <Link onClick={() => setIsMenuOpen(false)} to="/signup" className="text-center py-4 bg-white text-orange-600 rounded-2xl font-black text-lg shadow-lg">SIGN UP</Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Modern Footer */}
      <footer className="bg-neutral-950 border-t border-white/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
            {/* Branding */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-black mb-6 tracking-tighter flex items-center justify-center md:justify-start gap-2">
                DJ ENOCH <span className="text-orange-500">PRO UG</span>
              </h3>
              <p className="text-gray-400 text-base leading-relaxed max-w-md mx-auto md:mx-0">
                Uganda's premier destination for professional DJ services, exclusive non-stop music mixes, 
                high-speed movie downloads, and mixing software. From Nyenje, Mukono to the world.
              </p>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-black text-sm uppercase tracking-widest text-orange-500 mb-6">Contact Support</h4>
              <ul className="text-gray-300 text-sm space-y-4">
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <span className="text-orange-500 font-bold">Email:</span> primerceug@gmail.com
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <span className="text-orange-500 font-bold">WhatsApp:</span> +256 747 816 444
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <span className="text-orange-500 font-bold">Payment:</span> Airtel Money Available
                </li>
              </ul>
            </div>

            {/* Quick Navigation */}
            <div>
              <h4 className="font-black text-sm uppercase tracking-widest text-orange-500 mb-6">Quick Links</h4>
              <nav className="flex flex-col gap-3 text-sm text-gray-400">
                <Link to="/music" className="hover:text-orange-500 transition-colors">Music Library</Link>
                <Link to="/movies" className="hover:text-orange-500 transition-colors">Movie Streaming</Link>
                <Link to="/software" className="hover:text-orange-500 transition-colors">DJ Software</Link>
                <Link to="/subscription" className="hover:text-orange-500 transition-colors">Access Passes</Link>
              </nav>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
              &copy; {new Date().getFullYear()} DJ ENOCH PRO UG. ALL RIGHTS RESERVED.
            </p>
            <p className="text-gray-600 text-[10px] font-bold italic">
              ENGINEERED FOR THE UGANDAN PARTY BEAST.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}