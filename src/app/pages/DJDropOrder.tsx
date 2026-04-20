import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Send, Upload, ShieldCheck } from 'lucide-react';

export default function DJDropOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ djName: '', contact: '', email: '', transactionId: '' });
  const [proof, setProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!user) return navigate('/login');
    if(!proof) return alert("Upload screenshot proof!");

    setLoading(true);
    const fd = new FormData();
    fd.append("userId", user.id);
    fd.append("djName", formData.djName);
    fd.append("contact", formData.contact);
    fd.append("email", formData.email);
    fd.append("transactionId", formData.transactionId);
    fd.append("proof", proof);

    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/drops/order`, {
      method: 'POST', headers: { Authorization: `Bearer ${publicAnonKey}` }, body: fd
    });
    
    alert("Order Submitted! Check 'My Library' for status updates.");
    navigate('/my-library');
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-xl mx-auto bg-slate-900 p-8 rounded-[40px] border border-white/5 shadow-2xl">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-orange-500 mb-2">Order Custom DJ Drop</h1>
        <p className="text-slate-400 text-sm mb-8">Fill in your details and pay 8,000 UGX to +256747816444.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Your DJ Name (e.g. DJ ENOCH)" className="w-full bg-black p-4 rounded-2xl border border-white/5" onChange={e => setFormData({...formData, djName: e.target.value})} required />
          <input placeholder="WhatsApp / Phone" className="w-full bg-black p-4 rounded-2xl border border-white/5" onChange={e => setFormData({...formData, contact: e.target.value})} required />
          <input placeholder="Email for Delivery" type="email" className="w-full bg-black p-4 rounded-2xl border border-white/5" onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input placeholder="Transaction ID" className="w-full bg-black p-4 rounded-2xl border border-white/5" onChange={e => setFormData({...formData, transactionId: e.target.value})} required />
          
          <div className="border-2 border-dashed border-white/10 p-6 rounded-2xl text-center hover:border-orange-500 transition-colors">
            <input type="file" id="p" className="hidden" onChange={e => setProof(e.target.files?.[0] || null)} />
            <label htmlFor="p" className="cursor-pointer flex flex-col items-center gap-2">
              <Upload className="text-orange-500"/>
              <p className="text-xs font-bold uppercase">{proof ? proof.name : "Upload Payment Screenshot"}</p>
            </label>
          </div>

          <button disabled={loading} className="w-full bg-orange-600 py-5 rounded-2xl font-black uppercase flex items-center justify-center gap-3">
            {loading ? "Submitting..." : <><Send size={20}/> Submit Order</>}
          </button>
        </form>
      </div>
    </div>
  );
}