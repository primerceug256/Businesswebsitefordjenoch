import { useState, useEffect } from 'react';
import { Download, Music as MusicIcon, Play, Pause, Search } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Track {
  id: string;
  title: string;
  type: string;
  duration: string;
  releaseDate: string;
  audioUrl: string;
  fileName: string;
  mediaType?: string; // 'audio' or 'video'
}

export default function Music() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'audio' | 'video'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/tracks`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );
      const data = await response.json();
      setTracks(data.tracks || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTracks = tracks.filter(track => {
    if (filter === 'all') return true;
    return track.mediaType === filter;
  });

  const searchedTracks = filteredTracks.filter(track =>
    track.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Music Library
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-orange-600' : 'bg-gray-800'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('audio')}
              className={`px-4 py-2 rounded-lg ${filter === 'audio' ? 'bg-orange-600' : 'bg-gray-800'}`}
            >
              Audio
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-4 py-2 rounded-lg ${filter === 'video' ? 'bg-orange-600' : 'bg-gray-800'}`}
            >
              Video
            </button>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search tracks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading music...</div>
        ) : searchedTracks.length === 0 ? (
          <div className="text-center text-gray-400">No tracks available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchedTracks.map((track) => (
              <div key={track.id} className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center">
                      <MusicIcon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{track.title}</h3>
                      <p className="text-sm text-gray-400">{track.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>{track.duration}</span>
                    <span>{track.releaseDate}</span>
                  </div>

                  {track.mediaType === 'video' && track.audioUrl && (
                    <video
                      src={track.audioUrl}
                      controls
                      className="w-full rounded-lg mb-4"
                    />
                  )}

                  {track.mediaType === 'audio' && track.audioUrl && (
                    <audio src={track.audioUrl} controls className="w-full mb-4" />
                  )}

                  <a
                    href={track.audioUrl}
                    download
                    className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Download Free
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}