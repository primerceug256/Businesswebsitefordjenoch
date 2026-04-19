import { Outlet, Link, useNavigate } from 'react-router';
import { ShoppingCart, LogOut, Home, Music, Film, Download, ShieldCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-black">DJ ENOCH <span className="bg-black text-white px-2 rounded">PRO UG</span></Link>
          
          <nav className="hidden lg:flex items-center gap-6 font-bold">
            <Link to="/">Home</Link>
            <Link to="/music">Music</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/software">Software</Link>
            
            {/* ONLY YOU SEE THIS */}
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-1 bg-yellow-400 text-black px-4 py-1 rounded-full animate-pulse">
                <ShieldCheck size={18} /> ADMIN DASHBOARD
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold hidden sm:inline">{user.email}</span>
                <button onClick={() => { logout(); navigate('/'); }} className="p-2 bg-black/20 rounded-full"><LogOut size={20}/></button>
              </div>
            ) : (
              <Link to="/login" className="bg-white text-orange-600 px-4 py-1.5 rounded-lg font-bold">Login</Link>
            )}
            <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X/> : <Menu/>}</button>
          </div>
        </div>
      </header>
      <main className="flex-grow"><Outlet /></main>
    </div>
  );
}