import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { MusicUploadForm } from '../components/uploads/MusicUploadForm';
import { MovieUploadForm } from '../components/uploads/MovieUploadForm';
import { SoftwareUploadForm } from '../components/uploads/SoftwareUploadForm';
import { AdminStats } from './AdminStats';
import { AdminSubs } from './AdminSubs';
import { Trash2, RefreshCw, Music, Film, Package } from 'lucide-react';

const DURS: any = { spark: 0.08, blaze: 0.25, daily: 1, weekly: 7, monthly: 30, diamond: 365, unlimited: 36500 };

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState({ users: [], payments: [] });
  
  // New state to hold the list of uploaded items
  const [content, setContent] = useState({ music: [], movies: [], software: [] });
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const h = { Authorization: `Bearer ${publicAnonKey}` };
    try {
      // Fetching everything: Users, Payments, Music, Movies, and Software
      const [uR, pR, muR, moR, swR] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/users`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/payments/pending`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/tracks`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/movies/list`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/software/list`, { headers: h })
      ]);
      
      const [uD, pD, muD, moD, swD] = await Promise.all([uR.json(), pR.json(), muR.json(), moR.json(), swR.json()]);
      
      setData({ users: uD.users || [], payments: pD.payments || [] });
      setContent({ 
        music: muD.tracks || [], 
        movies: moD.movies || [], 
        software: swD.software || [] 
      });
    } catch (e) {
      console.error("Failed to fetch dashboard data:", e);
    }
    setLoading(false);
  };

  useEffect(() => { 
    if (!isAdmin) navigate('/'); 
    else fetchAll(); 
  }, [isAdmin]);

  // The Delete Function
  const deleteItem = async (type: string, id: string) => {
    if (!confirm("Are you sure? This will delete the file and the record permanently.")) return;
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/${type}/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      
      if (response.ok) {
        alert("Deleted successfully!");
        fetchAll(); // Refresh the list
      } else {
        alert("Failed to delete.");
      }
    } catch (err) {
      alert("Error connecting to server.");
    }
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
    <div className="bg-slate-950 text-white min-h-screen pb-10">
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-black text-orange-500 tracking-tighter">DJ ENOCH ADMIN</h1>
        <button onClick={fetchAll} className={`bg-slate-800 p-2 rounded-full transition-all ${loading ? 'animate-spin' : ''}`}>
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['overview', 'subscriptions', 'manage music', 'manage movies', 'manage software'].map(t => (
            <button 
              key={t} 
              onClick={() => setTab(t)} 
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${tab === t ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-500'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'overview' && <AdminStats users={data.users} payments={data.payments} />}
        {tab === 'subscriptions' && <AdminSubs payments={data.payments} onApprove={approve} />}
        
        {/* NEW MANAGE MUSIC TAB */}
        {tab === 'manage music' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2"><Music className="text-purple-500"/> Current Music</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {content.music.map((m: any) => (
                  <div key={m.id} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 group">
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm truncate">{m.title}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{m.releaseDate}</p>
                    </div>
                    <button onClick={() => deleteItem('track', m.id)} className="bg-red-500/10 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <h2 className="text-xl font-black mb-6 uppercase">Upload New Music</h2>
              <MusicUploadForm onSuccess={fetchAll}/>
            </div>
          </div>
        )}

        {/* NEW MANAGE MOVIES TAB */}
        {tab === 'manage movies' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2"><Film className="text-red-500"/> Current Movies</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {content.movies.map((m: any) => (
                  <div key={m.id} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm truncate">{m.title}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{m.quality} • {m.genre}</p>
                    </div>
                    <button onClick={() => deleteItem('movie', m.id)} className="bg-red-500/10 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <h2 className="text-xl font-black mb-6 uppercase">Upload New Movie</h2>
              <MovieUploadForm onSuccess={fetchAll}/>
            </div>
          </div>
        )}

        {/* NEW MANAGE SOFTWARE TAB */}
        {tab === 'manage software' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2"><Package className="text-orange-500"/> Current Software</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {content.software.map((m: any) => (
                  <div key={m.id} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm truncate">{m.title}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{m.platform} • UGX {m.price}</p>
                    </div>
                    <button onClick={() => deleteItem('software', m.id)} className="bg-red-500/10 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <h2 className="text-xl font-black mb-6 uppercase">Upload New Software</h2>
              <SoftwareUploadForm onSuccess={fetchAll}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}