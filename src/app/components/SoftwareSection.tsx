// src/app/components/SoftwareSection.tsx
import { Download, Laptop } from "lucide-react";

const softs = [
  { id: 's1', name: "Sony Acid Pro", price: 5500 },
  { id: 's2', name: "Sony Vegas Pro", price: 5500 },
  { id: 's3', name: "Virtual DJ Pro", price: 5500 },
  { id: 's4', name: "FL Studio 21", price: 5500 },
];

export function SoftwareSection({ onAddToCart }: any) {
  return (
    <section id="software" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-black uppercase mb-10">Software Store</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {softs.map((s) => (
            <div key={s.id} className="border p-6 rounded-2xl hover:border-orange-500 transition-all">
              <Laptop className="mx-auto mb-4 text-orange-600" size={40} />
              <h3 className="font-bold mb-2">{s.name}</h3>
              <p className="text-orange-600 font-black mb-4">{s.price} UGX</p>
              <button 
                onClick={() => onAddToCart({ ...s, category: 'software' })}
                className="w-full bg-black text-white py-2 rounded-lg font-bold text-sm"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}