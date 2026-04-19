import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  Upload, Users, DollarSign, Music, Film, 
  Download, Check, X, ShieldCheck, Search, Clock
} from 'lucide-react';
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { MusicUploadForm } from '../components/uploads/MusicUploadForm';
import { MovieUploadForm } from '../components/uploads/MovieUploadForm';
import { SoftwareUploadForm } from '../components/uploads/SoftwareUploadForm';

const DURATIONS: Record<string, number> = {
  'spark': 0.08, 'blaze': 0.25, 'daily': 1, '3days': 3, 'weekly': 7,
  '2weeks': 14, 'monthly': 30, '2months': 60, 'gold': 90, 'platinum': 180,
  'diamond': 365, 'unlimited': 36500
};

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'overview' | 'uploads' | 'subscriptions' | 'users'>('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    fetchData();
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const u = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/users`, { headers: { Authorization: `Bearer ${publicAnonKey}` } });
      const uD = await u.json(); setUsers(uD.users || []);
      const p = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/payments/pending`, { headers: { Authorization: `Bearer ${publicAnonKey}` } });
      const pD = await p.json(); setPayments(pD.payments || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleApprove = async (pay: any) => {
    let pId = 'monthly';
    try { const items = JSON.parse(pay.items || '[]'); pId = items[0]?.id || 'monthly'; } catch(e) {}
    const days = DURATIONS[pId] || 30;
    if (!confirm(`Approve ${pay.userName} for ${pId}?`)) return;
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/approve-subscription`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ paymentId: pay.id, userId: pay.userId, planId: pId, durationDays: days })
      });
      if (res.ok) { alert("Approved!"); fetchData(); }
    } catch (e) { alert("Error"); }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Reject?")) return;
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/payments/${id}/reject`, { method: 'POST', headers: { Authorization: `Bearer ${publicAnonKey}` } });
    fetchData();
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-20">
      <div className="bg-slate-900 border-b border-slate-800 p-6 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black text-orange-500">DJ ENOCH ADMIN</h1>
          <button onClick={fetchData} className="px-4 py-2 bg-orange-600/10 text-orange-500 rounded-lg text-xs font-bold hover:bg-orange-600 hover:text-white transition-all">
            {loading ? '...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-900 p-1.5 rounded-2xl w-fit border border-slate-800">
          <button onClick={() => setTab('overview')} className={`px-5 py-2.5 rounded-xl text-sm font-bold ${tab==='overview'?'bg-orange-600':'text-slate-400'}`}>Stats</button>
          <button onClick={() => setTab('subscriptions')} className={`px-5 py-2.5 rounded-xl text-sm font-bold ${tab==='subscriptions'?'bg-orange-600':'text-slate-400'}`}>Approvals ({payments.length})</button>
          <button onClick={() => setTab('uploads')} className={`px-5 py-2.5 rounded-xl text-sm font-bold ${tab==='uploads'?'bg-orange-600':'text-slate-400'}`}>Uploads</button>
          <button onClick={() => setTab('users')} className={`px-5 py-2.5 rounded-xl text-sm font-bold ${tab==='users'?'bg-orange-600':'text-slate-400'}`}>Users</button>
        </div>