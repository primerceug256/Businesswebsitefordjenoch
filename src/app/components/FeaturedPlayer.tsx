import { motion } from "motion/react";
import { MusicPlayer } from "@/app/components/MusicPlayer";

export function FeaturedPlayer() {
  const audioUrl =
    "https://nlhpnvzpbceolsbozrjw.supabase.co/storage/v1/object/sign/primerce%20fresh%20hit%20music/optmus/PRIMERCE%20%20FRESH%20HITS%20%202025%20DJ%20ENOCH%20VOL3%20DANCEHALL.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82MTc3NDI2MS0wNGNmLTQwYjUtOTllYS0wMzdlNGUzOTE1YjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcmltZXJjZSBmcmVzaCBoaXQgbXVzaWMvb3B0bXVzL1BSSU1FUkNFICBGUkVTSCBISVRTICAyMDI1IERKIEVOT0NIIFZPTDMgREFOQ0VIQUxMLm1wMyIsImlhdCI6MTc2OTM0MjgwMywiZXhwIjoxNzY5OTQ3NjAzfQ.P0t2fcT_hofIqW3RUlxznSiYWc-MgFdOYK55uebZFRY";

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            🎵 Featured Mix
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Listen to the latest hit from DJ Enoch Pro - streaming now!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex items-center justify-center"
        >
          <MusicPlayer
            audioUrl={audioUrl}
            title="PRIMERCE FRESH HITS 2025 DJ ENOCH VOL3 DANCEHALL"
            artist="DJ Enoch Pro"
            coverImage="https://images.unsplash.com/photo-1548461159-4efd42cff532?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHBhcnR5JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzY5MzQ2NjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          />
        </motion.div>
      </div>
    </section>
  );
}
