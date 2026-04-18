import { Music, Calendar, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';

export default function LearnMore() {
  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-6xl font-bold text-center mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          About DJ ENOCH
        </h1>
        <p className="text-2xl text-center text-gray-400 mb-16">
          Professional DJ Services in Uganda
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              DJ ENOCH PRO UG is Uganda's premier DJ service provider, offering professional entertainment
              for all types of events. From weddings and corporate events to private parties, we bring
              the energy and expertise to make your event unforgettable.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              With years of experience and a passion for music, DJ Enoch has become one of the most
              sought-after DJs in the Mukono region and beyond. Our commitment to excellence and
              customer satisfaction sets us apart.
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">Our Services</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Music className="text-orange-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold mb-1">Event DJ Services</h3>
                  <p className="text-gray-400 text-sm">
                    Professional DJ services for weddings, parties, and corporate events
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Music className="text-orange-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold mb-1">Custom DJ Drops</h3>
                  <p className="text-gray-400 text-sm">
                    Personalized DJ drops with your name - 8,000 UGX
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Music className="text-orange-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold mb-1">Music & Movie Platform</h3>
                  <p className="text-gray-400 text-sm">
                    Access thousands of songs and movies with our subscription service
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl p-12 mb-16">
          <h2 className="text-4xl font-bold text-center mb-8">Book DJ Enoch</h2>
          <p className="text-center text-xl mb-8">
            Make your next event unforgettable with professional DJ services
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <Phone size={32} className="mx-auto mb-3" />
              <p className="font-semibold mb-2">Call Us</p>
              <p>+256747816444</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <MapPin size={32} className="mx-auto mb-3" />
              <p className="font-semibold mb-2">Location</p>
              <p>Nyenje Mukono, Uganda</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <Calendar size={32} className="mx-auto mb-3" />
              <p className="font-semibold mb-2">Availability</p>
              <p>Book Your Event Today</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              to="/contact"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100"
            >
              Contact Us Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
