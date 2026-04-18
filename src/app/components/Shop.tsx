import { motion } from "motion/react";
import { ShoppingCart, Music, Laptop } from "lucide-react";
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
  { id: "drop-1", name: "DJ Enoch Pro Signature Drop", price: 8000, category: "drop", description: "Professional DJ drop with custom voice recording", features: ["High-quality audio", "Custom name recording"] },
  { id: "drop-2", name: "Party Starter DJ Drop", price: 8000, category: "drop", description: "Energetic DJ drop perfect for party mixes", features: ["High-energy voice"] },
  { id: "drop-3", name: "Club Banger DJ Drop", price: 8000, category: "drop", description: "Heavy-hitting club DJ drop", features: ["Deep bass effects"] },
  { id: "software-1", name: "Sony Acid Pro Software", price: 15000, category: "software", description: "Professional DJ mixing software with advanced features", features: ["Multi-track mixing"] },
  { id: "software-2", name: "Sony Vegas Pro", price: 15000, category: "software", description: "Complete beat creation and mixing suite", features: ["Beat creation tools"] },
  { id: "software-3", name: "Virtual DJ", price: 15000, category: "software", description: "Professional software for live DJ performances", features: ["Live mixing controls"] }
];

interface ShopProps {
  onAddToCart: (product: Product) => void;
  searchQuery?: string;
}

export function Shop({ onAddToCart, searchQuery = "" }: ShopProps) {
  const [filter, setFilter] = useState<"all" | "drop" | "software">("all");

  const filteredProducts = products.filter(product => {
    const matchesCategory = filter === "all" || product.category === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="shop" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Shop DJ Products</h2>
          <div className="w-24 h-1 bg-orange-600 mx-auto mb-4"></div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button onClick={() => setFilter("all")} className={`px-6 py-3 rounded-lg font-semibold ${filter === "all" ? "bg-orange-600 text-white" : "bg-gray-100"}`}>All</button>
          <button onClick={() => setFilter("drop")} className={`px-6 py-3 rounded-lg font-semibold ${filter === "drop" ? "bg-orange-600 text-white" : "bg-gray-100"}`}>DJ Drops</button>
          <button onClick={() => setFilter("software")} className={`px-6 py-3 rounded-lg font-semibold ${filter === "software" ? "bg-orange-600 text-white" : "bg-gray-100"}`}>Software</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden p-4">
               <h3 className="font-bold text-gray-900 mb-1 h-12 overflow-hidden">{product.name}</h3>
               <p className="text-2xl font-black text-orange-600 mb-4">{product.price.toLocaleString()} UGX</p>
               <button onClick={() => onAddToCart(product)} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 flex items-center justify-center gap-2">
                 <ShoppingCart className="w-4 h-4" /> Add to Cart
               </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}