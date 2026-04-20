import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { Trash2, RefreshCw, Music, Film, Package, Check, X, Send, Image as ImageIcon } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState({ users: [], payments: [], drops: [] });
  const [content, setContent] = useState({ music: [], movies: [], software: [] });
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const h = { Authorization: `Bearer ${publicAnonKey}` };
    try {
      const [uR, pR, muR, moR, swR, drR] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/users`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/payments/pending`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/tracks`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/movies/list`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/software/list`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/drops/list`, { headers: h })
      ]);
      
      setContent({ music: (await muR.json()).tracks || [], movies: (await moR.json()).movies || [], software: (await swR.json()).software || [] });
      setData({ users: (await uR.json()).users || [], payments: (await pR.json()).payments || [], drops: await drR.json() || [] });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { if (!isAdmin) navigate('/'); else fetchAll(); }, [isAdmin]);

  const deleteItem = async (type: string, id: string) => {
    if (!confirm("Delete permanently?")) return;
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/${type}/delete/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${publicAnonKey}` }
    });
    fetchAll();
  };

  const setDropStatus = async (id: string, status: string) => {
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/drops/status`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ id, status })
    });
    fetchAll();
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-20 font-sans">
      <div className="bg-slate-900 p-4 border-b border-white/5 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-black text-orange-500 uppercase tracking-tighter">Admin Control</h1>
        <button onClick={fetchAll} className={loading ? "animate-spin" : ""}><RefreshCw size={20}/></button>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['overview', 'dj drops', 'music', 'movies', 'software'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${tab === t ? 'bg-orange-600 shadow-lg shadow-orange-600/20' : 'bg-slate-900 text-slate-500'}`}>{t}</button>
          ))}
        </div>

        {tab === 'dj drops' && (
          <div className="grid gap-4">
            {data.drops.map((d: any) => (
              <div key={d.id} className="bg-slate-900 p-6 rounded-[32px] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                   <p className="text-orange-500 font-black text-xl uppercase italic tracking-tighter">{d.djName}</p>
                   <p className="text-xs text-slate-400 font-bold">{d.email} • {d.contact}</p>
                </div>
                <div className="text-center">
                   <a href={d.proofUrl} target="_blank" className="text-[10px] font-black uppercase bg-white/5 px-4 py-2 rounded-full hover:bg-orange-600 transition-all inline-block">View Proof</a>
                   <p className="text-[9px] font-mono text-slate-500 mt-2">{d.transactionId}</p>
                </div>
                <div className="flex items-center gap-3">
                   {d.status === 'pending' ? (
                     <>
                        <button onClick={() => setDropStatus(d.id, 'accepted')} className="bg-green-600 p-3 rounded-2xl"><Check size={20}/></button>
                        <button onClick={() => setDropStatus(d.id, 'denied')} className="bg-red-600 p-3 rounded-2xl"><X size={20}/></button>
                     </>
                   ) : d.status === 'accepted' ? (
                      <div className="relative">
                        <input type="file" id={`up-${d.id}`} className="hidden" onChange={async (e) => {
                           const file = e.target.files?.[0]; if(!file) return;
                           const fd = new FormData(); fd.append("file", file); fd.append("id", d.id);
                           await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/drops/send`, {
                             method:'POST', headers:{Authorization:`Bearer ${publicAnonKey}`}, body:fd
                           });
                           fetchAll();
                        }} />
                        <label htmlFor={`up-${d.id}`} className="bg-orange-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase flex items-center gap-2 cursor-pointer"><Send size={14}/> Send Final MP3</label>
                      </div>
                   ) : <p className="font-black text-[10px] uppercase text-slate-500">{d.status}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {(tab === 'music' || tab === 'movies' || tab === 'software') && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-slate-900 p-8 rounded-[40px] border border-white/5">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                  {tab === 'music' ? <Music/> : tab === 'movies' ? <Film/> : <Package/>} Manage {tab}
                </h2>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                   {(tab === 'music' ? content.music : tab === 'movies' ? content.movies : content.software).map((item:any) => (
                     <div key={item.id} className="bg-black/40 p-4 rounded-3xl border border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-4 overflow-hidden">
                           <img src={item.thumbnailUrl} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                           <p className="font-bold text-sm truncate">{item.title}</p>
                        </div>
                        <button onClick={() => deleteItem(tab === 'music' ? 'track' : tab === 'movies' ? 'movie' : 'software', item.id)} className="text-red-500 hover:bg-red-500/10 p-3 rounded-2xl transition-all"><Trash2 size={18}/></button>
                     </div>
                   ))}
                </div>
              </div>
              <div className="bg-slate-900 p-8 rounded-[40px] border border-white/5">
                 <h2 className="text-xl font-black uppercase mb-6">New Upload</h2>
                 <UploadFormWithThumb type={tab} onSuccess={fetchAll} />
              </div>
           </div>
        )}
      </div>
    </div>
  );
}

function UploadFormWithThumb({ type, onSuccess }: { type: string, onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [thumb, setThumb] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const start = async (e: any) => {
    e.preventDefault();
    if(!file || !thumb) return alert("File & Thumbnail Required!");
    setLoading(true);
    const fd = new FormData(); fd.append("file", file); fd.append("thumbnail", thumb); fd.append("title", title);
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/${type}/upload`, {
      method: 'POST', headers: { Authorization: `Bearer ${publicAnonKey}` }, body: fd
    });
    setLoading(false); setTitle(''); setFile(null); setThumb(null); onSuccess();
  };

  return (
    <form onSubmit={start} className="space-y-6">
       <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-white/10 rounded-3xl p-6 text-center hover:border-orange-500 transition-all bg-black/20">
             <input type="file" accept="image/*" id={`t-${type}`} className="hidden" onChange={e => setThumb(e.target.files?.[0] || null)} />
             <label htmlFor={`t-${type}`} className="cursor-pointer flex flex-col items-center gap-2">
                <ImageIcon className={thumb ? "text-green-500" : "text-slate-600"}/>
                <p className="text-[8px] font-black uppercase">{thumb ? thumb.name : "Thumbnail"}</p>
             </label>
          </div>
          <div className="border-2 border-dashed border-white/10 rounded-3xl p-6 text-center hover:border-orange-500 transition-all bg-black/20">
             <input type="file" id={`f-${type}`} className="hidden" onChange={e => { setFile(e.target.files?.[0] || null); if(!title) setTitle(e.target.files?.[0].name.split('.')[0] || '') }} />
             <label htmlFor={`f-${type}`} className="cursor-pointer flex flex-col items-center gap-2">
                <RefreshCw className={file ? "text-orange-500" : "text-slate-600"}/>
                <p className="text-[8px] font-black uppercase">{file ? file.name : "Media File"}</p>
             </label>
          </div>
       </div>
       <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full bg-black p-4 rounded-2xl border border-white/5 outline-none focus:border-orange-500" required />
       <button disabled={loading} className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">{loading ? "Uploading..." : "Publish to Website"}</button>
    </form>
  );
}