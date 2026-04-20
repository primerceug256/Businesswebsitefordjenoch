import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Library, Download, Music, Clock } from 'lucide-react';
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

export default function MyLibrary() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/drops/user/${user.id}`, { headers: { Authorization: `Bearer ${publicAnonKey}` } })
      .then(r => r.json()).then(d => setOrders(d || []));
    }
  }, [user]);

  if (!user) return <div className="min-h-screen bg-black flex items-center justify-center p-6"><h2 className="text-xl font-black uppercase text-slate-500">Login to view library</h2></div>;

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 font-sans">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic text-orange-500 mb-10">My Library</h1>
        <div className="grid gap-4">
          {orders.map((o: any) => (
            <div key={o.id} className="bg-slate-900 p-6 rounded-[32px] border border-white/5 flex justify-between items-center group hover:border-orange-500/30 transition-all">
                <div>
                    <p className="text-xl font-black uppercase italic tracking-tighter">{o.djName}</p>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${o.status === 'completed' ? 'bg-green-600/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{o.status}</span>
                </div>
                {o.status === 'completed' ? (
                  <a href={o.dropUrl} download className="bg-green-600 px-6 py-3 rounded-2xl font-black text-xs uppercase">Download Drop</a>
                ) : <Clock className="text-slate-700"/>}
            </div>
          ))}
          {orders.length === 0 && <div className="text-center py-20 bg-slate-900/50 rounded-[40px] border border-white/5 text-slate-600 font-bold uppercase">No active orders found</div>}
        </div>
      </div>
    </div>
  );
}