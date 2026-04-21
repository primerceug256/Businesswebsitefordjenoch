import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, Camera } from 'lucide-react';
import { projectId } from '@utils/supabase/info';

export default function Profile() {
  const { user, isAdmin } = useAuth();
  const [timeLeft, setTimeLeft] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState<File | null>(null);

  useEffect(() => {
    if (!user?.subscription?.expiresAt) return;
    const i = setInterval(() => {
      const diff = new Date(user.subscription.expiresAt).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("EXPIRED"); clearInterval(i); }
      else {
        const d = Math.floor(diff/86400000), h = Math.floor((diff%86400000)/3600000), m = Math.floor((diff%3600000)/60000);
        setTimeLeft(`${d}d ${h}h ${m}m left`);
      }
    }, 1000);
    return () => clearInterval(i);
  }, [user]);

  const save = async () => {
    const fd = new FormData(); fd.append("userId", user.id); fd.append("name", name);
    if(avatar) fd.append("avatar", avatar);
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/profile/update`, { method:'POST', body:fd });
    alert("Saved!"); window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center">
      <div className="bg-slate-900 p-10 rounded-[50px] border border-white/5 w-full max-w-sm text-center space-y-6">
        <div className="relative w-32 h-32 mx-auto">
          <img src={user?.avatarUrl || "https://placehold.co/128"} className="w-full h-full rounded-full object-cover border-4 border-orange-600" />
          <label className="absolute bottom-0 right-0 bg-orange-600 p-2 rounded-full cursor-pointer"><Camera size={16}/><input type="file" className="hidden" onChange={e=>setAvatar(e.target.files?.[0]!)}/></label>
        </div>
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 font-black uppercase text-orange-500">
          <p className="text-[10px] tracking-[0.35em]">YOUR DJ DROP ID</p>
          <p className="mt-2 text-lg font-bold text-white font-mono">{user?.code || user?.id}</p>
        </div>
        <input className="bg-transparent text-2xl font-black text-center w-full" value={name} onChange={e=>setName(e.target.value)} />
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 font-black uppercase text-orange-500">
          <Clock className="mx-auto mb-1"/> {isAdmin ? "MASTER ACCESS" : timeLeft || "NO PLAN"}
        </div>
        <button onClick={save} className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase tracking-widest">Update Profile</button>
      </div>
    </div>
  );
}