import { motion } from "motion/react";
import { Film, Download, Clock, Star, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from '@utils/supabase/info';

interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: string;
  releaseYear: string;
  quality: string;
  videoUrl: string;
  fileName: string;
}

function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  const handleDownload = () => {
    if (movie.videoUrl) {
      const link = document.createElement("a");
      link.href = movie.videoUrl;
      link.download = movie.title;
      link.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
    >
      {/* Movie Header */}
      <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-red-600 p-3 rounded-lg">
            <Film className="w-6 h-6 text-white" />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
            {movie.quality}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{movie.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{movie.description || "No description available"}</p>
      </div>

      {/* Movie Details */}
      <div className="p-6">
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Star className="w-4 h-4 text-orange-500" />
            <span className="text-sm">{movie.genre}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{movie.duration} • {movie.releaseYear}</span>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Free
        </button>
      </div>
    </motion.div>
  );
}

export function MoviesSection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/movies/list`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      setMovies(Array.isArray(data.movies) ? data.movies : Object.values(data.movies || {}));
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError(err instanceof Error ? err.message : "Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  if (movies.length === 0 && !loading && !error) {
    return (
      <section id="movies" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Free Movies
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No movies uploaded yet. Check back soon!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="movies" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Free Movies
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Download high-quality movies absolutely free!
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <Loader className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading movies...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && movies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
