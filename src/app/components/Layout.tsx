import { Outlet, Link, useNavigate } from 'react-router';
import { ShoppingCart, User, LogOut, Home, Music, Film, Download, Phone, CreditCard, Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl md:text-2xl font-black text-white tracking-tighter">
              DJ ENOCH <span className="text-black">PRO UG</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 font-bold">
              <Link to="/" className="hover:text-orange-100">Home</Link>
              <Link to="/music" className="hover:text-orange-100">Music</Link>
              <Link to="/movies" className="hover:text-orange-100">Movies</Link>
              <Link to="/software" className="hover:text-orange-100">Software</Link>
              
              {/* ADMIN DASHBOARD LINK - ONLY VISIBLE TO YOU */}
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1 text-black bg-yellow-400 px-3 py-1 rounded-full animate-pulse">
                  <ShieldCheck size={16} /> ADMIN PANEL
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold hidden sm:inline">{user.email}</span>
                  <button onClick={() => { logout(); navigate('/'); }} className="bg-black/20 p-2 rounded-full hover:bg-black/40">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold text-sm">Login</Link>
              )}
              
              <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}