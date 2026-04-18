import { Music, Mic, PartyPopper } from 'lucide-react';

export default function Services() {
  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Our Services
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-8 rounded-2xl">
            <Music size={48} className="text-orange-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">DJ Services</h3>
            <p className="text-gray-400 mb-6">
              Professional DJ services for weddings, parties, corporate events, and more.
            </p>
            <ul className="text-gray-400 space-y-2">
              <li>• Live Performance</li>
              <li>• Custom Playlists</li>
              <li>• Professional Equipment</li>
            </ul>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl">
            <Mic size={48} className="text-orange-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">DJ Drops</h3>
            <p className="text-gray-400 mb-6">
              Custom DJ drops with your name, professionally produced.
            </p>
            <p className="text-orange-600 font-bold text-xl">8,000 UGX</p>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl">
            <PartyPopper size={48} className="text-orange-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Event Booking</h3>
            <p className="text-gray-400 mb-6">
              Book DJ Enoch for your next event and make it unforgettable.
            </p>
            <p className="text-sm text-gray-500">Contact: +256747816444</p>
          </div>
        </div>
      </div>
    </div>
  );
}
