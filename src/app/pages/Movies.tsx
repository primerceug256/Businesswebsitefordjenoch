import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Play, Download, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

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
  thumbnail?: string;
  vj?: string;
  type?: 'movie' | 'series';
}

const VJ_LIST = ['VJ Junior', 'VJ Jingo', 'VJ Emmy', 'VJ Kevo', 'VJ Ulio', 'VJ Shield', 'VJ Soul', 'VJ Banks', 'VJ Sammy', 'VJ HD', 'VJ Heavy Q', 'VJ Mark', 'VJ Ice P', 'VJ Kin', 'VJ Ham', 'VJ Mumba', 'VJ Nelly', 'VJ Zaid', 'VJ Kriss', 'VJ MK', 'VJ Uncle T', 'VJ Waza'];

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Animation', 'Documentary'];

export default function Movies() {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedVJ, setSelectedVJ] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'movies' | 'series'>('movies');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/movies/list`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );
      const data = await response.json();
      const allMovies = data.movies || [];
      setMovies(allMovies.filter((m: Movie) => m.type !== 'series'));
      setSeries(allMovies.filter((m: Movie) => m.type === 'series'));
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentContent = view === 'movies' ? movies : series;

  const filteredContent = currentContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || item.genre === selectedGenre;
    const matchesVJ = !selectedVJ || item.vj === selectedVJ;
    return matchesSearch && matchesGenre && matchesVJ;
  });

  const canDownload = user?.subscription &&
    ['weekly', 'monthly', '2months', 'gold', 'platinum', 'diamond', 'unlimited'].includes(user.subscription.plan);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[500px] bg-gradient-to-r from-orange-600 to-pink-600">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-6xl font-bold mb-4">Welcome to Primerce Movies</h1>
          <p className="text-2xl mb-8">Watch thousands of movies and series in HD</p>
          {!user && (
            <Link
              to="/signup"
              className="bg-orange-600 px-8 py-4 rounded-lg hover:bg-orange-700 inline-block w-fit"
            >
              Start Watching - 6 Hours Free!
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-900 sticky top-16 z-40 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, series, actors..."
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-600"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-800 px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm mb-2">Genre</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
                >
                  <option value="">All Genres</option>
                  {GENRES.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">VJ</label>
                <select
                  value={selectedVJ}
                  onChange={(e) => setSelectedVJ(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
                >
                  <option value="">All VJs</option>
                  {VJ_LIST.map(vj => (
                    <option key={vj} value={vj}>{vj}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Toggle */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setView('movies')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              view === 'movies' ? 'bg-orange-600' : 'bg-gray-800'
            }`}
          >
            Movies ({movies.length})
          </button>
          <button
            onClick={() => setView('series')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              view === 'series' ? 'bg-orange-600' : 'bg-gray-800'
            }`}
          >
            Series ({series.length})
          </button>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading content...</div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            No {view} found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform group"
              >
                <div className="relative aspect-[2/3] bg-gray-800">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <Play size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link
                      to={`/movies/watch/${item.id}`}
                      className="bg-orange-600 p-4 rounded-full hover:bg-orange-700"
                    >
                      <Play size={24} fill="white" />
                    </Link>
                  </div>
                  <div className="absolute top-2 right-2 bg-orange-600 px-2 py-1 rounded text-xs font-bold">
                    {item.quality}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm mb-1 truncate">{item.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">{item.genre} • {item.releaseYear}</p>
                  {item.vj && <p className="text-xs text-orange-600">{item.vj}</p>}
                  <p className="text-xs text-gray-500">{item.duration}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
