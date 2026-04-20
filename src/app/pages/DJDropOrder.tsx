import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Send, Upload, Headphones, ShieldAlert } from 'lucide-react';

export default function DJDropOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fd, setFd] = useState({ djName: '', contact: '', email: '', transactionId: '' });
  const [proof, setProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!proof) return alert("Please upload payment screenshot!");

    setLoading(true);
    try {
      const body = new FormData();
      body.append("userId", user.id);
      body.append("userCode", user.code || user.id);
      body.append("djName", fd.djName);
      body.append("contact", fd.contact);
      body.append("email", fd.email);
      body.append("transactionId", fd.transactionId);
      body.append("proof", proof);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/drops/order`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        body: body
      });

      if (response.ok) {
        alert("Order Received! Checking payment now.");
        navigate('/my-library');
      } else {
        alert("Submission failed. Try again.");
      }
    } catch (err) {
      alert("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-xl mx-auto bg-slate-900 p-8 rounded-[48px] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-600 p-3 rounded-2xl"><Headphones /></div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Order DJ Drop</h1>
        </div>
        
        <div className="bg-orange-600/10 border border-orange-600/20 p-4 rounded-2xl mb-8">
            <p className="text-xs text-orange-500 font-black uppercase mb-1">Payment Instruction</p>
            <p className="text-sm text-gray-300">Send <b>8,000 UGX</b> to Airtel: <b>+256 747 816 444</b></p>
            <p className="text-xs text-slate-300 mt-2">Your DJ Drop ID: <span className="font-mono text-white">{user?.code || user?.id}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="DJ Name (e.g. DJ ENOCH)" className="w-full bg-black p-4 rounded-2xl border border-white/5 outline-none focus:border-orange-500" onChange={e => setFd({...fd, djName: e.target.value})} required />
          <input placeholder="WhatsApp Number" className="w-full bg-black p-4 rounded-2xl border border-white/5 outline-none focus:border-orange-500" onChange={e => setFd({...fd, contact: e.target.value})} required />
          <input placeholder="Delivery Email" type="email" className="w-full bg-black p-4 rounded-2xl border border-white/5 outline-none focus:border-orange-500" onChange={e => setFd({...fd, email: e.target.value})} required />
          <input placeholder="Transaction ID" className="w-full bg-black p-4 rounded-2xl border border-white/5 outline-none focus:border-orange-500" onChange={e => setFd({...fd, transactionId: e.target.value})} required />
          
          <div className="border-2 border-dashed border-white/10 p-8 rounded-2xl text-center hover:border-orange-500 transition-all cursor-pointer">
            <input type="file" id="proof" className="hidden" onChange={e => setProof(e.target.files?.[0] || null)} required />
            <label htmlFor="proof" className="cursor-pointer">
              <Upload className="mx-auto mb-2 text-orange-500" />
              <p className="text-[10px] font-black uppercase tracking-widest">{proof ? proof.name : "Upload Payment Screenshot"}</p>
            </label>
          </div>

          <button disabled={loading} className="w-full bg-orange-600 py-5 rounded-2xl font-black uppercase italic tracking-tighter hover:bg-orange-700 transition-all">
            {loading ? "Processing Order..." : "Confirm & Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}