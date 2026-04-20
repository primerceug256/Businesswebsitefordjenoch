import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Library, Download, Music, Clock, CheckCircle, XCircle } from 'lucide-react';
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

export default function MyLibrary() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch only the orders belonging to this logged-in user
      fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/drops/user/${user.id}`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      })
      .then(r => r.json())
      .then(data => {
        setOrders(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Library fetch error:", err);
        setLoading(false);
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center p-6">
        <div className="bg-slate-900 p-10 rounded-[40px] border border-white/5 shadow-2xl max-w-sm">
          <Library size={64} className="text-orange-600 mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">Login Required</h2>
          <p className="text-gray-500 mt-2 text-sm">Please login to access your purchased DJ drops and software tools.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic text-orange-500">My Library</h1>
                <p className="text-gray-500 font-medium">Tracking your orders and digital assets.</p>
            </div>
            <div className="bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.email}</p>
            </div>
        </div>

        {/* DJ DROPS TRACKING SECTION */}
        <section className="mb-16">
          <h2 className="text-xl font-black mb-6 uppercase tracking-widest flex items-center gap-3">
            <Music className="text-orange-500" size={24}/> Custom DJ Drop Status
          </h2>

          {loading ? (
            <div className="flex gap-2 items-center text-slate-500">
                <Clock className="animate-spin" size={16}/>
                <p className="text-xs font-bold uppercase tracking-widest">Checking server for drops...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-slate-900/50 p-12 rounded-[40px] border border-white/5 text-center">
              <Music size={40} className="mx-auto mb-4 text-slate-700" />
              <p className="text-gray-500 italic">No custom drops ordered yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((o: any) => (
                <div key={o.id} className="bg-slate-900 p-6 rounded-[32px] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-orange-500/30 transition-all">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl ${o.status === 'completed' ? 'bg-green-600/20' : 'bg-white/5'}`}>
                        <Music className={o.status === 'completed' ? 'text-green-500' : 'text-slate-500'}/>
                    </div>
                    <div>
                        <p className="text-xl font-black uppercase italic tracking-tighter text-white">{o.djName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                            o.status === 'denied' ? 'bg-red-500/20 text-red-500' :
                            o.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                            o.status === 'accepted' ? 'bg-blue-500/20 text-blue-500' : 'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {o.status}
                          </span>
                        </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {o.status === 'completed' ? (
                      <a 
                        href={o.dropUrl} 
                        download 
                        className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Download size={16}/> Download Now
                      </a>
                    ) : o.status === 'denied' ? (
                        <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-xl">
                            <XCircle size={14}/>
                            <p className="text-[10px] font-black uppercase">Order Rejected</p>
                        </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500 italic">
                        <Clock size={14}/>
                        <p className="text-[10px] font-black uppercase tracking-widest">In Queue</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* OTHER ASSETS (Software/Music) Placeholder */}
        <section>
            <h2 className="text-xl font-black mb-6 uppercase tracking-widest flex items-center gap-3 text-slate-400">
                <Download size={24}/>