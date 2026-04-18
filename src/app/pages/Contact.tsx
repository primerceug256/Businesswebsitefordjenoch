import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { FaTiktok, FaYoutube, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Phone className="text-orange-600" size={24} />
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="text-xl">+256747816444</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="text-orange-600" size={24} />
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-xl">primerceug@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MapPin className="text-orange-600" size={24} />
                <div>
                  <p className="text-gray-400">Location</p>
                  <p className="text-xl">Nyenje Mukono, Uganda</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8">Follow Us</h2>
            <div className="space-y-4">
              <a
                href="https://wa.me/256747816444"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                <FaWhatsapp className="text-green-500" size={32} />
                <span className="text-xl">WhatsApp: +256747816444</span>
              </a>

              <a
                href="https://tiktok.com/@primercemovies"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                <FaTiktok className="text-pink-500" size={32} />
                <span className="text-xl">@primercemovies</span>
              </a>

              <a
                href="https://tiktok.com/@primerce1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                <FaTiktok className="text-pink-500" size={32} />
                <span className="text-xl">@primerce1</span>
              </a>

              <a
                href="https://youtube.com/@primercemovies"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                <FaYoutube className="text-red-500" size={32} />
                <span className="text-xl">@primercemovies</span>
              </a>

              <a
                href="https://facebook.com/primercemovies"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                <FaFacebook className="text-blue-500" size={32} />
                <span className="text-xl">@primercemovies</span>
              </a>

              <a
                href="https://instagram.com/primercemovies"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                <FaInstagram className="text-pink-500" size={32} />
                <span className="text-xl">@primercemovies</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
