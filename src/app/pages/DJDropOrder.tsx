import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '@utils/supabase/info';
import { Headphones, Zap, Loader2 } from 'lucide-react';

export default function DJDropOrder() {
  const { user } = useAuth();
  const [djName, setDjName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOrder = async (e: any) => {
    e.preventDefault();
    if(!user) return alert("Login First");
    setLoading(true);

    const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/payments/initiate-pesapal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
      body: JSON.stringify({
        orderId: `DROP-${Date.now()}`,
        total: 8000,
        email: user.email,
        name: user.name || "DJ",
        userId: user.id,
        items: [{ name: `DJ Drop: ${djName}`, price: 8000 }]
      })
    });

    const data = await res.json();
    if(data.redirect_url) window.location.href = data.redirect_url;
    else { alert("Payment Error"); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <form onSubmit={handleOrder} className="max-w-md w-full bg-slate-900 p-10 rounded-[50px] border border-white/5 space-y-6 shadow-2xl">
        <div className="text-center">
            <Headphones className="mx-auto text-orange-500 mb-4" size={48}/>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Order DJ Drop</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">8,000 UGX • Instant Secure Payment</p>
        </div>
        
        <input 
            placeholder="ENTER YOUR DJ NAME" 
            className="w-full bg-black p-5 rounded-3xl border border-white/5 outline-none focus:border-orange-500 font-black italic uppercase"
            onChange={e => setDjName(e.target.value)}
            required
        />

        <button disabled={loading} className="w-full bg-orange-600 py-6 rounded-[32px] font-black uppercase italic tracking-widest text-lg hover:bg-orange-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-900/30">
          {loading ? <Loader2 className="animate-spin"/> : <><Zap/> Pay & Order</>}
        </button>
      </form>
    </div>
  );
}