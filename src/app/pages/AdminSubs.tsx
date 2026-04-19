export const AdminSubs = ({ payments, onApprove }: any) => (
  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
    <table className="w-full text-left text-xs">
      <thead className="bg-slate-800 text-slate-400 uppercase"><tr><th className="p-4">User</th><th className="p-4">ID</th><th className="p-4">Action</th></tr></thead>
      <tbody className="divide-y divide-slate-800">
        {payments.map((p: any) => (
          <tr key={p.id} className="hover:bg-slate-800/50">
            <td className="p-4"><b>{p.userName}</b><br/>UGX {p.total}</td>
            <td className="p-4 font-mono text-orange-400">{p.transactionId}</td>
            <td className="p-4"><button onClick={() => onApprove(p)} className="bg-green-600 px-3 py-1 rounded font-bold">Approve</button></td>
          </tr>
        ))}
      </tbody>
    </table>
    {payments.length === 0 && <p className="p-10 text-center text-slate-500 text-xs">No pending requests.</p>}
  </div>
);