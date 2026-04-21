import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
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

export default function Nonstop() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState<'all' | 'audio' | 'video'>('all');
  const [loading, setLoading] = useState(true);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

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

  const currentTrack = filteredTracks[currentIndex];

  const playPause = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTracks.length) % filteredTracks.length);
    setIsPlaying(true);
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  useEffect(() => {
    if (mediaRef.current && isPlaying) {
      mediaRef.current.play();
    }
  }, [currentIndex]);

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Nonstop Player
          </h1>
          <p className="text-gray-400">Continuous playback of all tracks</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              filter === 'all' ? 'bg-orange-600' : 'bg-gray-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('audio')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              filter === 'audio' ? 'bg-orange-600' : 'bg-gray-800'
            }`}
          >
            Audio Only
          </button>
          <button
            onClick={() => setFilter('video')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              filter === 'video' ? 'bg-orange-600' : 'bg-gray-800'
            }`}
          >
            Video Only
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading tracks...</div>
        ) : filteredTracks.length === 0 ? (
          <div className="text-center text-gray-400">No tracks available</div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Current Track Display */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 mb-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2">{currentTrack?.title}</h2>
                <p className="text-gray-400">{currentTrack?.type}</p>
              </div>

              {/* Media Player */}
              <div className="mb-6">
                {currentTrack?.mediaType === 'video' ? (
                  <video
                    ref={mediaRef as any}
                    src={currentTrack.audioUrl}
                    onEnded={handleTrackEnded}
                    className="w-full rounded-lg"
                    controls
                  />
                ) : (
                  <audio
                    ref={mediaRef as any}
                    src={currentTrack?.audioUrl}
                    onEnded={handleTrackEnded}
                    className="w-full"
                    controls
                  />
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={prevTrack}
                  className="bg-gray-800 hover:bg-gray-700 p-4 rounded-full transition-colors"
                >
                  <SkipBack size={24} />
                </button>
                <button
                  onClick={playPause}
                  className="bg-orange-600 hover:bg-orange-700 p-6 rounded-full transition-colors"
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </button>
                <button
                  onClick={nextTrack}
                  className="bg-gray-800 hover:bg-gray-700 p-4 rounded-full transition-colors"
                >
                  <SkipForward size={24} />
                </button>
              </div>

              {/* Track Info */}
              <div className="mt-6 text-center text-sm text-gray-400">
                Track {currentIndex + 1} of {filteredTracks.length}
              </div>
            </div>

            {/* Playlist */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4">Playlist</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTracks.map((track, index) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsPlaying(true);
                    }}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      index === currentIndex
                        ? 'bg-orange-600'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{track.title}</p>
                        <p className="text-sm text-gray-400">{track.type}</p>
                      </div>
                      <div className="text-sm text-gray-400">{track.duration}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
