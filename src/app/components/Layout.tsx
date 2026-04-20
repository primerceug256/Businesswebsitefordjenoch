--- START OF FILE Businesswebsitefordjenoch-main/src/app/components/Layout.tsx ---
import { Outlet, Link, useNavigate } from 'react-router';
import { ShoppingCart, LogOut, Music, Film, Download, ShieldCheck, Menu, X, Library, Briefcase, Zap, Headphones, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { AdminUploadPanel } from './AdminUploadPanel';

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* --- STICKY HEADER --- */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 sticky top-0 z-50 shadow-xl h-16 flex items-center px-4 justify-between">
          <Link to="/" className="text-xl font-black tracking-tighter">
            DJ ENOCH <span className="bg-black px-2 rounded ml-1">PRO UG</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 bg-black/10 rounded-full hover:bg-black/20 transition-all">
              <ShoppingCart size={22} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-[