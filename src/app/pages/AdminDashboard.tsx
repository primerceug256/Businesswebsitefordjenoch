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
      const [muR, moR, swR, drR] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/tracks`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/movies/list`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/software/list`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/drops/list`, { headers: h })
      ]);
      setContent({ music: (await muR.json()).tracks || [], movies: (await moR.json()).movies || [], software: (await swR.json()).software || [] });
      setData({ ...data, drops: await drR.json() || [] });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { if (!isAdmin) navigate('/'); else fetchAll(); }, [isAdmin]);

  const deleteItem = async (type: string, id: string) => {
    if (!confirm("Permanent Delete?")) return;
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/${type}/delete/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${publicAnonKey}` } });
    fetchAll();
  };

  const setStatus = async (id: string, status: string) => {
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/drops/status`, {
      method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${publicAnonKey}`}, body:JSON.stringify({id,status})
    });
    fetchAll();
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-20 p-4">
      <div className="flex justify-between items-center mb-8 bg-slate-900 p-6 rounded-3xl border border-white/5">
         <h1 className="text-2xl font-black text-orange-500 uppercase italic">Admin Dash</h1>
         <button onClick={fetchAll} className={loading ? "animate-spin" : ""}><RefreshCw/></button>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto">
        {['dj drops', 'music', 'movies', 'software'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase ${tab === t ? 'bg-orange-600' : 'bg-slate-900'}`}>{t}</button>
        ))}
      </div>

      {tab === 'dj drops' && (
        <div className="grid gap-4">
          {data.drops.map((d: any) => (
            <div key={d.id} className="bg-slate-900 p-6 rounded-[32px] border border-white/5 flex justify-between items-center">
              <div><p className="font-black text-xl text-orange-500 italic uppercase">{d.djName}</p><p className="text-xs text-slate-500">{d.status}</p></div>
              <div className="flex gap-3">
                {d.status === 'pending' && (
                  <><button onClick={()=>setStatus(d.id, 'accepted')} className="bg-green-600 p-2 rounded-lg"><Check/></button>
                  <button onClick={()=>setStatus(d.id, 'denied')} className="bg-red-600 p-2 rounded-lg"><X/></button></>
                )}
                {d.status === 'accepted' && (
                  <input type="file" onChange={async e => {
                    const fd = new FormData(); fd.append("file", e.target.files?.[0]!); fd.append("id", d.id);
                    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/drops/send`, { method:'POST', headers:{Authorization:`Bearer ${publicAnonKey}`}, body:fd });
                    fetchAll();
                  }} />
                )}
                <button onClick={() => deleteItem('drop_order', d.id)} className="text-red-500"><Trash2/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(tab === 'music' || tab === 'movies' || tab === 'software') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-slate-900 p-8 rounded-[40px] border border-white/5">
              <h2 className="text-xl font-black uppercase mb-6 italic">Manage {tab}</h2>
              <div className="space-y-3">
                {(tab==='music'?content.music : tab==='movies'?content.movies : content.software).map((i:any) => (
                  <div key={i.id} className="bg-black/40 p-4 rounded-3xl flex justify-between items-center border border-white/5">
                    <div className="flex items-center gap-4"><img src={i.thumbnailUrl} className="w-10 h-10 rounded-xl object-cover"/><p className="text-sm font-bold truncate">{i.title}</p></div>
                    <button onClick={()=>deleteItem(tab==='music'?'track':tab==='movies'?'movie':'software', i.id)} className="text-red-500"><Trash2/></button>
                  </div>
                ))}
              </div>
           </div>
           <div className="bg-slate-900 p-8 rounded-[40px] border border-white/5">
              <h2 className="text-xl font-black uppercase mb-6 italic">Upload {tab}</h2>
              <Upload category={tab} onSuccess={fetchAll} />
           </div>
        </div>
      )}
    </div>
  );
}

function Upload({ category, onSuccess }: any) {
  const [f, setF] = useState<File|null>(null);
  const [t, setT] = useState<File|null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const start = async (e: any) => {
    e.preventDefault(); setLoading(true);
    const fd = new FormData(); fd.append("file", f!); fd.append("thumbnail", t!); fd.append("title", title);
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/${category}/upload`, {
      method: 'POST', headers: { Authorization: `Bearer ${publicAnonKey}` }, body: fd
    });
    setLoading(false); setF(null); setT(null); setTitle(''); onSuccess();
  };

  return (
    <form onSubmit={start} className="space-y-4">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Enter Title" className="w-full bg-black p-4 rounded-2xl border border-white/5" required />
      <div className="grid grid-cols-2 gap-4">
        <label className="bg-black p-6 rounded-2xl border border-dashed border-white/10 text-center cursor-pointer">
          <ImageIcon className="mx-auto mb-2 text-slate-500"/>
          <p className="text-[10px] font-black uppercase text-slate-400">{t ? t.name : "Thumbnail"}</p>
          <input type="file" accept="image/*" className="hidden" onChange={e=>setT(e.target.files?.[0]!)} />
        </label>
        <label className="bg-black p-6 rounded-2xl border border-dashed border-white/10 text-center cursor-pointer">
          <RefreshCw className="mx-auto mb-2 text-slate-500"/>
          <p className="text-[10px] font-black uppercase text-slate-400">{f ? f.name : "Media File"}</p>
          <input type="file" className="hidden" onChange={e=>setF(e.target.files?.[0]!)} />
        </label>
      </div>
      <button disabled={loading} className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase">{loading ? "Uploading..." : "Publish Content"}</button>
    </form>
  );
}