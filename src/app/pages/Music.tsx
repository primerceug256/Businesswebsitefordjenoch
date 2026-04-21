import { useState, useEffect } from 'react';
import { Download, Music as MusicIcon, Play, Pause, Loader } from 'lucide-react';
import { projectId, publicAnonKey } from '@utils/supabase/info';

export default function Music() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/music/tracks`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data = await response.json();
      const tracks = Array.isArray(data.tracks) ? data.tracks : Object.values(data.tracks || {});
      setTracks(tracks);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-black mb-10 text-orange-500 uppercase italic">Music Library</h1>

        {loading ? (
          <div className="flex justify-center py-20"><Loader className="animate-spin text-orange-500" size={40} /></div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800">
            <MusicIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-slate-500">No music found. Try uploading from the Admin Dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track: any) => (
              <div key={track.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-orange-600 p-3 rounded-full"><MusicIcon size={24} /></div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold truncate text-lg">{track.title}</h3>
                    <p className="text-xs text-slate-400">{track.artist || 'DJ ENOCH PRO'}</p>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-6 uppercase font-bold tracking-widest">
                    <span>{track.duration || 'Full Mix'}</span>
                    <span>{track.releaseDate}</span>
                </div>
                <audio src={track.audioUrl} controls className="w-full h-8 mb-4 opacity-50 hover:opacity-100 transition-opacity" />
                <a href={track.audioUrl} download className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-3 rounded-xl font-bold text-sm transition-all uppercase">
                  Download Free
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}