import { useState } from "react";
import { Mic, CheckCircle } from "lucide-react";

export function Shop({ onAddToCart }: any) {
  const [name, setName] = useState("");

  const add = (style: string) => {
    if(!name) return alert("Type your DJ Name/Tagline first!");
    onAddToCart({
      id: `drop-${Date.now()}`,
      name: `DJ DROP: "${name}" (${style})`,
      price: 8000,
      category: 'drop',
      description: "Admin will voice this name and send via WhatsApp/Email."
    });
    setName("");
    alert("Added to cart! Proceed to checkout to send proof of payment.");
  };

  return (
    <section id="shop" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black uppercase italic">Order <span className="text-orange-600">Custom DJ Drops</span></h2>
          <p className="text-gray-500 text-sm font-bold">Voice: 8,000 UGX | Delivery: Instant after verification</p>
        </div>

        <div className="bg-gray-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-orange-500 font-black text-[10px] uppercase mb-2 tracking-widest">Step 1: Enter your name</p>
            <input 
              value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. DJ ENOCH THE PARTY BEAST"
              className="w-full bg-white/10 border-2 border-white/10 p-5 rounded-2xl text-xl font-bold mb-8 outline-none focus:border-orange-500"
            />

            <p className="text-orange-500 font-black text-[10px] uppercase mb-4 tracking-widest">Step 2: Choose your style</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => add('Signature')} className="bg-white text-black p-5 rounded-2xl font-black text-xs uppercase hover:bg-orange-600 hover:text-white transition-all">Signature Style</button>
              <button onClick={() => add('Energy')} className="bg-white text-black p-5 rounded-2xl font-black text-xs uppercase hover:bg-orange-600 hover:text-white transition-all">High Energy</button>
              <button onClick={() => add('Deep Club')} className="bg-white text-black p-5 rounded-2xl font-black text-xs uppercase hover:bg-orange-600 hover:text-white transition-all">Deep Club Style</button>
            </div>
          </div>
          <Mic className="absolute -bottom-10 -right-10 text-white/5" size={200} />
        </div>
      </div>
    </section>
  );
}