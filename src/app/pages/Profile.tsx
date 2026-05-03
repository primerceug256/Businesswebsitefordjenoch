import { useAuth } from '../context/AuthContext';
import { User, LogOut, Trash2, RefreshCcw, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

export default function Profile() {
  const { user, userData, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans pb-32 pt-20">
      {/* USER HEADER */}
      <div className="flex items-center gap-4 mb-10">
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-600 to-pink-600 p-1">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
             {userData?.avatar ? <img src={userData.avatar} className="w-full h-full object-cover" /> : <User size={40}/>}
          </div>
          <button className="absolute bottom-0 right-0 bg-orange-500 p-1.5 rounded-full border-2 border-black">
             <RefreshCcw size={12} className="text-black font-black" />
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-black italic">{userData?.name || 'User'}</h1>
          <p className="text-gray-500 text-xs font-bold">{user?.email}</p>
          <div className="flex items-center gap-1 mt-1">
             <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_green]" />
             <span className="text-[10px] text-green-500 font-black uppercase">App Up To Date</span>
          </div>
        </div>
      </div>

      {/* SUBSCRIPTION CARD LIKE SCREENSHOT */}
      <Card className="bg-[#111827] border-none rounded-3xl p-6 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-1 h-full bg-orange-600" />
        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Member Pass</p>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
          {userData?.subscription || 'Free Access Mode'}
        </h2>
        
        {/* Progress Bar */}
        <div className="space-y-2">
           <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full bg-red-600 ${userData?.subscription ? 'w-1/2' : 'w-full opacity-30'}`} />
           </div>
           <p className="text-[10px] font-bold text-red-500 uppercase">Subscription has ended</p>
        </div>

        <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
           <span className="text-gray-400 text-xs font-bold">Simultaneous Devices</span>
           <span className="text-white text-xs font-black uppercase tracking-widest">2 Devices</span>
        </div>
      </Card>

      {/* QUICK STATS */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        <div className="bg-[#111827] p-4 rounded-2xl text-center">
           <p className="text-xl font-black text-white">5</p>
           <p className="text-[9px] text-gray-500 font-bold uppercase">Watched</p>
        </div>
        <div className="bg-[#111827] p-4 rounded-2xl text-center">
           <p className="text-xl font-black text-white">0</p>
           <p className="text-[9px] text-gray-500 font-bold uppercase">Saved</p>
        </div>
        <div className="bg-[#111827] p-4 rounded-2xl text-center">
           <p className="text-[9px] font-black text-white leading-tight">28 Mar 2026</p>
           <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Since</p>
        </div>
      </div>

      {/* RECENT PAYMENTS */}
      <div className="space-y-4 mb-10">
        <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em]">Recent Payments</h3>
        <div className="bg-[#111827] p-5 rounded-2xl flex items-center justify-between border border-white/5">
           <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={18} />
              <p className="text-xs font-bold text-gray-300">03 Apr, 23:25</p>
           </div>
           <p className="text-sm font-black text-white uppercase">UGX 1,100</p>
        </div>
      </div>

      {/* SETTINGS */}
      <div className="space-y-2 mb-10">
        <button className="w-full bg-[#111827] p-5 rounded-2xl flex items-center gap-4 group active:scale-95 transition">
           <RefreshCcw className="text-orange-500" />
           <div className="text-left">
              <p className="text-sm font-black uppercase text-orange-500 tracking-tighter">Renew Subscription</p>
              <p className="text-[10px] text-gray-500 font-bold">Tap here to activate your account</p>
           </div>
        </button>
        <button onClick={() => signOut()} className="w-full bg-[#111827] p-5 rounded-2xl flex items-center gap-4 group active:scale-95 transition">
           <LogOut className="text-gray-400" />
           <div className="text-left">
              <p className="text-sm font-black uppercase text-white tracking-tighter">Sign Out</p>
              <p className="text-[10px] text-gray-500 font-bold">Securely exit your session</p>
           </div>
        </button>
      </div>

      {/* SECURITY */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-red-600 uppercase tracking-[0.2em]">Account Security</h3>
        <button className="w-full bg-red-900/10 border border-red-500/20 p-5 rounded-2xl flex items-center gap-4 group">
           <Trash2 className="text-red-500" />
           <div className="text-left">
              <p className="text-sm font-black uppercase text-red-500 tracking-tighter">Delete My Account</p>
              <p className="text-[10px] text-red-500/50 font-bold">Erase all data and active plans</p>
           </div>
        </button>
      </div>
    </div>
  );
}