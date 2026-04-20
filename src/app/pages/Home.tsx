import { Link } from 'react-router';
import { Music, Film, Download, Star, Play } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-orange-600 via-orange-500 to-pink-500">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">DJ ENOCH PRO UG</h1>
          <p className="text-2xl md:text-3xl mb-8">
            Premium DJ Services, Music, Movies & Software
          </p>
          <div className="flex gap-4">
            <Link
              to="/subscription"
              className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-50 flex items-center gap-2"
            >
              <Play size={24} />
              Start Watching
            </Link>
            <Link
              to="/learn-more"
              className="bg-transparent border-2 border-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/music"
              className="bg-gradient-to-br from-orange-600 to-orange-700 p-8 rounded-2xl hover:scale-105 transition-transform"
            >
              <Music size={48} className="mb-4" />
              <h3 className="text-2xl font-bold mb-2">Music Library</h3>
              <p className="text-orange-100">Free downloads available</p>
            </Link>

            <Link
              to="/movies"
              className="bg-gradient-to-br from-pink-600 to-pink-700 p-8 rounded-2xl hover:scale-105 transition-transform"
            >
              <Film size={48} className="mb-4" />
              <h3 className="text-2xl font-bold mb-2">Movies & Series</h3>
              <p className="text-pink-100">HD streaming platform</p>
            </Link>

            <Link
              to="/software"
              className="bg-gradient-to-br from-purple-600 to-purple-700 p-8 rounded-2xl hover:scale-105 transition-transform"
            >
              <Download size={48} className="mb-4" />
              <h3 className="text-2xl font-bold mb-2">DJ Software</h3>
              <p className="text-purple-100">Professional tools</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-400">HD movies and high-quality music</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Film size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Huge Library</h3>
              <p className="text-gray-400">Thousands of movies and music tracks</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Download Offline</h3>
              <p className="text-gray-400">Premium members can download content</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers</p>
          <Link
            to="/signup"
            className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-50 inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}