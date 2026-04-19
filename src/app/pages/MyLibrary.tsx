import { useAuth } from '../context/AuthContext';
import { Library, Download, Music, Film } from 'lucide-react';

export default function MyLibrary() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center p-6">
        <div>
          <Library size={64} className="text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-black">Login to access your library</h2>
          <p className="text-gray-500 mt-2">Your purchased software and music will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-black mb-2 tracking-tight">My Library</h1>
        <p className="text-gray-500 mb-10 font-medium">Manage your purchased software, drops, and saved mixes.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Empty State / Example */}
          <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 text-center">
            <Download size={40} className="text-orange-500 mx-auto mb-4" />
            <h3 className="font-black text-xl">No Downloads Yet</h3>
            <p className="text-gray-500 text-sm mt-2">Browse the Software Hub or DJ Drops to add items to your library.</p>
          </div>
        </div>
      </div>
    </div>
  );
}