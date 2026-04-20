import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, User, Camera, Save } from 'lucide-react';
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function Profile() {
  const { user, isAdmin } = useAuth();
  const [timeLeft, setTimeLeft] = useState("");
  const [newName, setNewName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // COUNTDOWN TIMER LOGIC
  useEffect(() => {
    if (!user?.subscription?.expiresAt) return;

    const timer = setInterval(() => {
      const end = new Date(user.subscription.expiresAt).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        clearInterval(timer);
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${d}d ${h}h ${m}m remaining`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [user]);

  const updateProfile = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append("userId", user.id);
    fd.append("name", newName);
    if (avatar) fd.append("avatar", avatar);

    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/auth/profile/update`, {
      method: 'POST', body: fd
    });
    alert("Profile Updated! Refreshing...");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="bg-slate-900 p-8 rounded-[48px] border border-white/5 text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
             <img src={user?.avatarUrl || "https://placehold.co/128"} className="w-full h-full rounded-full object-cover border-4 border-orange-600" />
             <label className="absolute bottom-0 right-0 bg-orange-600 p-2 rounded-full cursor-pointer"><Camera size={16}/><input type="file" className="hidden" onChange={e => setAvatar(e.target.files?.[0] || null)}/></label>
          </div>
          <input className="bg-transparent text-2xl font-black text-center w-full outline-none" value={newName} onChange={e => setNewName(e.target.value)} />
          <p className="text-slate-500 text-sm mb-6">{user?.email}</p>
          
          <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
             <p className="text-[10px] font-black uppercase text-orange-500 mb-1">Subscription Status</p>
             <div className="flex items-center justify-center gap-2 text-xl font-black italic">
                <Clock className="text-orange-500" /> {isAdmin ? "LIFETIME ADMIN ACCESS" : timeLeft || "NO ACTIVE PLAN"}
             </div>
          </div>
          
          <button onClick={updateProfile} className="mt-6 w-full bg-orange-600 py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-2">
             {loading ? "Saving..." : <><Save size={18}/> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}