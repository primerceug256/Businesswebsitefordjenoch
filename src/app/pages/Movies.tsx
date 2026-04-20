import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Play, Download } from 'lucide-react';
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function Movies() {
  const [movies, setMovies] = useState<any[]>([]);
  
  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/movies/list`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` }
    }).then(r => r.json()).then(d => setMovies(d.movies || []));
  }, []);

  const download = (m: any) => {
    const link = document.createElement("a");
    link.href = m.videoUrl;
    link.setAttribute("download", `${m.title}.mp4`); // EXACT NAME
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-black min-h-screen p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
      {movies.map(m => (
        <div key={m.id} className="bg-slate-900 rounded-3xl overflow-hidden border border-white/5">
          <img src={m.thumbnailUrl} className="aspect-[2/3] object-cover" />
          <div className="p-4 flex justify-between items-center">
            <Link to={`/movies/watch/${m.id}`} className="text-orange-500"><Play size={30}/></Link>
            <button onClick={()=>download(m)} className="text-white"><Download/></button>
          </div>
        </div>
      ))}
    </div>
  );
}