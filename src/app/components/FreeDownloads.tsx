import { useState, useRef, useEffect } from "react";
import { Music, Play, Pause, Download, Loader, Volume2 } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function FreeDownloads() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/tracks`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` }
    }).then(r => r.json()).then(data => {
      setTracks(data.tracks || []);
      setLoading(false);
    });
  }, []);

  const handlePlay = (track: any) => {
    if (playingTrackId === track.id) {
      audioRef.current.pause();
      setPlayingTrackId(null);
    } else {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play();
      setPlayingTrackId(track.id);
    }
  };

  return (
    <section id="downloads" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black italic tracking-tighter">FREE <span className="text-orange-600">MIXES</span></h2>
          <p className="text-gray-500">Listen live and download your favorite non-stop sessions</p>
        </div>

        {loading ? <div className="flex justify-center"><Loader className="animate-spin text-orange-600" /></div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tracks.map((track) => (
              <div key={track.id} className="bg-gray-50 border-2 border-gray-100 rounded-[32px] p-6 hover:shadow-2xl transition-all group">
                <div className="relative aspect-square bg-black rounded-2xl mb-6 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => handlePlay(track)}
                      className="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
                    >
                      {playingTrackId === track.id ? <Pause fill="white"/> : <Play fill="white" className="ml-1"/>}
                    </button>
                  </div>
                  {playingTrackId === track.id && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1 bg-orange-500 animate-bounce" style={{ animationDelay: `${i * 0.1}s`, height: '20px' }} />
                      ))}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-black uppercase italic line-clamp-1 mb-1">{track.title}</h3>
                <p className="text-orange-600 text-xs font-bold mb-6 flex items-center gap-2">
                  <Clock size={12}/> {track.duration || "NON-STOP"} • <Volume2 size={12}/> 320KBPS
                </p>
                <a 
                  href={track.audioUrl} 
                  download 
                  className="flex items-center justify-center gap-2 w-full bg-black text-white py-4 rounded-2xl font-black text-sm hover:bg-orange-600 transition-all"
                >
                  <Download size={18}/> DOWNLOAD MP3
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}