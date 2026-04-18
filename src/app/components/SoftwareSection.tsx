import { useState, useEffect } from "react";
import { Laptop, Loader } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

export function SoftwareSection({ onAddToCart, searchQuery = "" }: any) {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoft = async () => {
      const { data } = await supabase.from('software').select('*').order('created_at', { ascending: false });
      setApps(data || []);
      setLoading(false);
    };
    fetchSoft();
  }, []);

  const filtered = apps.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <section id="software" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-black italic mb-10 text-center uppercase">Pro <span className="text-orange-600">DJ Software</span></h2>
        {loading ? <Loader className="animate-spin mx-auto"/> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map(app => (
              <div key={app.id} className="bg-white p-6 rounded-3xl border border-gray-100 text-center hover:shadow-xl transition-all">
                <Laptop className="mx-auto mb-4 text-orange-600" size={32}/>
                <h3 className="font-bold text-xs mb-2 h-8 overflow-hidden">{app.title}</h3>
                <p className="text-orange-600 font-black mb-4 text-sm">{app.price} UGX</p>
                <button 
                  onClick={() => onAddToCart({ id: app.id, name: app.title, price: parseInt(app.price), category: 'software' })}
                  className="w-full bg-black text-white py-3 rounded-xl font-black text-[10px] uppercase hover:bg-orange-600"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}