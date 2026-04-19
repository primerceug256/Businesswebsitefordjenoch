import { Outlet, Link, useNavigate } from 'react-router';
import { 
  ShoppingCart, LogOut, Home, Music, Film, Download, 
  ShieldCheck, Menu, X, Calendar, Library, CreditCard, 
  User, HelpCircle, Info, Briefcase, Zap 
} from 'lucide-react';
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
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-black tracking-tighter">
            DJ ENOCH <span className="bg-black text-white px-2 rounded">PRO UG</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {/* ADMIN FAST ACCESS TAB (ONLY FOR YOU) */}
            {isAdmin && (
              <Link to="/admin" className="hidden md:flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                <ShieldCheck size={12} /> Admin Mode
              </Link>
            )}
            
            <Link to="/cart" className="relative p-2 bg-black/10 rounded-full">
              <ShoppingCart size={22} />
              {items.length > 0 && <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{items.length}</span>}
            </Link>
            <button className="p-2 bg-black/20 rounded-lg" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* FULL SCREEN MENU */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 bg-black z-50 overflow-y-auto pb-20 animate-in slide-in-from-right duration-300">
            <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              
              {/* CORE SERVICES */}
              <div>
                <h3 className="text-orange-500 text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><Zap size={14} /> Core Services</h3>
                <nav className="flex flex-col gap-4">
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/movies" icon={<Film />} label="Movies & Series" sub="HD Streaming Library" />
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/music" icon={<Music />} label="Music Library" sub="Playlists & Trending" />
                </nav>
              </div>

              {/* PROFESSINAL TOOLS */}
              <div>
                <h3 className="text-blue-500 text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><Briefcase size={14} /> Professional Hub</h3>
                <nav className="flex flex-col gap-4">
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/software" icon={<Download />} label="Software Hub" sub="Applications & Tools" />
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/software" icon={<Zap />} label="DJ Tools & Drops" sub="Custom Marketplace" />
                </nav>
              </div>

              {/* BOOKING & ADMIN */}
              <div>
                <h3 className="text-green-500 text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><Calendar size={14} /> User & Support</h3>
                <nav className="flex flex-col gap-4">
                  {isAdmin && (
                    <MenuLink onClick={() => setIsMenuOpen(false)} to="/admin" icon={<ShieldCheck />} label="Admin Dashboard" iconColor="text-yellow-400" sub="Manage Website" />
                  )}
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/contact" icon={<Calendar />} label="Bookings" sub="Hire for Event" />
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/my-library" icon={<Library />} label="My Library" sub="Purchased Content" />
                </nav>
              </div>
            </div>

            <div className="container mx-auto px-6 mt-10">
              {user ? (
                <button onClick={() => { logout(); setIsMenuOpen(false); navigate('/'); }} className="w-full flex items-center justify-center gap-3 py-4 bg-red-600/10 text-red-500 rounded-2xl font-black border border-red-600/20">
                  <LogOut /> LOGOUT ({user.email})
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link onClick={() => setIsMenuOpen(false)} to="/login" className="py-4 text-center border-2 border-white rounded-2xl font-black">LOGIN</Link>
                  <Link onClick={() => setIsMenuOpen(false)} to="/signup" className="py-4 text-center bg-white text-orange-600 rounded-2xl font-black">SIGN UP</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      <main className="flex-grow"><Outlet /></main>
    </div>
  );
}

function MenuLink({ to, icon, label, sub, onClick, iconColor = "text-white" }: any) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-900 transition-all group">
      <div className={`p-3 bg-gray-800 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-all ${iconColor}`}>{icon}</div>
      <div>
        <p className="font-black text-lg leading-tight">{label}</p>
        <p className="text-gray-500 text-xs font-medium">{sub}</p>
      </div>
    </Link>
  );
}