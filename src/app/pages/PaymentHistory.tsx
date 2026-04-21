import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Download, Receipt, AlertCircle, RotateCcw } from 'lucide-react';
import { projectId, publicAnonKey } from '@utils/supabase/info';

interface Payment {
  id: string;
  total: number;
  items: string;
  paymentMethod: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  receiptId?: string;
}

export default function PaymentHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPayments();
  }, [user, navigate]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/user/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch payments');
      
      const data = await response.json();
      setPayments(Array.isArray(data) ? data : data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async (receiptId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/receipts/${receiptId}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );

      if (!response.ok) throw new Error('Failed to download receipt');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${receiptId}.pdf`;
      a.click();
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Failed to download receipt');
    }
  };

  const requestRefund = async (paymentId: string) => {
    if (!confirm('Are you sure you want to request a refund for this payment?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/request-refund`,
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
        alert('Refund request submitted. An admin will review your request.');
        fetchPayments();
      } else {
        alert('Failed to submit refund request');
      }
    } catch (error) {
      console.error('Error requesting refund:', error);
      alert('Error submitting refund request');
    }
  };

  const totalSpent = payments
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2 text-orange-500">Payment History</h1>
          <p className="text-gray-400">View and manage your payments and receipts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-lg border border-white/10 p-6">
            <p className="text-gray-400 text-sm mb-2">Total Spent</p>
            <p className="text-3xl font-black text-orange-500">{totalSpent.toLocaleString()} UGX</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg border border-white/10 p-6">
            <p className="text-gray-400 text-sm mb-2">Total Payments</p>
            <p className="text-3xl font-black text-white">{payments.length}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg border border-white/10 p-6">
            <p className="text-gray-400 text-sm mb-2">Approved</p>
            <p className="text-3xl font-black text-green-400">
              {payments.filter(p => p.status === 'approved').length}
            </p>
          </div>
        </div>

        {/* Payments List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading your payments...</div>
          ) : payments.length === 0 ? (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-8 text-center">
              <AlertCircle className="mx-auto mb-4 text-blue-400" size={40} />
              <p className="text-blue-300">No payments found</p>
              <p className="text-sm text-blue-400 mt-2">Your payment history will appear here</p>
            </div>
          ) : (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-slate-800/50 rounded-lg border border-white/10 overflow-hidden hover:border-orange-500/50 transition"
              >
                {/* Payment Row */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">
                          {JSON.parse(payment.items)[0]?.name || 'Payment'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          payment.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          payment.status === 'pending' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {payment.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString()} at{' '}
                        {new Date(payment.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black text-orange-500">
                        {payment.total.toLocaleString()} UGX
                      </p>
                      <p className="text-sm text-gray-400 capitalize">{payment.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setShowDetails(showDetails === payment.id ? null : payment.id)}
                      className="px-4 py-2 bg-slate-700 rounded hover:bg-slate-600 transition text-sm font-bold"
                    >
                      {showDetails === payment.id ? 'Hide Details' : 'View Details'}
                    </button>

                    {payment.receiptId && (
                      <button
                        onClick={() => downloadReceipt(payment.receiptId!)}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition text-sm font-bold flex items-center gap-2"
                      >
                        <Receipt size={16} />
                        Receipt
                      </button>
                    )}

                    {payment.status === 'approved' && (
                      <button
                        onClick={() => requestRefund(payment.id)}
                        className="px-4 py-2 bg-orange-600 rounded hover:bg-orange-700 transition text-sm font-bold flex items-center gap-2"
                      >
                        <RotateCcw size={16} />
                        Request Refund
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {showDetails === payment.id && (
                  <div className="bg-slate-900/50 border-t border-white/10 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold mb-3 text-orange-500">Items Purchased</h4>
                        <ul className="space-y-2 text-sm">
                          {JSON.parse(payment.items).map((item: any, idx: number) => (
                            <li key={idx} className="flex justify-between text-gray-300">
                              <span>{item.name}</span>
                              <span className="font-bold text-orange-500">{item.price} UGX</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold mb-3 text-orange-500">Payment Details</h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex justify-between">
                            <span>Payment ID:</span>
                            <code className="text-xs bg-slate-800 px-2 py-1 rounded">{payment.id}</code>
                          </div>
                          <div className="flex justify-between">
                            <span>Method:</span>
                            <span className="capitalize">{payment.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className={
                              payment.status === 'approved' ? 'text-green-400' :
                              payment.status === 'pending' ? 'text-orange-400' :
                              'text-red-400'
                            }>
                              {payment.status.toUpperCase()}
                            </span>
                          </div>
                          {payment.approvedAt && (
                            <div className="flex justify-between">
                              <span>Approved:</span>
                              <span>{new Date(payment.approvedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                      <p className="text-xs text-blue-300">
                        <strong>Note:</strong> Keep your receipt for records. You can download it using the Receipt button above if available.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
