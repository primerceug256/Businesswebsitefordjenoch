import { Facebook, Instagram, Youtube, Music2, MessageCircle } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-purple-500/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Music2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">DJ ENOCH PRO</h3>
                <p className="text-xs text-purple-400">UGANDA</p>
              </div>
            </div>
            <p className="text-gray-400">
              Uganda's Premier DJ Experience. Bringing unforgettable vibes to every event since 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Payments Section */}
          <div>
            <h4 className="text-white font-semibold mb-4">Accepted Payments</h4>
            <div className="space-y-4">
              <div className="bg-red-950/30 border border-red-500/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 text-xs font-black uppercase tracking-widest">Airtel Money</span>
                </div>
                <p className="text-white font-bold text-lg">+256 747 816 444</p>
                <p className="text-gray-500 text-[10px] mt-1 uppercase">Name: DJ ENOCH PRO</p>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Pay for DJ drops, software, or bookings via Airtel Money for instant confirmation.
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://www.tiktok.com/@primerce1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-110"
                title="TikTok @primerce1"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-110"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-110"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://wa.me/256747816444"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-110"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-110"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
            <p className="text-gray-400 mt-4 text-xs">
              Follow @primerce1 on TikTok for latest mixes!
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-xs uppercase tracking-tighter font-bold">
            © {currentYear} DJ Enoch Pro UG. Designed for the Party Beast.
          </p>
        </div>
      </div>
    </footer>
  );
}