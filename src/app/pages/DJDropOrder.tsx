import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Send, Upload, Headphones } from 'lucide-react';

export default function DJDropOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fd, setFd] = useState({ djName: '', contact: '', email: '', transactionId: '' });
  const [proof, setProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!user) return navigate('/login');
    if(!proof) return alert("Screenshot proof required!");
    setLoading(true);
    const body = new FormData();
    Object.entries(fd).forEach(([k,v]) => body.append(k,v));
    body.append("userId", user.id); body.append("proof", proof);

    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/drops/order`, {
      method: 'POST', headers: { Authorization: `Bearer ${publicAnonKey}` }, body
    });
    alert("Ordered Successfully!"); navigate('/my-library');
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-slate-900 p-10 rounded-[48px] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-600 p-3 rounded-2xl"><Headphones/>