import { Laptop, ShoppingCart } from "lucide-react";

const apps = [
  { id: 'sw1', name: 'Sony Acid Pro', price: 5500 },
  { id: 'sw2', name: 'Sony Vegas Pro', price: 5500 },
  { id: 'sw3', name: 'Virtual DJ Pro', price: 5500 },
  { id: 'sw4', name: 'FL Studio 21', price: 5500 }
];

export function SoftwareSection({ onAddToCart, searchQuery = "" }: any) {
  const filtered = apps.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <section id="software" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-black italic mb-10 text-center uppercase tracking-tighter">Pro <span className="text-orange-600">DJ Software</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map(app => (
            <div key={app.id} className="bg-white p-6 rounded-3xl border border-gray-100 text-center hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-100">
                <Laptop className="text-gray-400 group-hover:text-orange-600"/>
              </div>
              <h3 className="font-bold text-sm mb-2">{app.name}</h3>
              <p className="text-orange-600 font-black mb-4 text-sm">{app.price.toLocaleString()} UGX</p>
              <button 
                onClick={() => onAddToCart({...app, category: 'software'})}
                className="w-full bg-black text-white py-3 rounded-xl font-black text-[10px] uppercase hover:bg-orange-600"
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