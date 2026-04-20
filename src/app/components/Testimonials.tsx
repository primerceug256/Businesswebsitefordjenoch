import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const reviews = [
  { name: "DJ Mike", role: "Club DJ", text: "The signature drops are crystal clear. My crowd loves the energy!" },
  { name: "Sarah N.", role: "Event Planner", text: "Booked Enoch for a corporate gala in Mukono. Professional setup and great music selection." },
  { name: "Hassan", role: "Music Producer", text: "Got the Sony Acid software here. The installation was easy and the price is the best in UG." }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-black overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-4 text-center mb-16">
        <h2 className="text-4xl font-black uppercase italic text-orange-500">What People Say</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {reviews.map((r, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -10 }}
            className="bg-gray-900 p-8 rounded-[40px] border border-white/5 relative"
          >
            <Quote className="text-orange-600/20 absolute top-6 right-6" size={48} />
            <div className="flex gap-1 mb-4 text-orange-500">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="text-gray-400 italic mb-6">"{r.text}"</p>
            <h4 className="font-black uppercase tracking-tighter">{r.name}</h4>
            <span className="text-[10px] text-orange-600 font-bold uppercase">{r.role}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}