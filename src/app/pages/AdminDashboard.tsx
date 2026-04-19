import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  Upload, Users, DollarSign, Music, Film, 
  Download, Check, X, ShieldCheck, Search, Trash2, Clock
} from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

// Import your custom forms
import { MusicUploadForm } from '../components/uploads/MusicUploadForm';
import { MovieUploadForm } from '../components/uploads/MovieUploadForm';
import { SoftwareUploadForm } from '../components/uploads/SoftwareUploadForm';

// Duration mapping based on your Subscription plans
const PLAN_DURATION_MAP: Record<string, number> = {
  'spark': 0.083, // 2 hours
  'blaze': 0.25,  // 6 hours
  'daily': 1,
  '3days': 3,
  'weekly': 7,
  '2weeks': 14,
  'monthly': 30,
  '2months': 60,
  'gold': 90,
  'platinum': 180,
  'diamond': 365,
  'unlimited': 36500 // 100 years
};

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Tab Management
  const [activeTab, setActiveTab] = useState<'overview' | 'uploads' | 'subscriptions' | 'users'>('overview');
  
  // Data States
  const [usersList, setUsersList] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchAdminData();
  }, [isAdmin]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Registered Users
      const uRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/users`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      const uData = await uRes.json();
      setUsersList(uData.users || []);

      // 2. Fetch Pending Payments/Subscriptions
      const pRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/payments/pending`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      const pData = await pRes.json();
      setPendingPayments(pData.payments || []);

    } catch (err) {
      console.error("Admin Data Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (payment: any) => {
    // Try to detect the plan from the items string
    const items = JSON.parse(payment.items || '[]');
    const firstItem = items[0];
    const planId = firstItem?.id || 'monthly';
    const duration = PLAN_DURATION_MAP[planId] || 30;

    if (!confirm(`Approve ${payment.userName}'s payment for ${planId}? (Grants ${duration} days access)`)) return;
    
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/admin/approve-subscription`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}` 
        },
        body: JSON.stringify({
          paymentId: payment.id,
          userId: payment.userId,
          planId: planId,
          durationDays: duration
        })
      });

      if (res.ok) {
        alert("Subscription Activated Successfully!");
        fetchAdminData(); 
      }
    } catch (err) {
      alert("Error during approval process.");
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!confirm("Are you sure you want to reject this payment request?")) return;
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/payments/${paymentId}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      fetchAdminData();
    } catch (err) {
      alert("Error rejecting payment.");
    }
  };

  // Filter users based on search
  const filteredUsers = usersList.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdmin) return null;

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-slate-900 border-b border-slate-800 p-6 sticky top-0 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-orange-500 tracking-tighter">DJ ENOCH CONTROL</h1>
            <p className="text-xs text-slate-500 uppercase font-bold">Mukono, Uganda Branch</p>
          </div>
          <button onClick={fetchAdminData} className="px-4 py-2 bg-orange-600/10 text-orange-500 border border-orange-500/20 rounded-lg text-sm font-bold hover:bg-orange-600 hover:text-white transition-all">
            Refresh Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-900 p-1.5 rounded-2xl w-fit border border-slate-800">
          {[
            { id: 'overview', label: 'Stats', icon: DollarSign },
            { id: 'subscriptions', label: 'Approvals', icon: ShieldCheck, count: pendingPayments.length },
            { id: 'uploads', label: 'Upload Center', icon: Upload },
            { id: 'users', label: 'User Base', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-white text-orange-600 text-[10px] px-2 py-0.5 rounded-full ring-2 ring-orange-500">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content: OVERVIEW (STATS) */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 group hover:border-orange-500/50 transition-colors">
              <Users className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <p className="text-4xl font-black">{usersList.length}</p>
              <p className="text-slate-400">Total Registered Members</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 group hover:border-orange-500/50 transition-colors">
              <ShieldCheck className="text-green-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <p className="text-4xl font-black">{pendingPayments.length}</p>
              <p className="text-slate-400">Payments Waiting Approval</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 group hover:border-orange-500/50 transition-colors">
               <DollarSign className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
               <p className="text-sm text-slate-400 mb-1">Estimated Sales Value</p>
               <p className="text-3xl font-black text-orange-500">UGX {usersList.length * 1500}+</p>
            </div>
          </div>
        )}

        {/* Tab Content: SUBSCRIPTION APPROVALS (The "Approved" Page) */}
        {activeTab === 'subscriptions' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-xl font-bold flex items-center gap-2"><Clock className="text-orange-500" /> Pending Airtel Money Verification</h2>
              <span className="text-xs font-bold text-slate-500">Check your phone for matching Transaction IDs</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest">
                  <tr>
                    <th className="p-5">Customer Name</th>
                    <th className="p-5">Transaction ID</th>
                    <th className="p-5">Amount Paid</th>
                    <th className="p-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {pendingPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-5">
                        <p className="font-bold text-slate-200">{p.userName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{p.userId}</p>
                      </td>
                      <td className="p-5">
                        <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-orange-400 text-sm">
                          {p.transactionId}
                        </span>
                      </td>
                      <td className="p-5 font-black text-green-500">UGX {p.total?.toLocaleString()}</td>