// src/app/components/Shop.tsx
import { useState } from "react";
import { ShoppingCart, MessageSquare, Mic } from "lucide-react";

export function Shop({ onAddToCart }: { onAddToCart: any }) {
  const [dropName, setDropName] = useState("");

  const handleAddDrop = (type: string) => {
    if (!dropName) {
      alert("Please type the name you want in your DJ Drop first!");
      return;
    }
    onAddToCart({
      id: `drop-${Date.now()}`,
      name: `Custom Drop: "${dropName}" (${type})`,
      price: 8000,
      category: "drop",
      description: `Name to be voiced: ${dropName}`
    });
    setDropName("");
  };

  return (
    <section id="shop" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black uppercase">Order DJ Drops</h2>
          <p className="text-gray-600">Type your name below and choose your style</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-orange-500 mb-10">
          <label className="block text-sm font-bold mb-2">1. TYPE YOUR DJ NAME / TAGLINE:</label>
          <input 
            type="text" 
            placeholder="e.g. 'DJ ENOCH ON THE MIX' or 'THE PARTY BEAST'" 
            className="w-full p-4 border-2 rounded-xl text-lg mb-6 outline-none focus:border-black"
            value={dropName}
            onChange={(e) => setDropName(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => handleAddDrop("Signature Style")} className="bg-black text-white p-4 rounded-xl font-bold hover:bg-orange-600">
              Signature Drop <br/> <span className="text-xs">8,000 UGX</span>
            </button>
            <button onClick={() => handleAddDrop("High Energy")} className="bg-black text-white p-4 rounded-xl font-bold hover:bg-orange-600">
              Party Starter <br/> <span className="text-xs">8,000 UGX</span>
            </button>
            <button onClick={() => handleAddDrop("Deep/Club")} className="bg-black text-white p-4 rounded-xl font-bold hover:bg-orange-600">
              Club Banger <br/> <span className="text-xs">8,000 UGX</span>
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-4 text-center">Admin will generate your audio and send via email/WhatsApp after payment verification.</p>
        </div>
      </div>
    </section>
  );
}