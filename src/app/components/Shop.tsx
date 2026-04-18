import { useState } from "react";
import { Mic, ShoppingCart } from "lucide-react";

export function Shop({ onAddToCart, searchQuery = "" }: any) {
  const [dropName, setDropName] = useState("");

  const handleAdd = (style: string) => {
    if (!dropName) return alert("Type your DJ Name first!");
    onAddToCart({
      id: `drop-${Date.now()}`,
      name: `Custom DJ Drop: ${dropName} (${style})`,
      price: 8000,
      category: "drop"
    });
    setDropName("");
  };

  return (
    <section id="shop" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-black italic text-center mb-10 uppercase tracking-tighter">Order Custom <span className="text-orange-600">DJ Drops</span></h2>
        
        <div className="bg-gray-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Mic size={120}/></div>
          <p className="text-orange-500 font-bold text-xs uppercase mb-2">Step 1: Enter your details</p>
          <input 
            className="w-full bg-white/10 border border-white/20 p-5 rounded-2xl text-xl font-bold mb-8 outline-none focus:border-orange-500"
            placeholder="Type your DJ Name or Tagline..."
            value={dropName}
            onChange={e => setDropName(e.target.value)}
          />
          
          <p className="text-orange-500 font-bold text-xs uppercase mb-4">Step 2: Choose your style (8,000 UGX each)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Signature Style', 'Energy Style', 'Deep Club Style'].map(style => (
              <button key={style} onClick={() => handleAdd(style)} className="bg-white text-black p-4 rounded-2xl font-black text-xs uppercase hover:bg-orange-600 hover:text-white transition-all">
                Add {style}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}