import { Users, ShieldCheck, DollarSign } from 'lucide-react';
export const AdminStats = ({ users, payments }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800"><Users size={20} className="text-blue-500 mb-2"/><p className="text-2xl font-black">{users.length}</p><p className="text-slate-400 text-xs">Members</p></div>
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800"><ShieldCheck size={20} className="text-green-500 mb-2"/><p className="text-2xl font-black">{payments.length}</p><p className="text-slate-400 text-xs">Pending</p></div>
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800"><DollarSign size={20} className="text-orange-500 mb-2"/><p className="text-2xl font-black">{users.length * 2000}+</p><p className="text-slate-400 text-xs">UGX Est.</p></div>
  </div>
);