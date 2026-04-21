import { Outlet, Link, useNavigate } from 'react-router';
import { ShoppingCart, User, LogOut, Home, Music, Film, Download, Phone, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold text-white">
              DJ ENOCH PRO UG
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 hover:text-orange-200">
                <Home size={18} />
                Home
              </Link>
              <Link to="/services" className="hover:text-orange-200">Services</Link>
              <Link to="/music" className="flex items-center gap-2 hover:text-orange-200">
                <Music size={18} />
                Music
              </Link>
              <Link to="/nonstop" className="hover:text-orange-200">Nonstop</Link>
              <Link to="/movies" className="flex items-center gap-2 hover:text-orange-200">
                <Film size={18} />
                Movies
              </Link>
              <Link to="/software" className="flex items-center gap-2 hover:text-orange-200">
                <Download size={18} />
                Software
              </Link>
              <Link to="/subscription" className="flex items-center gap-2 hover:text-orange-200">
                <CreditCard size={18} />
                Subscription
              </Link>
              <Link to="/contact" className="flex items-center gap-2 hover:text-orange-200">
                <Phone size={18} />
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative hover:text-orange-200">
                <ShoppingCart size={24} />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="bg-orange-700 px-4 py-2 rounded-lg text-sm hover:bg-orange-800"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 hover:text-orange-200">
                    <User size={20} />
                    {user.name || 'Profile'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:text-orange-200"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="hover:text-orange-200">Login</Link>
                  <Link
                    to="/signup"
                    className="bg-white text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-gray-900 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 DJ ENOCH PRO UG. All rights reserved.</p>
          <p className="mt-2">+256747816444 | primerceug@gmail.com</p>
        </div>
      </footer>
    </div>
  );
}