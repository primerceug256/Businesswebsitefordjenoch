import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Download, Music, Clock, Lock } from 'lucide-react';
import { projectId, publicAnonKey } from '@utils/supabase/info';

export default function MyLibrary() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch orders linked to this user
      fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/drops/user/${user.id}`, { 
        headers: { Authorization: `Bearer ${publicAnonKey}` } 
      })
      .then(r => r.json())
      .then(d => {
        setOrders(Array.isArray(d) ? d : []);
        setLoading(false);
      });
    }
  }, [user]);

  if (!user) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <h2 className="text-xl font-black uppercase text-slate-500">Please Login to see your library</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black italic uppercase text-orange-500 mb-10">My Library</h1>
        
        {loading ? (
            <div className="animate-pulse space-y-4">
                <div className="h-20 bg-slate-900 rounded-3xl"></div>
                <div className="h-20 bg-slate-900 rounded-3xl"></div>
            </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((o: any) => (
              <div key={o.id} className="bg-slate-900 p-6 rounded-[32px] border border-white/5 flex justify-between items-center group hover:border-orange-500/30 transition-all">
                  <div>
                      <p className="text-xl font-black uppercase italic tracking-tighter">{o.items?.[0]?.name || "DJ Product"}</p>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${o.status === 'paid' || o.status === 'completed' ? 'bg-green-600/20 text-green-500' : 'bg-yellow-600/20 text-yellow-500'}`}>
                            {o.status}
                        </span>
                      </div>
                  </div>

                  {/* ONLY SHOW DOWNLOAD IF STATUS IS PAID */}
                  {(o.status === 'paid' || o.status === 'completed') ? (
                    <button 
                        onClick={() => window.open(o.downloadUrl || o.dropUrl, '_blank')}
                        className="bg-orange-600 px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-orange-500 transition-all"
                    >
                        <Download size={16}/> Download
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-600">
                        <Lock size={16}/>
                        <span className="text-[10px] font-bold uppercase">Awaiting Payment</span>
                    </div>
                  )}
              </div>
            ))}

            {orders.length === 0 && (
                <div className="text-center py-20 bg-slate-900/50 rounded-[40px] border border-white/5 text-slate-600 font-bold uppercase italic">
                    You haven't purchased anything yet.
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}