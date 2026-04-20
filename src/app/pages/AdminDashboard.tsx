import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { 
  Trash2, RefreshCw, Music, Film, Package, 
  Check, X, Send, Image as ImageIcon, 
  ShieldAlert, Eye, ExternalLink, CreditCard 
} from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('approvals');
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [approvals, setApprovals] = useState([]);
  const [drops, setDrops] = useState([]);
  const [music, setMusic] = useState([]);
  const [movies, setMovies] = useState([]);
  const [software, setSoftware] = useState([]);

  const fetchAllData = async () => {
    setLoading(true);
    const headers = { Authorization: `Bearer ${publicAnonKey}` };
    try {
      // 1. Fetch Approvals (Pending Payments)
      const appRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/pending`, { headers });
      const appData = await appRes.json();
      setApprovals(appData || []);

      // 2. Fetch DJ Drops
      const dropRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/drops/list`, { headers });
      const dropData = await dropRes.json();
      setDrops(dropData || []);

      // 3. Fetch Music
      const musicRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/tracks`, { headers });
      const musicData = await musicRes.json();
      setMusic(musicData.tracks || []);

      // 4. Fetch Movies
      const movieRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/movies/list`, { headers });
      const movieData = await movieRes.json();
      setMovies(movieData.movies || []);

      // 5. Fetch Software
      const swRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/software/list`, { headers });
      const swData = await swRes.json();
      setSoftware(swData.software || []);

    } catch (e) {
      console.error("Error fetching admin data:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isAdmin) navigate('/');
    else fetchAllData();
  }, [isAdmin]);

  // Handle Approvals (Subscriptions/Software)
  const handleApprovalAction = async (paymentId: string, action: 'accept' | 'reject', userId: string, plan: string) => {
    if (!confirm(`Confirm ${action}?`)) return;
    setLoading(true);
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/process-approval`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ paymentId, action, userId, planType: plan })
    });
    fetchAllData();
  };

  // Handle Deletions
  const deleteItem = async (type: string, id: string) => {
    if (!confirm("Permanent Delete? This cannot be undone.")) return;
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/${type}/delete/${id}`, { 
      method: 'DELETE', 
      headers: { Authorization: `Bearer ${publicAnonKey}` } 
    });
    fetchAllData();
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-20 p-4 font-sans">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10 bg-slate-900 p-6 rounded-[40px] border border-white/5 shadow-2xl">
         <div>
            <h1 className="text-3xl font-black text-orange-500 uppercase italic tracking-tighter">Beast Dashboard</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Admin master access</p>
         </div>
         <button 
           onClick={fetchAllData} 
           className={`p-4 bg-black rounded-full transition-all active:scale-90 ${loading ? "animate-spin text-orange-500" : "text-slate-400"}`}
         >
            <RefreshCw size={24}/>
         </button>
      </div>

      {/* Dynamic Tabs */}
      <div className="max-w-7xl mx-auto flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
        {[
          { id: 'approvals', label: 'Approvals', count: approvals.length, icon: CreditCard },
          { id: 'dj drops', label: 'DJ Drops', count: drops.filter(d => d.status === 'pending').length, icon: Send },
          { id: 'music', label: 'Music', icon: Music },
          { id: 'movies', label: 'Movies', icon: Film },
          { id: 'software', label: 'Software', icon: Package }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setTab(t.id)} 
            className={`flex items-center gap-3 px-8 py-4 rounded-3xl text-[11px] font-black uppercase transition-all whitespace-nowrap border ${
              tab === t.id 
              ? 'bg-orange-600 border-orange-500 shadow-xl shadow-orange-900/20 scale-105' 
              : 'bg-slate-900 border-white/5 text-slate-500 hover:bg-slate-800'
            }`}
          >
            <t.icon size={16}/>
            {t.label} 
            {t.count > 0 && <span className="bg-white text-black px-2 py-0.5 rounded-full text-[9px]">{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* APPROVALS TAB CONTENT */}
        {tab === 'approvals' && (
          <div className="grid gap-4">
            {approvals.length === 0 ? (
              <div className="text-center py-32 bg-slate-900/20 rounded-[60px] border-2 border-dashed border-white/5">
                  <Check className="mx-auto mb-6 text-slate-800" size={64}/>
                  <p className="text-xl font-black text-slate-600 uppercase italic">No pending approvals</p>
              </div>
            ) : (
              approvals.map((p: any) => (
                <div key={p.id} className="bg-slate-900 p-8 rounded-[48px] border border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8 group hover:border-orange-500/30 transition-all">
                  <div className="flex gap-6 items-center">
                    <div className="bg-black p-6 rounded-[32px] border border-white/5 group-hover:bg-orange-600 transition-colors">
                      <ShieldAlert className="text-white" size={32}/>
                    </div>
                    <div>
                      <p className="font-black text-2xl uppercase italic tracking-tighter">{p.userName || 'Customer'}</p>
                      <p className="text-xs text-slate-500 font-bold mt-1">Transaction: <span className="text-orange-500 font-mono">{p.transactionId}</span></p>
                      <div className="flex gap-2 mt-4">
                          <span className="bg-green-600/10 text-green-500 text-[10px] px-4 py-2 rounded-full font-black uppercase border border-green-500/10">UGX {p.total}</span>
                          <span className="bg-blue-600/10 text-blue-500 text-[10px] px-4 py-2 rounded-full font-black uppercase border border-blue-500/10">{p.items}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full lg:w-auto">
                    {p.proofUrl && (
                      <a href={p.proofUrl} target="_blank" className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-slate-800 text-white px-8 py-5 rounded-[24px] text-[11px] font-black uppercase hover:bg-white hover:text-black transition-all">
                        <Eye size={18}/> Proof
                      </a>
                    )}
                    <button onClick={() => handleApprovalAction(p.id, 'accept', p.userId, p.items)} className="bg-green-600 p-6 rounded-[24px] hover:scale-110 transition-all shadow-xl shadow-green-900/20"><Check size={28}/></button>
                    <button onClick={() => handleApprovalAction(p.id, 'reject', p.userId, p.items)} className="bg-red-600 p-6 rounded-[24px] hover:scale-110 transition-all shadow-xl shadow-red-900/20"><X size={28}/></button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* DJ DROPS TAB */}
        {tab === 'dj drops' && (
          <div className="grid gap-4">
            {drops.map((d: any) => (
              <div key={d.id} className="bg-slate-900 p-8 rounded-[48px] border border-white/5 flex justify-between items-center">
                <div>
                  <p className="font-black text-2xl text-orange-500 italic uppercase tracking-tighter">{d.djName}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Status: {d.status}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => deleteItem('drop_order', d.id)} className="p-4 bg-red-600/10 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20}/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTENT TABS (MUSIC, MOVIES, SOFTWARE) */}
        {(tab === 'music' || tab === 'movies' || tab === 'software') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* List Section */}
             <div className="bg-slate-900 p-10 rounded-[60px] border border-white/5 shadow-2xl">
                <h2 className="text-2xl font-black uppercase mb-8 italic flex items-center gap-3">
                  {tab === 'music' ? <Music/> : tab === 'movies' ? <Film/> : <Package/>} 
                  Manage {tab}
                </h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {(tab === 'music' ? music : tab === 'movies' ? movies : software).map((item: any) => (
                    <div key={item.id} className="bg-black/40 p-5 rounded-[32px] flex justify-between items-center border border-white/5 hover:border-orange-500/20 transition-all">
                      <div className="flex items-center gap-5 overflow-hidden">
                        <img src={item.thumbnailUrl || 'https://via.placeholder.com/150'} className="w-14 h-14 rounded-2xl object-cover shadow-lg" />
                        <div className="overflow-hidden">
                          <p className="text-sm font-black truncate uppercase italic">{item.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{item.releaseDate}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteItem(tab === 'music' ? 'track' : tab === 'movies' ? 'movie' : 'software', item.id)} 
                        className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  ))}
                </div>
             </div>

             {/* Upload Section */}
             <div className="bg-slate-900 p-10 rounded-[60px] border border-white/5 shadow-2xl h-fit sticky top-24">
                <h2 className="text-2xl font-black uppercase mb-8 italic">New {tab} Upload</h2>
                <UploadForm category={tab} onSuccess={fetchAllData} />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Upload Component
function UploadForm({ category, onSuccess }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [thumb, setThumb] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const startUpload = async (e: any) => {
    e.preventDefault();
    if (!file || !thumb) return alert("Select both thumbnail and media file!");
    
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("thumbnail", thumb);
    fd.append("title", title);
    
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/${category}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        body: fd
      });
      setFile(null); setThumb(null); setTitle('');
      onSuccess();
    } catch (e) {
      alert("Upload failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={startUpload} className="space-y-6">
      <input 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        placeholder="Content Title..." 
        className="w-full bg-black p-5 rounded-3xl border border-white/5 focus:border-orange-500 outline-none font-bold italic uppercase transition-all" 
        required 
      />
      
      <div className="grid grid-cols-2 gap-4">
        <label className="bg-black p-8 rounded-3xl border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-orange-500/40 transition-all group">
          <ImageIcon className="mx-auto mb-3 text-slate-600 group-hover:text-orange-500" size={32}/>
          <p className="text-[9px] font-black uppercase text-slate-500 group-hover:text-white">
            {thumb ? thumb.name.substring(0,10)+'...' : "Thumbnail"}
          </p>
          <input type="file" accept="image/*" className="hidden" onChange={e => setThumb(e.target.files?.[0] || null)} />
        </label>

        <label className="bg-black p-8 rounded-3xl border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-orange-500/40 transition-all group">
          <RefreshCw className={`mx-auto mb-3 text-slate-600 group-hover:text-orange-500 ${loading ? "animate-spin" : ""}`} size={32}/>
          <p className="text-[9px] font-black uppercase text-slate-500 group-hover:text-white">
            {file ? file.name.substring(0,10)+'...' : "Media File"}
          </p>
          <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
        </label>
      </div>

      <button 
        disabled={loading} 
        className="w-full bg-orange-600 py-6 rounded-[32px] font-black uppercase italic tracking-widest text-lg hover:bg-orange-500 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-2xl shadow-orange-900/30"
      >
        {loading ? "Uploading Content..." : "Publish to Library"}
      </button>
    </form>
  );
}