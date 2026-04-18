import { useState, useRef, useEffect } from "react";
import { Play, Pause, Download, Music, Clock } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

export function FreeDownloads({ searchQuery = "" }: { searchQuery?: string }) {
  const [tracks, setTracks] = useState<any[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/tracks`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` }
    }).then(r => r.json()).then(data => setTracks(data.tracks || []));
  }, []);

  const handlePlay = (track: any) => {
    if (playingId === track.id) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play();
      setPlayingId(track.id);
    }
  };

  const filtered = tracks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <section id="downloads" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-black italic mb-10 text-center uppercase">Free <span className="text-orange-600">Music Center</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map(t => (
            <div key={t.id} className="bg-white p-6 rounded-[32px] shadow-xl border border-gray-100 group">
              <div className="relative aspect-square bg-black rounded-2xl mb-4 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000" className="w-full h-full object-cover opacity-40" />
                <button onClick={() => handlePlay(t)} className="absolute inset-0 m-auto w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center shadow-2xl">
                  {playingId === t.id ? <Pause fill="white"/> : <Play fill="white" className="ml-1"/>}
                </button>
              </div>
              <h3 className="font-black uppercase text-sm truncate">{t.title}</h3>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Clock size={12}/> {t.duration || "NON-STOP"}</span>
                <a href={t.audioUrl} download className="text-[10px] font-black bg-black text-white px-4 py-2 rounded-full uppercase hover:bg-orange-600 transition-all">Download MP3</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}