import { motion } from "motion/react";
import { ShoppingBag, Truck, Shield, Headphones } from "lucide-react";

export function Hero() {
  const scrollToShop = () => {
    const element = document.getElementById("shop");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="pt-32 pb-12 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl overflow-hidden shadow-xl mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 lg:p-12">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm">
                🎉 New Products Available
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                Professional DJ Drops & Software
              </h1>
              <p className="text-xl text-orange-50">
                Get premium DJ drops for UGX 8,000 and professional DJ software for UGX 15,000. Instant delivery after payment!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToShop}
                  className="px-8 py-4 bg-white text-orange-600 rounded-lg font-bold hover:bg-orange-50 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Shop Now
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-bold hover:bg-white/20 transition-all">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1558487085-e71920324b39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMHR1cm50YWJsZXMlMjBjb25jZXJ0fGVufDF8fHx8MTc2OTA4MzcyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="DJ Equipment"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Instant Delivery</h3>
            <p className="text-sm text-gray-600">Get your products immediately</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Secure Payment</h3>
            <p className="text-sm text-gray-600">Airtel Money accepted</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Headphones className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">24/7 Support</h3>
            <p className="text-sm text-gray-600">We're here to help</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Quality Products</h3>
            <p className="text-sm text-gray-600">Professional grade</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}