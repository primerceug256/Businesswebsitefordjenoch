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
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-black tracking-tighter">
            DJ ENOCH <span className="bg-black text-white px-2 rounded">PRO UG</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 bg-black/10 rounded-full">
              <ShoppingCart size={22} />
              {items.length > 0 && <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{items.length}</span>}
            </Link>
            <button className="p-2 bg-black/20 rounded-lg" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* FULL SCREEN STRUCTURED MENU */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 bg-black z-50 overflow-y-auto pb-20 animate-in slide-in-from-right duration-300">
            <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              
              {/* SECTION 1: CORE SERVICES (Entertainment) */}
              <div>
                <h3 className="text-orange-500 text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Zap size={14} /> Core Services
                </h3>
                <nav className="flex flex-col gap-4">
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/movies" icon={<Film />} label="Movies & Series" sub="HD Streaming Library" />
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/music" icon={<Music />} label="Music Library" sub="Playlists & Trending" />
                </nav>
              </div>

              {/* SECTION 2: PROFESSIONAL TOOLS */}
              <div>
                <h3 className="text-blue-500 text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Briefcase size={14} /> Professional Tools
                </h3>
                <nav className="flex flex-col gap-4">
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/software" icon={<Download />} label="Software Hub" sub="Applications & Tools" />
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/software" icon={<Zap />} label="DJ Tools & Drops" sub="Custom Marketplace" />
                </nav>
              </div>

              {/* SECTION 3: USER & BOOKINGS */}
              <div>
                <h3 className="text-green-500 text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Calendar size={14} /> User & Booking
                </h3>
                <nav className="flex flex-col gap-4">
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/contact" icon={<Calendar />} label="Bookings" iconColor="text-green-500" sub="Hire for Event" />
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/my-library" icon={<Library />} label="My Library" sub="Your Downloads" />
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/subscription" icon={<CreditCard />} label="Pricing & Plans" sub="Subscription Tiers" />
                </nav>
              </div>

              {/* SECTION 4: ACCOUNT & SUPPORT */}
              <div className="md:border-t border-gray-800 pt-8 lg:pt-0 lg:border-t-0">
                <h3 className="text-purple-500 text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <User size={14} /> Account & Support
                </h3>
                <nav className="flex flex-col gap-4">
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/profile" icon={<User />} label="User Profile" sub="Manage Account" />
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/contact" icon={<HelpCircle />} label="Support Center" sub="FAQs & Contact" />
                  <MenuLink onClick={() => setIsMenuOpen(false)} to="/learn-more" icon={<Info />} label="About DJ Enoch" sub="Our Story & Brand" />
                </nav>
              </div>

              {/* ADMIN SECTION */}
              {isAdmin && (
                <div className="bg-yellow-400/10 p-6 rounded-3xl border border-yellow-400/20">
                  <h3 className="text-yellow-400 text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} /> Admin Only
                  </h3>
                  <Link onClick={() => setIsMenuOpen(false)} to="/admin" className="flex items-center gap-3 bg-yellow-400 text-black p-3 rounded-xl font-black text-center justify-center">
                    ADMIN DASHBOARD
                  </Link>
                </div>
              )}
            </div>

            {/* BOTTOM LOGOUT */}
            <div className="container mx-auto px-6 mt-10">
              {user ? (
                <button onClick={() => { logout(); setIsMenuOpen(false); navigate('/'); }} className="w-full flex items-center justify-center gap-3 py-4 bg-red-600/10 text-red-500 rounded-2xl font-black border border-red-600/20">
                  <LogOut /> LOGOUT ACCOUNT
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

// Helper Component for Menu Links
function MenuLink({ to, icon, label, sub, onClick, iconColor = "text-white" }: any) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-900 transition-all group">
      <div className={`p-3 bg-gray-800 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-all ${iconColor}`}>
        {icon}
      </div>
      <div>
        <p className="font-black text-lg leading-tight">{label}</p>
        <p className="text-gray-500 text-xs font-medium">{sub}</p>
      </div>
    </Link>
  );
}