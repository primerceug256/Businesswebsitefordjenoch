import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Download, Search, Filter, ChevronDown, Eye, RotateCcw } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  total: number;
  items: string;
  paymentMethod: string;
  orderTrackingId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
}

export default function AdminPaymentDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
      return;
    }
    fetchPayments();
  }, [isAdmin, navigate]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/admin/payments`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch payments');
      
      const data = await response.json();
      const allPayments = Array.isArray(data) ? data : data.payments || [];
      
      setPayments(allPayments);

      // Calculate stats
      const statsData = {
        total: allPayments.length,
        approved: allPayments.filter((p: Payment) => p.status === 'approved').length,
        pending: allPayments.filter((p: Payment) => p.status === 'pending').length,
        rejected: allPayments.filter((p: Payment) => p.status === 'rejected').length,
      };
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/admin/approve-payment`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentId }),
        }
      );

      if (response.ok) {
        fetchPayments();
        setSelectedPayment(null);
      }
    } catch (error) {
      console.error('Error approving payment:', error);
    }
  };

  const handleReject = async (paymentId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/admin/reject-payment`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentId }),
        }
      );

      if (response.ok) {
        fetchPayments();
        setSelectedPayment(null);
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
    }
  };

  const handleRefund = async (paymentId: string) => {
    if (!confirm('Are you sure? This will refund the payment.')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/admin/refund-payment`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentId }),
        }
      );

      if (response.ok) {
        fetchPayments();
        setSelectedPayment(null);
        alert('Refund processed successfully');
      } else {
        alert('Refund failed');
      }
    } catch (error) {
      console.error('Error refunding payment:', error);
      alert('Error processing refund');
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Amount', 'Method', 'Status', 'Date'];
    const rows = payments.map(p => [
      p.id,
      p.userName,
      p.userEmail,
      p.total,
      p.paymentMethod,
      p.status,
      new Date(p.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredPayments = payments.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = 
      p.userName.toLowerCase().includes(search.toLowerCase()) ||
      p.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = payments
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-4 text-orange-500">Payment Dashboard</h1>
          <p className="text-gray-400">Manage and track all payments</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 p-6 rounded-lg border border-white/10">
            <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-black text-orange-500">{totalRevenue.toLocaleString()} UGX</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg border border-white/10">
            <p className="text-gray-400 text-sm mb-2">Total Payments</p>
            <p className="text-3xl font-black text-white">{stats.total}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg border border-green-500/30">
            <p className="text-gray-400 text-sm mb-2">Approved</p>
            <p className="text-3xl font-black text-green-400">{stats.approved}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg border border-orange-500/30">
            <p className="text-gray-400 text-sm mb-2">Pending</p>
            <p className="text-3xl font-black text-orange-400">{stats.pending}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-900 rounded-lg border border-white/10 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 flex gap-4 w-full md:w-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 rounded-lg border border-white/10 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 bg-slate-800 rounded-lg border border-white/10 focus:border-orange-500 focus:outline-none"
              >
                <option value="all">All Payments</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-orange-600 rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
              >
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-slate-900 rounded-lg border border-white/10 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading payments...</div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No payments found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <div key={payment.id}>
                      <tr className="border-b border-white/10 hover:bg-slate-800/50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold">{payment.userName}</p>
                            <p className="text-sm text-gray-400">{payment.userEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-orange-500">{payment.total.toLocaleString()} UGX</td>
                        <td className="px-6 py-4 text-sm capitalize">{payment.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            payment.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            payment.status === 'pending' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {payment.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setExpandedId(expandedId === payment.id ? null : payment.id)}
                            className="text-orange-500 hover:text-orange-400 transition inline-flex items-center gap-1"
                          >
                            <Eye size={18} />
                            {expandedId === payment.id ? <ChevronDown size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details */}
                      {expandedId === payment.id && (
                        <tr className="bg-slate-800/30">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-400 mb-2">Items:</p>
                                <pre className="bg-slate-900 p-3 rounded text-xs text-gray-300 overflow-auto max-h-40">
                                  {JSON.stringify(JSON.parse(payment.items), null, 2)}
                                </pre>
                              </div>
                              <div className="flex gap-2">
                                {payment.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApprove(payment.id)}
                                      className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition text-sm font-bold"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleReject(payment.id)}
                                      className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition text-sm font-bold"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                {payment.status === 'approved' && (
                                  <button
                                    onClick={() => handleRefund(payment.id)}
                                    className="px-4 py-2 bg-orange-600 rounded hover:bg-orange-700 transition text-sm font-bold flex items-center gap-2"
                                  >
                                    <RotateCcw size={16} />
                                    Refund
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </div>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
