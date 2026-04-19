import { motion } from "motion/react";
import { Music, Award, Users, Star, CheckCircle } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            About DJ Enoch Pro
          </h2>
          <div className="w-24 h-1 bg-orange-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Uganda's trusted source for professional DJ products,Translated Movies,Software and Other Services
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1647160494152-4c8eb24a844b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMG1peGluZyUyMG11c2ljfGVufDF8fHx8MTc2OTA4MzcyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="DJ Enoch Pro"
                className="rounded-2xl w-full"
              />
            </div>
            {/* Badge */}
            <div className="absolute -bottom-6 -right-6 bg-orange-600 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-white fill-white" />
                <div>
                  <div className="text-2xl font-bold text-white">1 Year+</div>
                  <div className="text-sm text-orange-100">Experience</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Professional DJ Services,Music,Movies& Products
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              With over <span className="text-orange-600 font-semibold">1 year of experience</span>, DJ Enoch Pro provides professional DJ services and high-quality digital products across Uganda.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Specializing in <span className="text-orange-600 font-semibold">Afrobeats, Hip-Hop, Dancehall, and Electronic music</span>, we bring energy and professionalism to every event.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Based in <span className="text-orange-600 font-semibold">Nyenje, Mukono</span>, we serve clients across Uganda with weddings, corporate events, and club performances.
            </p>

            {/* Features */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span className="text-gray-700">Professional Equipment & Setup</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span className="text-gray-700">All Music Genres & Playlists</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span className="text-gray-700">Event Planning Consultation</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span className="text-gray-700">Professional Lighting & Sound</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <Music className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-4xl font-black text-gray-900 mb-2">10+</h3>
            <p className="text-gray-600 font-semibold">Events Performed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-4xl font-black text-gray-900 mb-2">10+</h3>
            <p className="text-gray-600 font-semibold">Happy Clients</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <Award className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-4xl font-black text-gray-900 mb-2">1+</h3>
            <p className="text-gray-600 font-semibold">Year Experience</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}