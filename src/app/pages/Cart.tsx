import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Trash2, Upload, Send, CreditCard } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function Cart() {
  const { items, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [proof, setProof] = useState<File | null>(null);
  const [transId, setTransId] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user came from subscription page
  const pendingSubscription = JSON.parse(sessionStorage.getItem("pending_item") || "null");

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!transId || !proof) return alert("Please provide Transaction ID and Screenshot!");

    setLoading(true);
    const fd = new FormData();
    fd.append("userId", user.id);
    fd.append("userName", user.name || user.email);
    fd.append("transactionId", transId);
    fd.append("proof", proof);
    
    // Combine Cart items and pending subscription
    const allItems = [...items];
    if (pendingSubscription) allItems.push(pendingSubscription);
    fd.append("items", JSON.stringify(allItems));
    fd.append("total", (total + (pendingSubscription?.price || 0)).toString());

    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/payments/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        body: fd
      });

      if (res.ok) {
        alert("Payment Submitted! Admin will verify in 5-10 minutes.");
        clearCart();
        sessionStorage.removeItem("pending_item");
        navigate('/my-library');
      } else {
        alert("Error submitting. Please check your connection.");
      }
    } catch (e) {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT: ORDER SUMMARY */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black uppercase italic text-orange-500">Your Selection</h2>
          <div className="bg-slate-900 rounded-[40px] p-8 border border-white/5">
            {items.length === 0 && !pendingSubscription ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {pendingSubscription && (
                  <div className="flex justify-between items-center bg-orange-600/10 p-4 rounded-2xl border border-orange-600/20">
                    <div><p className="font-bold">{pendingSubscription.name}</p><p className="text-xs text-gray-400">Subscription</p></div>
                    <p className="font-bold">{pendingSubscription.price} UGX</p>
                  </div>
                )}
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                    <div><p className="font-bold">{item.name}</p></div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500"><Trash2 size={18}/></button>
                  </div>
                ))}
                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-2xl font-black">
                  <span>TOTAL:</span>
                  <span className="text-orange-500">{total + (pendingSubscription?.price || 0)} UGX</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: PAYMENT PROOF */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black uppercase italic text-orange-500">Confirm Payment</h2>
          <form onSubmit={submitPayment} className="bg-slate-900 rounded-[40px] p-8 border border-white/5 space-y-4">
            <div className="bg-black p-4 rounded-2xl border border-orange-600/30 flex items-center gap-3">
              <CreditCard className="text-orange-500" />
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase">Pay to Airtel Money</p>
                <p className="font-black text-xl text-white">+256 747 816 444</p>
              </div>
            </div>

            <input 
              placeholder="Enter Transaction ID" 
              className="w-full bg-black p-4 rounded-2xl border border-white/10 outline-none focus:border-orange-500"
              value={transId}
              onChange={e => setTransId(e.target.value)}
              required
            />

            <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center">
              <input type="file" id="p" className="hidden" onChange={e => setProof(e.target.files?.[0] || null)} required />
              <label htmlFor="p" className="cursor-pointer">
                <Upload className="mx-auto mb-2 text-orange-500"/>
                <p className="text-xs font-bold uppercase">{proof ? proof.name : "Upload Screenshot"}</p>
              </label>
            </div>

            <button disabled={loading} className="w-full bg-orange-600 py-5 rounded-2xl font-black uppercase flex items-center justify-center gap-2">
              {loading ? "Processing..." : <><Send size={20}/> Submit Proof</>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}