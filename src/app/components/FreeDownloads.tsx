import { motion } from "motion/react";
import { Download, Music, Clock, Play, Pause, Loader } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface MusicTrack { id: string; title: string; type: string; duration: string; releaseDate: string; audioUrl?: string; }

export function FreeDownloads({ searchQuery = "" }: { searchQuery?: string }) {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/tracks`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` }
    }).then(r => r.json()).then(data => {
      setTracks(data.tracks || []);
      setLoading(false);
    });
  }, []);

  const filteredTracks = tracks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <section id="downloads" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900">Free Music Downloads</h2>
      </div>

      {loading ? <Loader className="mx-auto animate-spin" /> : (
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTracks.map((track) => (
            <div key={track.id} className="bg-white p-6 rounded-xl shadow border border-gray-100">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Music className="text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{track.title}</h3>
              <a href={track.audioUrl} download className="block w-full text-center bg-gray-900 text-white py-2 rounded font-bold hover:bg-black transition">
                Download Now
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}