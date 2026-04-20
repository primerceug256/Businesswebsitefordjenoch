--- START OF FILE Businesswebsitefordjenoch-main/src/app/pages/Apps.tsx ---
import { useState, useEffect } from 'react';
import { Smartphone, Download, ShieldCheck, Zap, Loader, Search } from 'lucide-react';
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface AppItem {
  id: string;
  title: string;
  description: string;
  version: string;
  platform: string;
  category: string;
  downloadUrl: string;
  thumbnailUrl?: string;
}

export default function Apps() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/software/list`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data = await response.json();
      // Specifically filter for Mobile/Android platforms
      const appList = (Array.isArray(data.software) ? data.software : []).filter(
        (item: any) => item.platform === 'Android' || item.platform === 'iOS' || item.category.toLowerCase().includes('app')
      );
      setApps(appList);
    } catch (error) {
      console.error('Error fetching apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = apps.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-6xl font-black uppercase italic tracking-tighter text-orange-500">Mobile Apps</h1>
            <p className="text-slate-400 mt-2 text-lg font-bold">The Party Beast Android & iOS Tools</p>
          </div>
          
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              placeholder="Search apps..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500 transition-all font-bold"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader className="animate-spin text-orange-500" size={40} /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 bg-slate-900/20 rounded-[60px] border border-white/5">
             <Smartphone size={64} className="mx-auto mb-6 text-slate-800" />
             <p className="text-xl font-black text-slate-600 uppercase italic">No apps found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((app) => (
              <div key={app.id} className="bg-slate-900 rounded-[48px] border border-white/5 overflow-hidden group hover:border-orange-500/30 transition-all shadow-2xl">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-20 h-20 bg-black rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                      {app.thumbnailUrl ? (
                        <img src={app.thumbnailUrl} alt={app.title} className="w-full h-full object-cover" />
                      ) : (
                        <Smartphone size={32} className="text-orange-500" />
                      )}
                    </div>
                    <span className="bg-green-600/10 text-green-500 text-[10px] font-black uppercase px-4 py-2 rounded-full border border-green-500/10">Secure APK</span>
                  </div>
                  
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 group-hover:text-orange-500 transition-colors">{app.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-8 leading-relaxed">{app.description || "Official mobile application for DJ Enoch Pro fans and music lovers."}</p>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-[9px] font-black uppercase text-slate-500 px-3 py-2 bg-black rounded-xl border border-white/5">Version {app.version || "1.0"}</div>
                    <div className="text-[9px] font-black uppercase text-orange-500 px-3 py-2 bg-orange-500/5 rounded-xl border border-orange-500/10">{app.platform}</div>
                  </div>

                  <a 
                    href={app.downloadUrl} 
                    download 
                    className="flex items-center justify-center gap-3 w-full bg-orange-600 py-5 rounded-[24px] font-black uppercase italic tracking-widest hover:bg-orange-500 transition-all active:scale-95 shadow-xl shadow-orange-900/20"
                  >
                    <Download size={20}/> Download Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Promo Footer */}
        <div className="mt-20 bg-gradient-to-br from-orange-600 to-pink-600 rounded-[60px] p-12 text-center shadow-2xl relative overflow-hidden">
            <Zap className="absolute top-10 right-10 text-white/10 w-40 h-40" />
            <div className="relative z-10">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-white">Build Your Own App</h2>
                <p className="max-w-xl mx-auto text-lg font-bold text-white/80 mb-10">We create professional Android and iOS applications for businesses, DJs, and radio stations. High performance, custom design.</p>
                <a href="/web-development" className="inline-block bg-white text-orange-600 px-12 py-5 rounded-full text-lg font-black uppercase hover:bg-slate-100 transition-all shadow-xl">Contact Developers</a>
            </div>
        </div>
      </div>
    </div>
  );
}