import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    date: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to a backend
    alert("Thank you for your booking request! We'll get back to you shortly.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      eventType: "",
      date: "",
      message: ""
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Book DJ Enoch Pro ug the party beast
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready to make your event legendary? Get in touch to discuss your booking.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Get In Touch</h3>
              <p className="text-gray-300 text-lg mb-8">
                Whether you're planning a wedding, corporate event, or private party, we're here to make it unforgettable. Contact us today for availability and pricing.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Phone</h4>
                  <p className="text-gray-400">+256 747 816 444</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email</h4>
                  <p className="text-gray-400">primerceug@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Location</h4>
                  <p className="text-gray-400">Nyenje, Mukono</p>
                  <p className="text-gray-400">Uganda</p>
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/30 mt-8">
              <p className="text-gray-300 italic mb-4">
                "DJ Enoch Pro made our wedding absolutely incredible! The music selection was perfect and kept everyone dancing all night. Highly recommended!"
              </p>
              <p className="text-purple-300 font-semibold">- nabada&Jamali</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white mb-2">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-white mb-2">Email *</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-white mb-2">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="+256..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="eventType" className="block text-white mb-2">Event Type *</label>
                    <select
                      id="eventType"
                      required
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select type</option>
                      <option value="wedding">Wedding</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="party">Private Party</option>
                      <option value="club">Club Night</option>
                      <option value="festival">Festival</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-white mb-2">Event Date *</label>
                    <input
                      type="date"
                      id="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-white mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your event..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Booking Request
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}