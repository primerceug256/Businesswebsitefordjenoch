import { Outlet, Link, useNavigate } from 'react-router';
import { ShoppingCart, Music, Film, Download, ShieldCheck, Menu, X, Library, Briefcase, Zap, Headphones, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { AdminUploadPanel } from './AdminUploadPanel';

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 sticky top-0 z-50 shadow-xl h-16 flex items-center px-4 justify-between">
          <Link to="/" className="text-xl font-black tracking-tighter">DJ ENOCH <span className="bg-black px-2 rounded ml-1">PRO UG</span></Link>
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 bg-black/10 rounded-full">
              <ShoppingCart size={22} />
              {items.length > 0 && <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{items.length}</span>}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-black/20 rounded-lg">{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
          </div>

        {isMenuOpen && (
          <div className="fixed inset-0 top-16 bg-black z-50 p-6 overflow-y-auto animate-in slide-in-from-right">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
              <div>
                <h3 className="text-orange-500 text-xs font-black uppercase mb-6 flex items-center gap-2"><Zap size={14}/> Essentials</h3>
                <nav className="flex flex-col gap-3">
                  <MenuLink onClick={()=>setIsMenuOpen(false)} to="/music" icon={<Music/>} label="Music" sub="Audio Library" />
                  <MenuLink onClick={()=>setIsMenuOpen(false)} to="/movies" icon={<Film/>} label="Movies" sub="HD Series" />
                  <MenuLink onClick={()=>setIsMenuOpen(false)} to="/apps" icon={<Smartphone/>} label="Apps" sub="Android APKs" iconColor="text-pink-500" />
                </nav>
              </div>
              <div>
                <h3 className="text-blue-500 text-xs font-black uppercase mb-6 flex items-center gap-2"><Briefcase size={14}/> Pro Hub</h3>
                <nav className="flex flex-col gap-3">
                  <MenuLink onClick={()=>setIsMenuOpen(false)} to="/dj-drops" icon={<Headphones/>} label="DJ Drops" sub="Order Custom" iconColor="text-orange-500" />
                  <MenuLink onClick={()=>setIsMenuOpen(false)} to="/software" icon={<Download/>} label="Software" sub="PC Tools" />
                </nav>
              </div>
              <div>
                <h3 className="text-green-500 text-xs font-black uppercase mb-6 flex items-center gap-2"><Library size={14}/> Account</h3>
                <nav className="flex flex-col gap-3">
                  <MenuLink onClick={()=>setIsMenuOpen(false)} to="/my-library" icon={<Library/>} label="Library" sub="Your Access" />
                  {isAdmin && <MenuLink onClick={()=>setIsMenuOpen(false)} to="/admin" icon={<ShieldCheck/>} label="Admin" iconColor="text-yellow-400" sub="System Control" />}
                </nav>
              </div>
            </div>
            {user && <button onClick={()=>{logout(); setIsMenuOpen(false); navigate('/')}} className="mt-12 w-full py-5 bg-red-600/10 text-red-500 rounded-2xl font-black border border-red-600/20 uppercase tracking-widest">Logout ({user.email})</button>}
          </div>
        )}
      </header>
      <main className="flex-grow"><Outlet /></main>
      <AdminUploadPanel />
    </div>
  );
}

function MenuLink({ to, icon, label, sub, onClick, iconColor = "text-white" }: any) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-900 group">
      <div className={`p-3 bg-slate-900 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-all ${iconColor}`}>{icon}</div>
      <div><p className="font-black text-lg uppercase italic tracking-tighter">{label}</p><p className="text-slate-500 text-[10px] font-bold uppercase">{sub}</p></div>
    </Link>
  );
}