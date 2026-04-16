import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import djEnochLive from "figma:asset/0f177593868f0be561a571d9de668c49c76805be.png";
import djDropsLogo from "figma:asset/890db0016132fd89b8eb4295e62ac5a21439131f.png";

const galleryImages = [
  {
    url: djEnochLive,
    title: "DJ Enoch Sound System Live",
    event: "Outdoor Festival - Massive Crowd"
  },
  {
    url: djDropsLogo,
    title: "DJ Drops & Software",
    event: "Professional DJ Products Available"
  },
  {
    url: "https://images.unsplash.com/photo-1558487085-e71920324b39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMHR1cm50YWJsZXMlMjBjb25jZXJ0fGVufDF8fHx8MTc2OTA4MzcyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Festival Performance",
    event: "Summer Music Festival 2025"
  },
  {
    url: "https://images.unsplash.com/photo-1744314080490-ed41f6319475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBwYXJ0eSUyMGNyb3dkfGVufDF8fHx8MTc2OTA4MzcyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Club Night",
    event: "Kampala Night Club"
  },
  {
    url: "https://images.unsplash.com/photo-1761299167698-d2283f61a52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGV2ZW50JTIwZmVzdGl2YWx8ZW58MXx8fHwxNzY5MDgzNzIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Music Festival",
    event: "Uganda Music Awards"
  },
  {
    url: "https://images.unsplash.com/photo-1647160494152-4c8eb24a844b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMG1peGluZyUyMG11c2ljfGVufDF8fHx8MTc2OTA4MzcyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Live Mixing Session",
    event: "Corporate Gala"
  },
  {
    url: "https://images.unsplash.com/photo-1558871042-c80fc7f73f40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMHBhcnR5JTIwbXVzaWN8ZW58MXx8fHwxNzY5NDE4NTU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "DJ Party Night",
    event: "Entebbe Beach Party"
  },
  {
    url: "https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3Njk0MTg1NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Studio Session",
    event: "Recording New Mixes"
  },
  {
    url: "https://images.unsplash.com/photo-1531425918464-838093179bd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMHR1cm50YWJsZXMlMjBtaXhlcnxlbnwxfHx8fDE3Njk0MTg1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Turntables Setup",
    event: "Wedding Reception"
  },
  {
    url: "https://images.unsplash.com/photo-1548461159-4efd42cff532?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHBhcnR5JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzY5MzQ2NjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Party Vibes",
    event: "Birthday Bash 2025"
  }
];

export function Gallery() {
  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Gallery
          </h2>
          <div className="w-24 h-1 bg-orange-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Highlights from recent performances and events
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group overflow-hidden rounded-xl cursor-pointer h-[300px] border border-gray-200 shadow-md hover:shadow-xl transition-shadow"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{image.title}</h3>
                  <div className="flex items-center gap-2 text-orange-300">
                    <Calendar className="w-4 h-4" />
                    <p>{image.event}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-orange-50 rounded-2xl p-8 border border-orange-200"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Watch Performance Highlights
          </h3>
          <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-gray-400">Click to watch highlights reel</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}