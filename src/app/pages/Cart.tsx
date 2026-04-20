import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function Cart() {
  const { items, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [proof, setProof] = useState<File | null>(null);
  const [tid, setTid] = useState('');
  const [loading, setLoading] = useState(false);

  const pendingSub = JSON.parse(sessionStorage.getItem("pending_item") || "null");

  const submit = async (e: any) => {
    e.preventDefault();
    if (!proof || !tid) return alert("Fill all fields");
    setLoading(true);

    const fd = new FormData();
    fd.append("userId", user?.id || "");
    fd.append("userCode", user?.code || user?.id || "");
    fd.append("userName", user?.name || user?.email || "");
    fd.append("transactionId", tid);
    fd.append("proof", proof);
    fd.append("items", JSON.stringify([...items, pendingSub].filter(Boolean)));
    fd.append("total", (total + (pendingSub?.price || 0)).toString());

    const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/submit`, {
      method: 'POST', headers: { Authorization: `Bearer ${publicAnonKey}` }, body: fd
    });

    if (res.ok) {
      alert("Sent! Waiting for Admin approval.");
      clearCart(); sessionStorage.removeItem("pending_item");
      navigate('/my-library');
    } else { alert("Submission error"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <form onSubmit={submit} className="max-w-md mx-auto bg-slate-900 p-8 rounded-[40px] border border-white/5 space-y-4">
        <h2 className="text-xl font-black uppercase text-orange-500">Confirm Payment</h2>
        <p className="text-xs text-slate-500 italic">Pay to: +256 747 816 444 (DJ ENOCH PRO)</p>
        <input placeholder="Transaction ID" className="w-full bg-black p-4 rounded-xl border border-white/5" onChange={e=>setTid(e.target.value)} required />
        <input type="file" className="w-full text-xs" onChange={e=>setProof(e.target.files?.[0] || null)} required />
        <button disabled={loading} className="w-full bg-orange-600 py-4 rounded-xl font-black uppercase">{loading ? "Sending..." : "Submit Proof"}</button>
      </form>
    </div>
  );
}