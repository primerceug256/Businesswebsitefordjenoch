import { Music, Mic, PartyPopper, Download, Code } from 'lucide-react';

export default function Services() {
  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Our Services
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-8 rounded-2xl">
            <Music size={48} className="text-orange-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">DJ Mixes</h3>
            <p className="text-gray-400 mb-6">
              Download curated mixtapes and listen offline with premium DJ mixes.
            </p>
            <p className="text-orange-600 font-bold text-xl">Free & premium downloads</p>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl">
            <Mic size={48} className="text-orange-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">DJ Drops</h3>
            <p className="text-gray-400 mb-6">
              Personalized voice drops for your brand, radio sets, and live shows.
            </p>
            <p className="text-orange-600 font-bold text-xl">8,000 UGX</p>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl">
            <Download size={48} className="text-orange-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Software Plug</h3>
            <p className="text-gray-400 mb-6">
              Download DJ software for Windows and Mac, including top mixing apps.
            </p>
            <p className="text-orange-600 font-bold text-xl">Fast software access</p>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl">
            <Code size={48} className="text-orange-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Website Development</h3>
            <p className="text-gray-400 mb-6">
              We build modern websites for DJs, events, and online music brands.
            </p>
            <p className="text-orange-600 font-bold text-xl">Application development coming soon</p>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl">
            <PartyPopper size={48} className="text-orange-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Poster & Flyer Design</h3>
            <p className="text-gray-400 mb-6">
              Create event posters, flyers, and social visuals that promote your brand.
            </p>
            <p className="text-orange-600 font-bold text-xl">Professional graphics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
