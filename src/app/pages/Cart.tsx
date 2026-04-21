import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function Cart() {
  const { items, total } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    if (!user) return alert("Please Login");
    setLoading(true);

    const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/payments/initiate-pesapal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
      body: JSON.stringify({
        orderId: `ENOCH-${Date.now()}`,
        total,
        email: user.email,
        name: user.name || "User",
        userId: user.id,
        items
      })
    });

    const data = await res.json();
    if (data.redirect_url) window.location.href = data.redirect_url;
    else { alert("Error connecting to payment gateway"); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 flex flex-col items-center">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-[40px] border border-white/5 shadow-2xl">
        <h1 className="text-3xl font-black uppercase text-orange-500 mb-6 italic">Cart Summary</h1>
        
        <div className="space-y-3 mb-8">
          {items.map((it, i) => (
            <div key={i} className="flex justify-between text-sm border-b border-white/5 pb-2">
              <span className="text-slate-400 font-bold uppercase">{it.name}</span>
              <span className="text-orange-500 font-mono">{it.price} UGX</span>
            </div>
          ))}
          <div className="flex justify-between pt-4 text-2xl font-black uppercase italic">
            <span>Total</span>
            <span className="text-orange-500">{total} UGX</span>
          </div>
        </div>

        <button 
          onClick={checkout} 
          disabled={loading || items.length === 0}
          className="w-full bg-orange-600 py-6 rounded-3xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-orange-500 transition-all shadow-xl shadow-orange-900/20"
        >
          {loading ? <Loader2 className="animate-spin"/> : <><CreditCard/> Pay with Pesapal</>}
        </button>

        <div className="mt-8 flex items-center gap-3 justify-center opacity-50">
            <ShieldCheck size={16}/>
            <p className="text-[10px] font-black uppercase tracking-widest">MTN / Airtel / Visa Accepted</p>
        </div>
      </div>
    </div>
  );
}