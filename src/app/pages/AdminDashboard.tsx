import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Upload, Users, DollarSign, Music, Film, Download, Check, X, ShieldCheck, Search, Clock } from 'lucide-react';
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { MusicUploadForm } from '../components/uploads/MusicUploadForm';
import { MovieUploadForm } from '../components/uploads/MovieUploadForm';
import { SoftwareUploadForm } from '../components/uploads/SoftwareUploadForm';

const DURS: any = { spark: 0.08, blaze: 0.25, daily: 1, '3days': 3, weekly: 7, '2weeks': 14, monthly: 30, '2months': 60, gold: 90, platinum: 180, diamond: 365, unlimited: 36500 };

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState({ users: [], payments: [] });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const h = { Authorization: `Bearer ${publicAnonKey}` };
      const [uR, pR] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/users`, { headers: h }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/payments/pending`, { headers: h })
      ]);
      const [uD, pD] = await Promise.all([uR.json(), pR.json()]);
      setData({ users: uD.users || [], payments: pD.payments || [] });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { if (!isAdmin) navigate('/'); else fetchAll(); }, [isAdmin]);

  const approve = async (p: any) => {
    let pId = 'monthly';
    try { const items = JSON.parse(p.items); pId = items[0]?.id || 'monthly'; } catch (e) {}
    if (!confirm(`Approve ${p.userName}?`)) return;
    const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/approve-subscription`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ paymentId: p.id, userId: p.userId, planId: pId, durationDays: DURS[pId] || 30 })
    });
    if (res.ok) { alert("Done"); fetchAll(); }
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-10">
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-black text-orange-500">DJ ENOCH ADMIN</h1>
        <button onClick={fetchAll} className="text-xs bg-orange-600/20 px-3 py-1 rounded text-orange-500">{loading ? '...' : 'Refresh'}</button>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['overview', 'subscriptions', 'uploads', 'users'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-xs font-bold capitalize ${tab === t ? 'bg-orange-600' : 'bg-slate-900'}`}>
              {t} {t === 'subscriptions' && `(${data.payments.length})`}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800"><Users size={20} className="text-blue-500 mb-2"/><p className="text-2xl font-black">{data.users.length}</p><p className="text-slate-400 text-xs">Members</p></div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800"><ShieldCheck size={20} className="text-green-500 mb-2"/><p className="text-2xl font-black">{data.payments.length}</p><p className="text-slate-400 text-xs">Pending</p></div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800"><DollarSign size={20} className="text-orange-500 mb-2"/><p className="text-2xl font-black">{data.users.length * 2000}+</p><p className="text-slate-400 text-xs">UGX Est.</p></div>
          </div>
        )}

        {tab === 'subscriptions' && (
          <div className="bg-slate-900 rounded-2xl border border-slate