import { useState, useEffect } from 'react';
import { Download, Music as MusicIcon } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Track {
  id: string;
  title: string;
  type: string;
  duration: string;
  releaseDate: string;
  audioUrl: string;
  fileName: string;
  mediaType?: string;
}

export default function Music() {
  const [tracks, setTracks] = useState<Track[]>([]);
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
      setTracks(data.tracks || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Music Library
        </h1>
        {loading ? (
          <div className="text-center text-gray-400">Loading music...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <div key={track.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center">
                    <MusicIcon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{track.title}</h3>
                    <p className="text-sm text-gray-400">{track.type}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>{track.duration}</span>
                  <span>{track.releaseDate}</span>
                </div>
                <audio src={track.audioUrl} controls className="w-full mb-4" />
                <a
                  href={track.audioUrl}
                  download
                  className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
                >
                  <Download size={18} />
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