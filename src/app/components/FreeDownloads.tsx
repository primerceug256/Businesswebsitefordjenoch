import { motion } from "motion/react";
import { Download, Music, Clock, Play, Pause, Loader } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface MusicTrack {
  id: string;
  title: string;
  type: "Latest Mix" | "Non-Stop Mix";
  duration: string;
  releaseDate: string;
  audioUrl?: string;
  fileName?: string;
}

function TrackCard({ track, index }: { track: MusicTrack; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (track.audioUrl) {
      const link = document.createElement("a");
      link.href = track.audioUrl;
      link.download = track.title;
      link.click();
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 group"
    >
      {/* Track Header */}
      <div className={`p-6 ${
        track.type === "Latest Mix" 
          ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20" 
          : "bg-gradient-to-r from-blue-600/20 to-cyan-600/20"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${
            track.type === "Latest Mix"
              ? "bg-gradient-to-r from-purple-500 to-pink-500"
              : "bg-gradient-to-r from-blue-500 to-cyan-500"
          }`}>
            <Music className="w-6 h-6 text-white" />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            track.type === "Latest Mix"
              ? "bg-purple-500/20 text-purple-300"
              : "bg-blue-500/20 text-blue-300"
          }`}>
            {track.type}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{track.title}</h3>
      </div>

      {/* Track Details */}
      <div className="p-6">
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{track.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Play className="w-4 h-4" />
            <span className="text-sm">Released {track.releaseDate}</span>
          </div>
        </div>

        {/* Audio Control */}
        {track.audioUrl && (
          <div className="bg-black/40 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayPause}
                className={`p-3 rounded-full ${
                  isPlaying
                    ? "bg-gradient-to-r from-pink-500 to-purple-500"
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
                } text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-110`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1">
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {isPlaying ? "Playing..." : "Click play to preview"}
                </p>
              </div>
            </div>
            {/* Hidden audio element */}
            <audio ref={audioRef} src={track.audioUrl} />
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={!track.audioUrl}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Download Free
        </button>
      </div>
    </motion.div>
  );
}

export function FreeDownloads() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/music/tracks`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tracks");
      }

      const data = await response.json();
      setTracks(data.tracks || []);
    } catch (err) {
      console.error("Error fetching tracks:", err);
      setError(err instanceof Error ? err.message : "Failed to load tracks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="downloads" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Free Music Downloads
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Download the latest mixes and non-stop sessions absolutely FREE! Preview tracks before downloading.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading tracks...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 mb-8">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Tracks Grid */}
        {!loading && !error && tracks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track, index) => (
              <TrackCard key={track.id} track={track} index={index} />
            ))}
          </div>
        )}

        {/* No Tracks */}
        {!loading && !error && tracks.length === 0 && (
          <div className="text-center py-16">
            <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No tracks uploaded yet</p>
            <p className="text-gray-500">Use the "Upload Music" button to add your first mix!</p>
          </div>
        )}

        {/* Info Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200"
        >
          <div className="flex items-start gap-4">
            <Music className="w-12 h-12 text-purple-600 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Admin Upload System</h3>
              <p className="text-gray-700 mb-4">
                Click the purple "Music" button in the bottom right corner to upload tracks. Admin login required (password: enoch2026).
              </p>
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Upload Features:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Upload audio files up to <strong>5GB</strong> per file</li>
                  <li>Automatic hosting and streaming</li>
                  <li>Real audio preview with play/pause controls</li>
                  <li>Upload progress tracking</li>
                  <li>Metadata management (title, artist, genre, duration, release date)</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}