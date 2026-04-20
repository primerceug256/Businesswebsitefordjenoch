import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Send, Upload, Headphones } from 'lucide-react';

export default function DJDropOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fd, setFd] = useState({ djName: '', contact: '', transactionId: '' });
  const [proof, setProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault(); if(!user) return navigate('/login'); if(!proof) return alert("Proof Required");
    setLoading(true);
    const body = new FormData(); body.append("userId", user.id); body.append("djName", fd.djName); 
    body.append("contact", fd.contact); body.append("transactionId", fd.transactionId); body.append("proof", proof!);
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/drops/order`, { method: 'POST', headers: { Authorization: `Bearer ${publicAnonKey}` }, body });
    alert("Success!"); navigate('/my-library');
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-xl mx-auto bg-slate-900 p-10 rounded-[48px] border border-white/5 shadow-2xl">
        <h1 className="text-3xl font-black uppercase text-orange-500 mb-6 italic flex items-center gap-3"><Headphones/> Order DJ Drop</h1>
        <p className="text-sm text-slate-400 mb-8 bg-black/30 p-4 rounded-2xl">Pay <b>8,000 UGX</b> to Airtel: <b>+256 747 816 444</b></p>
        <form onSubmit={submit} className="space-y-4">
          <input placeholder="DJ Name (e.g DJ Eno)" className="w-full bg-black p-4 rounded-2xl border border-white/5" onChange={e=>setFd({...fd, djName: e.target.value})} required />
          <input placeholder="WhatsApp Number" className="w-full bg-black p-4 rounded-2xl border border-white/5" onChange={e=>setFd({...fd, contact: e.target.value})} required />
          <input placeholder="Transaction ID" className="w-full bg-black p-4 rounded-2xl border border-white/5" onChange={e=>setFd({...fd, transactionId: e.target.value})} required />
          <input type="file" className="w-full bg-black p-4 rounded-2xl border border-white/5 text-xs" onChange={e=>setProof(e.target.files?.[0]!)} required />
          <button className="w-full bg-orange-600 py-5 rounded-2xl font-black uppercase">{loading ? "Submitting..." : "Place Order"}</button>
        </form>
      </div>
    </div>
  );
}