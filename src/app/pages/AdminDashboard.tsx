import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { MusicUploadForm } from '../components/uploads/MusicUploadForm';
import { MovieUploadForm } from '../components/uploads/MovieUploadForm';
import { SoftwareUploadForm } from '../components/uploads/SoftwareUploadForm';
import { AdminStats } from './AdminStats';
import { AdminSubs } from './AdminSubs';
import { Trash2, RefreshCw } from 'lucide-react';

const DURS: any = { spark: 0.08, blaze: 0.25, daily: 1, weekly: 7, monthly: 30, diamond: 365, unlimited: 36500 };

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState({ users: [], payments: [] });
  const [content, setContent] = useState({ music: [], movies: [], software: [] });
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const h = { Authorization: `Bearer ${publicAnonKey}` };
    try {
      const [uR, pR, muR, moR, swR] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/users`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/payments/pending`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/tracks`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/movies/list`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/software/list`, { headers: h })
      ]);
      
      const [uD, pD, muD, moD, swD] = await Promise.all([uR.json(), pR.json(), muR.json(), moR.json(), swR.json()]);
      
      setData({ users: uD.users || [], payments: pD.payments || [] });
      setContent({ music: muD.tracks || [], movies: moD.movies || [], software: swD.software || [] });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { if (!isAdmin) navigate('/'); else fetchAll(); }, [isAdmin]);

  const deleteItem = async (type: string, id: string) => {
    if (!confirm("Delete this permanently?")) return;
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/${type}/delete/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${publicAnonKey}` }
    });
    fetchAll();
  };

  const approve = async (p: any) => {
    let pId = 'monthly';
    try { const items = JSON.parse(p.items); pId = items[0]?.id || 'monthly'; } catch (e) {}
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/approve-subscription`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ paymentId: p.id, userId: p.userId, planId: pId, durationDays: DURS[pId] || 30 })
    });
    fetchAll();
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-10 font-sans">
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-black text-orange-500 tracking-tighter text-xl">DJ ENOCH ADMIN</h1>
        <button onClick={fetchAll} className="bg-orange-600 p-2 rounded-full hover:rotate-180 transition-all duration-500">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['overview', 'subscriptions', 'manage content'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap ${tab === t ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400'}`}>{t}</button>
          ))}
        </div>

        {tab === 'overview' && <AdminStats users={data.users} payments={data.payments} />}
        {tab === 'subscriptions' && <AdminSubs payments={data.payments} onApprove={approve} />}
        
        {tab === 'manage content' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* MUSIC SECTION */}
            <div className="space-y-4">
               <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <h2 className="text-purple-400 font-black mb-4 uppercase text-sm">Music Library</h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {content.music.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                        <span className="text-xs truncate max-w-[150px]">{item.title}</span>
                        <button onClick={() => deleteItem('track', item.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
               </div>
               <MusicUploadForm onSuccess={fetchAll}/>
            </div>

            {/* MOVIES SECTION */}
            <div className="space-y-4">
               <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <h2 className="text-red-400 font-black mb-4 uppercase text-sm">Movie Library</h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {content.movies.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                        <span className="text-xs truncate max-w-[150px]">{item.title}</span>
                        <button onClick={() => deleteItem('movie', item.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
               </div>
               <MovieUploadForm onSuccess={fetchAll}/>
            </div>

            {/* SOFTWARE SECTION */}
            <div className="space-y-4">
               <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <h2 className="text-orange-400 font-black mb-4 uppercase text-sm">Software Hub</h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {content.software.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                        <span className="text-xs truncate max-w-[150px]">{item.title}</span>
                        <button onClick={() => deleteItem('software', item.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
               </div>
               <SoftwareUploadForm onSuccess={fetchAll}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}