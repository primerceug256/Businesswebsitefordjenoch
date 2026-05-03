import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Home, LayoutGrid, Radio, Tv, User, Search, Bell, Cast } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const location = useLocation();
  const { userData } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', path: '/', icon: Home },
    { id: 'cats', label: 'Categories', path: '/movies', icon: LayoutGrid },
    { id: 'radio', label: 'Radio', path: '/music', icon: Radio },
    { id: 'live', label: 'Live TV', path: '/djtok', icon: Tv },
    { id: 'profile', label: 'You', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* TOP BAR (Always Visible) */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black flex items-center justify-between px-6 z-50">
         <Link to="/" className="text-orange-600 font-black text-xl italic tracking-tighter">
            DJ ENOCH PRO <span className="block text-[10px] -mt-1 text-white">UG</span>
         </Link>
         <div className="flex items-center gap-5 text-white">
            <Cast size={22} className="opacity-80" />
            <Bell size={22} className="opacity-80" />
            <Search size={22} className="opacity-80" />
         </div>
      </nav>

      {/* BOTTOM NAVIGATION (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 z-50 md:hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.id} 
              to={item.path} 
              className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-white scale-110' : 'text-gray-500'}`}
            >
              <div className={`${isActive ? 'bg-white/10 p-2 rounded-full' : ''}`}>
                <item.icon size={22} strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}