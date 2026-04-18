import { motion } from "motion/react";
import { ShoppingCart, Music, Laptop, Plus } from "lucide-react";
import { useState } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "drop" | "software";
  description: string;
  features: string[];
}

const products: Product[] = [
  {
    id: "drop-1",
    name: "DJ Enoch Pro Signature Drop",
    price: 8000,
    category: "drop",
    description: "Professional DJ drop with custom voice recording",
    features: ["High-quality audio", "Custom name recording", "Multiple formats (MP3, WAV)", "Instant download"]
  },
  {
    id: "drop-2",
    name: "Party Starter DJ Drop",
    price: 8000,
    category: "drop",
    description: "Energetic DJ drop perfect for party mixes",
    features: ["High-energy voice", "Party atmosphere effects", "Professional mixing", "Instant download"]
  },
  {
    id: "drop-3",
    name: "Club Banger DJ Drop",
    price: 8000,
    category: "drop",
    description: "Heavy-hitting club DJ drop",
    features: ["Deep bass effects", "Club-ready sound", "Premium quality", "Instant download"]
  },
  {
    id: "software-1",
    name: "sony acid  Pro Software",
    price: 15000,
    category: "software",
    description: "Professional DJ mixing software with advanced features",
    features: ["Multi-track mixing", "Effects library", "Loop controls", "Recording capabilities", "Lifetime license"]
  },
  {
    id: "software-2",
    name: "sony vegas pro",
    price: 15000,
    category: "software",
    description: "Complete beat creation and mixing suite",
    features: ["Beat creation tools", "Sample library", "Auto-sync technology", "Export to all formats", "Lifetime updates"]
  },
  {
    id: "software-3",
    name: "virtual dj",
    price: 15000,
    category: "software",
    description: "Professional software for live DJ performances",
    features: ["Live mixing controls", "Real-time effects", "MIDI controller support", "Performance mode", "Full support"]
  }
];

interface ShopProps {
  onAddToCart: (product: Product) => void;
}

export function Shop({ onAddToCart }: ShopProps) {
  const [filter, setFilter] = useState<"all" | "drop" | "software">("all");

  const filteredProducts = products.filter(
    product => filter === "all" || product.category === filter
  );

  return (
    <section id="shop" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Shop DJ Products
          </h2>
          <div className="w-24 h-1 bg-orange-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional DJ drops and software with instant delivery
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === "all"
                ? "bg-orange-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setFilter("drop")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              filter === "drop"
                ? "bg-orange-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Music className="w-4 h-4" />
            DJ Drops
          </button>
          <button
            onClick={() => setFilter("software")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              filter === "software"
                ? "bg-orange-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Laptop className="w-4 h-4" />
            Software
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group"
            >
              {/* Product Image/Icon Area */}
              <div className={`p-8 text-center ${
                product.category === "drop" 
                  ? "bg-orange-50" 
                  : "bg-blue-50"
              }`}>
                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                  product.category === "drop"
                    ? "bg-orange-600"
                    : "bg-blue-600"
                }`}>
                  {product.category === "drop" ? (
                    <Music className="w-8 h-8 text-white" />
                  ) : (
                    <Laptop className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 min-h-[48px]">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                
                {/* Price */}
                <div className="mb-3">
                  <p className="text-2xl font-black text-gray-900">
                    UGX {product.price.toLocaleString()}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-orange-50 rounded-2xl p-8 border border-orange-200 text-center"
        >
          <ShoppingCart className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Instant Digital Delivery</h3>
          <p className="text-gray-700">
            All products are delivered instantly after payment via Airtel Money. Need help? Contact us anytime!
          </p>
        </motion.div>
      </div>
    </section>
  );
}