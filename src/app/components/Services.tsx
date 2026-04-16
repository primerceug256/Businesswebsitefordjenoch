import { motion } from "motion/react";
import { Heart, Briefcase, PartyPopper, Radio, Mic, Calendar } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Weddings",
    description: "Create magical moments with perfectly curated playlists for your special day. From ceremony to reception, we've got you covered.",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Briefcase,
    title: "Corporate Events",
    description: "Professional DJ services for product launches, company parties, and corporate celebrations. Sophisticated and polished entertainment.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: PartyPopper,
    title: "Private Parties",
    description: "Birthday parties, anniversaries, and private celebrations. We bring the energy and keep the dance floor packed all night.",
    color: "from-purple-500 to-violet-500"
  },
  {
    icon: Radio,
    title: "Club Nights",
    description: "Regular nightclub residencies and guest appearances. Expert mixing and crowd control for unforgettable club experiences.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Mic,
    title: "Live Events & Festivals",
    description: "Festival performances and large-scale events. Experienced in handling massive crowds and delivering high-energy sets.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Calendar,
    title: "Custom Packages",
    description: "Tailored DJ packages to fit your specific event needs and budget. Equipment rental and MC services also available.",
    color: "from-yellow-500 to-amber-500"
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Services
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Professional DJ services for every occasion. Let's make your event unforgettable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 group"
            >
              <div className={`bg-gradient-to-r ${service.color} p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {service.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button 
            onClick={() => {
              const element = document.getElementById("contact");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
          >
            Get a Custom Quote
          </button>
        </motion.div>
      </div>
    </section>
  );
}
