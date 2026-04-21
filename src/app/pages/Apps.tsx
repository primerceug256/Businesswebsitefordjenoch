import { useState, useEffect } from 'react';
import { Smartphone, Download, ShieldCheck, Zap, Loader, Search } from 'lucide-react';
import { projectId, publicAnonKey } from '@utils/supabase/info';

export default function Apps() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/software/list`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` }
    })
    .then(res => res.json())
    .then(data => {
      const softwareList = Array.isArray(data.software) ? data.software : Object.values(data.software || {});
      const appList = softwareList.filter((item: any) => 
        item.platform === 'Android' || item.platform === 'iOS' || item.category.toLowerCase().includes('app')
      );
      setApps(appList);
      setLoading(false);
    });
  }, []);

  const filtered = apps.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div>
            <h1 className="text-7xl font-black uppercase italic tracking-tighter text-orange-500">Mobile Apps</h1>
            <p className="text-slate-400 mt-2 text-lg font-bold uppercase">Official tools for the Beast</p>
          </div>
          <input 
            placeholder="Search apps..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md bg-slate-900 border border-white/5 p-5 rounded-3xl outline-none focus:border-orange-500 font-bold"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader className="animate-spin text-orange-500" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((app) => (
              <div key={app.id} className="bg-slate-900 rounded-[50px] border border-white/5 overflow-hidden group hover:border-orange-500/40 transition-all p-10 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                    <div className="w-24 h-24 bg-black rounded-[32px] border border-white/10 flex items-center justify-center overflow-hidden">
                        {app.thumbnailUrl ? <img src={app.thumbnailUrl} className="w-full h-full object-cover" /> : <Smartphone size={40} className="text-orange-500" />}
                    </div>
                    <span className="bg-green-600/10 text-green-500 text-[10px] font-black uppercase px-4 py-2 rounded-full border border-green-500/20">Secure APK</span>
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-orange-500 transition-colors">{app.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">{app.description || "Official mobile experience for DJ Enoch Pro fans."}</p>
                <a href={app.downloadUrl} download className="flex items-center justify-center gap-3 w-full bg-orange-600 py-6 rounded-[30px] font-black uppercase italic hover:bg-orange-500 transition-all shadow-xl">
                    <Download size={22}/> Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}