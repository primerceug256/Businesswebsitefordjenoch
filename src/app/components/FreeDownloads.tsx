import { useState, useRef, useEffect } from "react";
import { Play, Pause, Download, Loader, Clock, Volume2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

export function FreeDownloads({ searchQuery = "" }: { searchQuery?: string }) {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  useEffect(() => {
    const fetchTracks = async () => {
      const { data } = await supabase
        .from('music_tracks')
        .select('*')
        .order('created_at', { ascending: false });
      setTracks(data || []);
      setLoading(false);
    };
    fetchTracks();
  }, []);

  const handlePlay = (track: any) => {
    if (playingId === track.id) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      audioRef.current.src = track.audio_url;
      audioRef.current.play();
      setPlayingId(track.id);
    }
  };

  const filtered = tracks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <section id="downloads" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black italic tracking-tighter">FREE <span className="text-orange-600">MIXES</span></h2>
          <p className="text-gray-500 font-bold uppercase text-[10px]">Total Mixes: {tracks.length}</p>
        </div>

        {loading ? <div className="flex justify-center"><Loader className="animate-spin text-orange-600" /></div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((track) => (
              <div key={track.id} className="bg-gray-50 border-2 border-gray-100 rounded-[32px] p-6 hover:shadow-2xl transition-all group">
                <div className="relative aspect-square bg-black rounded-2xl mb-6 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button onClick={() => handlePlay(track)} className="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl">
                      {playingId === track.id ? <Pause fill="white"/> : <Play fill="white" className="ml-1"/>}
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-black uppercase italic line-clamp-1 mb-1">{track.title}</h3>
                <p className="text-orange-600 text-[10px] font-bold mb-6 flex items-center gap-2">
                   <Clock size={12}/> {track.duration} • <Volume2 size={12}/> HIGH QUALITY
                </p>
                <a href={track.audio_url} download className="flex items-center justify-center gap-2 w-full bg-black text-white py-4 rounded-2xl font-black text-xs hover:bg-orange-600 transition-all">
                  <Download size={16}/> DOWNLOAD MP3
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}