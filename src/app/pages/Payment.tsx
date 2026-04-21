import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface PaymentItem {
  id: string;
  name: string;
  price: number;
  type: 'subscription' | 'software' | 'movie';
  platform?: string;
  djName?: string;
}

export default function Payment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [item, setItem] = useState<PaymentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [error, setError] = useState('');
  const [orderTrackingId, setOrderTrackingId] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    // Get payment item from sessionStorage
    const pendingItem = sessionStorage.getItem('pending_payment_item');
    if (pendingItem) {
      setItem(JSON.parse(pendingItem));
    } else {
      setError('No payment item found');
    }

    // Check if returning from PesaPal
    const trackingId = searchParams.get('orderTrackingId');
    if (trackingId) {
      verifyPayment(trackingId);
    }
  }, [searchParams]);

  const initiatePayment = async () => {
    if (!item || !user) {
      setError('Missing user or payment information');
      return;
    }

    setLoading(true);
    setStatus('processing');
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/pesapal/create-order`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: item.price,
            currency: 'UGX',
            description: `DJ Enoch ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}: ${item.name}`,
            customerEmail: user.email,
            customerName: user.user_metadata?.full_name || user.email,
            userId: user.id,
            itemId: item.id,
            itemType: item.type,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment order');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setOrderTrackingId(data.orderTrackingId);
      setRedirectUrl(data.redirectUrl);

      // Redirect to PesaPal
      window.location.href = data.redirectUrl;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Payment initiation failed';
      setError(errorMsg);
      setStatus('failed');
      setLoading(false);
    }
  };

  const verifyPayment = async (trackingId: string) => {
    setLoading(true);
    setStatus('processing');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/pesapal/verify`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderTrackingId: trackingId,
            userId: user?.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }

      const data = await response.json();

      if (data.status === 'COMPLETED') {
        setStatus('success');
        setOrderTrackingId(trackingId);

        // Redirect based on item type
        setTimeout(() => {
          if (item?.type === 'subscription') {
            sessionStorage.removeItem('pending_payment_item');
            navigate('/my-library');
          } else if (item?.type === 'software') {
            window.location.href = item.downloadUrl || '#';
            setTimeout(() => {
              sessionStorage.removeItem('pending_payment_item');
              navigate('/software');
            }, 2000);
          } else if (item?.type === 'movie') {
            window.location.href = item.downloadUrl || '#';
            setTimeout(() => {
              sessionStorage.removeItem('pending_payment_item');
              navigate('/movies');
            }, 2000);
          }
        }, 2000);
      } else if (data.status === 'FAILED' || data.status === 'CANCELLED') {
        setStatus('failed');
        setError('Payment was not completed. Please try again.');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Payment verification failed';
      setError(errorMsg);
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Please log in to proceed with payment</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Payment item not found</p>
          <button
            onClick={() => navigate('/subscription')}
            className="bg-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-slate-900 text-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Loading State */}
        {status === 'processing' && (
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-8 text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-orange-500" size={48} />
            <h2 className="text-xl font-bold mb-2">Processing Payment</h2>
            <p className="text-gray-400">Redirecting to PesaPal...</p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="bg-gradient-to-b from-green-900/20 to-slate-900/50 rounded-2xl border border-green-500/30 p-8 text-center">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
            <h2 className="text-xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-400 mb-4">Your payment has been verified</p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </div>
        )}

        {/* Failed State */}
        {status === 'failed' && (
          <div className="bg-gradient-to-b from-red-900/20 to-slate-900/50 rounded-2xl border border-red-500/30 p-8">
            <XCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-xl font-bold mb-2 text-center">Payment Failed</h2>
            <p className="text-red-400 mb-6 text-center text-sm">{error}</p>
            <button
              onClick={() => {
                setStatus('idle');
                setError('');
              }}
              className="w-full bg-orange-600 py-3 rounded-lg font-bold hover:bg-orange-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Idle State - Payment Review */}
        {status === 'idle' && (
          <div className="bg-gradient-to-b from-orange-900/20 to-slate-900/50 rounded-2xl border border-orange-500/30 p-8">
            <h1 className="text-2xl font-black uppercase text-orange-500 mb-6 text-center">
              Review Payment
            </h1>

            <div className="bg-slate-800/50 rounded-lg p-4 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Item:</span>
                <span className="font-bold">{item.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Type:</span>
                <span className="font-bold capitalize">{item.type}</span>
              </div>
              {item.platform && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Platform:</span>
                  <span className="font-bold">{item.platform}</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-3 flex justify-between items-center text-lg">
                <span className="font-bold">Total:</span>
                <span className="text-orange-500 font-black">{item.price} UGX</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={initiatePayment}
                disabled={loading}
                className="w-full bg-orange-600 py-3 rounded-lg font-black uppercase hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : (
                  'Pay with PesaPal'
                )}
              </button>

              <button
                onClick={() => {
                  sessionStorage.removeItem('pending_payment_item');
                  navigate(-1);
                }}
                disabled={loading}
                className="w-full bg-slate-700 py-3 rounded-lg font-bold hover:bg-slate-600 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-xs text-blue-300">
                <strong>Payment Methods:</strong> You will be able to pay via Airtel Money, MTN Mobile Money, or Card through PesaPal
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
