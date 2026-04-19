import { Outlet, Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { Menu, X, ShoppingCart, User, LogOut, Music, Film, Download, Home, Phone, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Footer } from './Footer';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/music', label: 'Music', icon: Music },
    { to: '/movies', label: 'Movies', icon: Film },
    { to: '/software', label: 'Software', icon: Download },
    { to: '/services', label: 'Services', icon: Settings },
    { to: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-pink-600 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold">
              DJ ENOCH PRO UG
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="hover:text-orange-200 transition-colors flex items-center gap-1"
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <ShoppingCart size={20} />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {items.length}
                  </span>
                )}
              </Link>

              {/* Auth Actions */}
              {user ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 bg-yellow-500 text-black px-3 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
                      title="Admin Dashboard"
                    >
                      <Settings size={20} />
                      <span className="hidden lg:inline text-sm">Admin</span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
                    title="Profile"
                  >
                    <User size={20} />
                    <span className="hidden lg:inline text-sm">Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                    <span className="hidden lg:inline text-sm">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-orange-600 font-semibold hover:bg-orange-50 transition-colors"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-white/20">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <link.icon size={20} />
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
