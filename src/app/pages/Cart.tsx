import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Loader2, Smartphone } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function Cart() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePesapalRedirect = async () => {
    if (!user) return alert("Please login first");
    setLoading(true);

    try {
      // 1. Create order in your database first as 'pending'
      const orderId = `order-${Date.now()}`;
      
      // 2. Call your Supabase function to get Pesapal Redirect URL
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/payments/initiate-pesapal`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}` 
        },
        body: JSON.stringify({
          orderId,
          total,
          email: user.email,
          name: user.name || "Customer",
          items: items
        })
      });

      const data = await res.json();

      if (data.redirect_url) {
        // 3. Redirect user to Pesapal to pay
        window.location.href = data.redirect_url;
      } else {
        alert("Could not initialize Pesapal. Check console.");
      }
    } catch (e) {
      console.error(e);
      alert("Payment Error. Try again.");
    }
    setLoading(false);
  };

  if (items.length === 0) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-slate-500 font-black uppercase">Your cart is empty</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 py-20">
      <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-[48px] border border-white/5 shadow-2xl">
        <h2 className="text-3xl font-black uppercase italic text-orange-500 mb-6">Checkout</h2>
        
        <div className="space-y-4 mb-8">
            {items.map((item, idx) => (
                <div key={idx} className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-sm font-bold uppercase">{item.name}</span>
                    <span className="text-orange-500 font-mono">{item.price} UGX</span>
                </div>
            ))}
            <div className="flex justify-between pt-4">
                <span className="font-black text-xl uppercase">Total</span>
                <span className="font-black text-xl text-orange-500">{total} UGX</span>
            </div>
        </div>

        <div className="bg-blue-600/10 border border-blue-600/20 p-4 rounded-2xl mb-6">
            <p className="text-[10px] font-black uppercase text-blue-500 mb-1">Secure Checkout</p>
            <p className="text-xs text-slate-400">Pay via Airtel, MTN, or Visa using Pesapal.</p>
        </div>

        <button 
          onClick={handlePesapalRedirect}
          disabled={loading}
          className="w-full bg-orange-600 py-5 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-orange-500 transition-all shadow-xl shadow-orange-900/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><CreditCard size={20}/> Pay with Pesapal</>}
        </button>
        
        <p className="text-center text-[9px] text-slate-600 mt-6 uppercase font-bold tracking-widest">
            Instant digital delivery after payment
        </p>
      </div>
    </div>
  );
}