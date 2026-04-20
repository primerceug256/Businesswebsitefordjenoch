import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, Camera, Save } from 'lucide-react';
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function Profile() {
  const { user, isAdmin } = useAuth();
  const [timeLeft, setTimeLeft] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState<File | null>(null);

  useEffect(() => {
    if (!user?.subscription?.expiresAt) return;
    const interval = setInterval(() => {
      const diff = new Date(user.subscription.expiresAt).getTime() - new Date().getTime();
      if (diff <= 0) { setTimeLeft("EXPIRED"); clearInterval(interval); }
      else {
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        setTimeLeft(`${d}d ${h}h ${m}m left`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const save = async () => {
    const fd = new FormData();
    fd.append("userId", user.id); fd.append("name", name);
    if (avatar) fd.append("avatar", avatar);
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/profile/update`, { method: 'POST', body: fd });
    alert("Saved!"); window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <div className="bg-slate-900 p-10 rounded-[48px] border border-white/5 w-full max-w-md text-center space-y-6">
        <div className="relative w-32 h-32 mx-auto">
           <img src={user?.avatarUrl || "https://placehold.co/128"} className="w-full h-full rounded-full object-cover border-4 border-orange-600" />
           <label className="absolute bottom-0 right-0 bg-orange-600 p-2 rounded-full cursor-pointer"><Camera size={16}/><input type="file" className="hidden" onChange={e=>setAvatar(e.target.files?.[0] || null)}/></label>
        </div>
        <input className="bg-transparent text-2xl font-black text-center w-full" value={name} onChange={e=>setName(e.target.value)} />
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 italic">
           <Clock className="mx-auto mb-1 text-orange-50"/>
           <p className="text-xl font-black">{isAdmin ? "LIFETIME MASTER ACCESS" : timeLeft || "NO PLAN"}</p>
        </div>
        <button onClick={save} className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase">Save Changes</button>
      </div>
    </div>
  );
}