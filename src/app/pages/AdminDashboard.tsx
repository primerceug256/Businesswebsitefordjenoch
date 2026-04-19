import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { MusicUploadForm } from '../components/uploads/MusicUploadForm';
import { MovieUploadForm } from '../components/uploads/MovieUploadForm';
import { SoftwareUploadForm } from '../components/uploads/SoftwareUploadForm';
import { AdminStats } from './AdminStats';
import { AdminSubs } from './AdminSubs';

const DURS: any = { spark: 0.08, blaze: 0.25, daily: 1, weekly: 7, monthly: 30, diamond: 365 };

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState({ users: [], payments: [] });

  const fetchAll = async () => {
    const h = { Authorization: `Bearer ${publicAnonKey}` };
    const [uR, pR] = await Promise.all([
      fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/users`, { headers: h }),
      fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/payments/pending`, { headers: h })
    ]);
    const [uD, pD] = await Promise.all([uR.json(), pR.json()]);
    setData({ users: uD.users || [], payments: pD.payments || [] });
  };

  useEffect(() => { if (!isAdmin) navigate('/'); else fetchAll(); }, [isAdmin]);

  const approve = async (p: any) => {
    let pId = 'monthly';
    try { const items = JSON.parse(p.items); pId = items[0]?.id || 'monthly'; } catch (e) {}
    if (!confirm(`Approve ${p.userName}?`)) return;
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/approve-subscription`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ paymentId: p.id, userId: p.userId, planId: pId, durationDays: DURS[pId] || 30 })
    });
    fetchAll();
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-10">
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
        <h1 className="font-black text-orange-500">DJ ENOCH ADMIN</h1>
        <button onClick={fetchAll} className="text-[10px] bg-slate-800 px-3 py-1 rounded">Refresh</button>
      </div>
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex gap-2 mb-6">
          {['overview', 'subscriptions', 'uploads'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-xs font-bold capitalize ${tab === t ? 'bg-orange-600' : 'bg-slate-900'}`}>{t}</button>
          ))}
        </div>
        {tab === 'overview' && <AdminStats users={data.users} payments={data.payments} />}
        {tab === 'subscriptions' && <AdminSubs payments={data.payments} onApprove={approve} />}
        {tab === 'uploads' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800"><MusicUploadForm onSuccess={fetchAll}/></div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800"><MovieUploadForm onSuccess={fetchAll}/></div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800"><SoftwareUploadForm onSuccess={fetchAll}/></div>
          </div>
        )}
      </div>
    </div>
  );
}