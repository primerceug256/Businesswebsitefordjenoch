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