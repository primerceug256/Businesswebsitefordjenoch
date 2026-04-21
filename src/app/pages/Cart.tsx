import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function Cart() {
  const { items, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Airtel Money state
  const [proof, setProof] = useState<File | null>(null);
  const [tid, setTid] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pesapal' | 'airtel'>('pesapal');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const pendingSub = JSON.parse(sessionStorage.getItem("pending_item") || "null");
  const totalAmount = total + (pendingSub?.price || 0);

  const submitPesaPalPayment = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create PesaPal order
      const orderRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/pesapal/create-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'UGX',
          description: 'DJ Enoch Music Purchase',
          customerEmail: user?.email,
          customerName: user?.name || user?.email,
          userId: user?.id,
          items: [...items, pendingSub].filter(Boolean),
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        setError(err.error || "Failed to create payment order");
        setLoading(false);
        return;
      }

      const { orderTrackingId, redirectUrl } = await orderRes.json();

      if (!redirectUrl) {
        setError("Failed to get payment URL");
        setLoading(false);
        return;
      }

      // Store pending payment info
      sessionStorage.setItem('pending_payment', JSON.stringify({
        orderTrackingId,
        userId: user?.id,
        items: [...items, pendingSub].filter(Boolean),
        total: totalAmount,
      }));

      // Redirect to PesaPal
      window.location.href = redirectUrl;
    } catch (err) {
      setError("Payment error. Please try again.");
      console.error(err);
      setLoading(false);
    }
  };

  const submitAirtelPayment = async (e: any) => {
    e.preventDefault();
    setError('');
    
    if (!proof || !tid) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("userId", user?.id || "");
      fd.append("userCode", user?.code || user?.id || "");
      fd.append("userName", user?.name || user?.email || "");
      fd.append("userEmail", user?.email || "");
      fd.append("transactionId", tid);
      fd.append("proof", proof);
      fd.append("paymentMethod", "airtel");
      fd.append("items", JSON.stringify([...items, pendingSub].filter(Boolean)));
      fd.append("total", totalAmount.toString());

      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        body: fd
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess("Payment submitted! Waiting for Admin approval.");
        setTimeout(() => {
          clearCart();
          sessionStorage.removeItem("pending_item");
          navigate('/my-library');
        }, 2000);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Submission error. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !pendingSub) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8 text-center">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-orange-500">Order Summary</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      {item.djName && <p className="text-sm text-gray-400">by {item.djName}</p>}
                    </div>
                    <p className="font-bold text-orange-500">{item.price.toLocaleString()} UGX</p>
                  </div>
                ))}
                
                {pendingSub && (
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div>
                      <p className="font-bold">{pendingSub.name}</p>
                      <p className="text-sm text-gray-400">Subscription</p>
                    </div>
                    <p className="font-bold text-orange-500">{pendingSub.price.toLocaleString()} UGX</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-orange-500/30">
                <div className="flex justify-between items-center text-lg font-black">
                  <span>Total:</span>
                  <span className="text-orange-500">{totalAmount.toLocaleString()} UGX</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-b from-orange-900/20 to-slate-900/50 rounded-2xl border border-orange-500/30 p-6">
              <h2 className="text-xl font-black uppercase text-orange-500 mb-6">Payment</h2>

              {/* Payment Method Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pesapal')}
                  className={`flex-1 py-2 rounded-lg font-bold transition text-sm ${
                    paymentMethod === 'pesapal'
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  PesaPal
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('airtel')}
                  className={`flex-1 py-2 rounded-lg font-bold transition text-sm ${
                    paymentMethod === 'airtel'
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  Airtel
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-500 rounded-lg text-green-200 text-sm">
                  {success}
                </div>
              )}

              {/* PesaPal Form */}
              {paymentMethod === 'pesapal' && (
                <form onSubmit={submitPesaPalPayment} className="space-y-4">
                  <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg text-sm text-blue-200">
                    <p className="font-bold mb-1">✓ Fast & Secure</p>
                    <p>You'll be redirected to PesaPal to complete your payment safely.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 py-3 rounded-lg font-black uppercase hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : `Pay ${totalAmount.toLocaleString()} UGX`}
                  </button>
                </form>
              )}

              {/* Airtel Money Form */}
              {paymentMethod === 'airtel' && (
                <form onSubmit={submitAirtelPayment} className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Send money to:</p>
                    <p className="font-bold text-lg text-orange-500">+256 747 816 444</p>
                    <p className="text-xs text-gray-400">DJ ENOCH PRO</p>
                  </div>

                  <input
                    type="text"
                    placeholder="Transaction ID"
                    value={tid}
                    onChange={(e) => setTid(e.target.value)}
                    className="w-full bg-black p-3 rounded-lg border border-white/10 focus:border-orange-500 focus:outline-none"
                    disabled={loading}
                  />

                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Upload proof screenshot</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProof(e.target.files?.[0] || null)}
                      className="w-full text-xs border border-dashed border-white/20 p-3 rounded-lg hover:border-orange-500 transition"
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 py-3 rounded-lg font-black uppercase hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Submit Proof"}
                  </button>
                </form>
              )}

              <p className="text-xs text-gray-500 mt-4 text-center">
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function Cart() {
  const { items, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Airtel Money state
  const [proof, setProof] = useState<File | null>(null);
  const [tid, setTid] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pesapal' | 'airtel'>('pesapal');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const pendingSub = JSON.parse(sessionStorage.getItem("pending_item") || "null");
  const totalAmount = total + (pendingSub?.price || 0);

  const submitPesaPalPayment = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create PesaPal order
      const orderRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/pesapal/create-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'UGX',
          description: 'DJ Enoch Music Purchase',
          customerEmail: user?.email,
          customerName: user?.name || user?.email,
          userId: user?.id,
          items: [...items, pendingSub].filter(Boolean),
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        setError(err.error || "Failed to create payment order");
        setLoading(false);
        return;
      }

      const { orderTrackingId, redirectUrl } = await orderRes.json();

      if (!redirectUrl) {
        setError("Failed to get payment URL");
        setLoading(false);
        return;
      }

      // Store pending payment info
      sessionStorage.setItem('pending_payment', JSON.stringify({
        orderTrackingId,
        userId: user?.id,
        items: [...items, pendingSub].filter(Boolean),
        total: totalAmount,
      }));

      // Redirect to PesaPal
      window.location.href = redirectUrl;
    } catch (err) {
      setError("Payment error. Please try again.");
      console.error(err);
      setLoading(false);
    }
  };

  const submitAirtelPayment = async (e: any) => {
    e.preventDefault();
    setError('');
    
    if (!proof || !tid) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("userId", user?.id || "");
      fd.append("userCode", user?.code || user?.id || "");
      fd.append("userName", user?.name || user?.email || "");
      fd.append("userEmail", user?.email || "");
      fd.append("transactionId", tid);
      fd.append("proof", proof);
      fd.append("paymentMethod", "airtel");
      fd.append("items", JSON.stringify([...items, pendingSub].filter(Boolean)));
      fd.append("total", totalAmount.toString());

      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        body: fd
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess("Payment submitted! Waiting for Admin approval.");
        setTimeout(() => {
          clearCart();
          sessionStorage.removeItem("pending_item");
          navigate('/my-library');
        }, 2000);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Submission error. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

      // Load Stripe.js
      const stripeScript = document.createElement('script');
      stripeScript.src = 'https://js.stripe.com/v3/';
      stripeScript.onload = async () => {
        // @ts-ignore
        const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        // @ts-ignore
        const elements = stripe.elements();
        const cardElement = elements.create('card');
        
        // Create a container for card element
        const cardContainer = document.getElementById('stripe-card-element');
        if (cardContainer) {
          cardContainer.innerHTML = '';
          cardElement.mount(cardContainer);

          // Handle real-time validation errors
          cardElement.addEventListener('change', (event) => {
            if (event.error) {
              setError(event.error.message);
            } else {
              setError('');
            }
          });

          // Confirm payment
          // @ts-ignore
          const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: user?.name || user?.email,
                email: user?.email,
              },
            },
          });

          if (confirmError) {
            setError(confirmError.message || "Payment failed");
            setLoading(false);
          } else if (paymentIntent?.status === 'succeeded') {
            // Submit payment to backend
            const submitRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/payments/submit`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: user?.id,
                userCode: user?.code || user?.id,
                userName: user?.name || user?.email,
                userEmail: user?.email,
                items: JSON.stringify([...items, pendingSub].filter(Boolean)),
                total: totalAmount,
                paymentMethod: 'stripe',
                stripePaymentIntentId: paymentIntentId,
              }),
            });

            if (submitRes.ok) {
              setSuccess("Payment successful! Your items are ready for download.");
              setTimeout(() => {
                clearCart();
                sessionStorage.removeItem("pending_item");
                navigate('/my-library');
              }, 2000);
            } else {
              setError("Payment processed but order creation failed. Please contact support.");
            }
          }
        }
      };
      document.head.appendChild(stripeScript);
    } catch (err) {
      setError("Payment error. Please try again.");
      console.error(err);
      setLoading(false);
    }
  };

  if (items.length === 0 && !pendingSub) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-b from-black to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8 text-center">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-orange-500">Order Summary</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      {item.djName && <p className="text-sm text-gray-400">by {item.djName}</p>}
                    </div>
                    <p className="font-bold text-orange-500">${item.price.toFixed(2)}</p>
                  </div>
                ))}
                
                {pendingSub && (
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div>
                      <p className="font-bold">{pendingSub.name}</p>
                      <p className="text-sm text-gray-400">Subscription</p>
                    </div>
                    <p className="font-bold text-orange-500">${pendingSub.price.toFixed(2)}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-orange-500/30">
                <div className="flex justify-between items-center text-lg font-black">
                  <span>Total:</span>
                  <span className="text-orange-500">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-b from-orange-900/20 to-slate-900/50 rounded-2xl border border-orange-500/30 p-6">
              <h2 className="text-xl font-black uppercase text-orange-500 mb-6">Payment</h2>

              {/* Payment Method Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`flex-1 py-2 rounded-lg font-bold transition ${
                    paymentMethod === 'stripe'
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  Stripe
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('airtel')}
                  className={`flex-1 py-2 rounded-lg font-bold transition ${
                    paymentMethod === 'airtel'
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  Airtel
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-500 rounded-lg text-green-200 text-sm">
                  {success}
                </div>
              )}

              {/* Stripe Form */}
              {paymentMethod === 'stripe' && (
                <form onSubmit={submitStripePayment} className="space-y-4">
                  <div id="stripe-card-element" className="p-3 bg-black rounded-lg border border-white/10" />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 py-3 rounded-lg font-black uppercase hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
                  </button>
                </form>
              )}

              {/* Airtel Money Form */}
              {paymentMethod === 'airtel' && (
                <form onSubmit={submitAirtelPayment} className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Send money to:</p>
                    <p className="font-bold text-lg text-orange-500">+256 747 816 444</p>
                    <p className="text-xs text-gray-400">DJ ENOCH PRO</p>
                  </div>

                  <input
                    type="text"
                    placeholder="Transaction ID"
                    value={tid}
                    onChange={(e) => setTid(e.target.value)}
                    className="w-full bg-black p-3 rounded-lg border border-white/10 focus:border-orange-500 focus:outline-none"
                    disabled={loading}
                  />

                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Upload proof screenshot</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProof(e.target.files?.[0] || null)}
                      className="w-full text-xs border border-dashed border-white/20 p-3 rounded-lg hover:border-orange-500 transition"
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 py-3 rounded-lg font-black uppercase hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Submit Proof"}
                  </button>
                </form>
              )}

              <p className="text-xs text-gray-500 mt-4 text-center">
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
=======
    <div className="min-h-screen bg-black text-white py-20 px-4 flex flex-col items-center">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-[40px] border border-white/5 shadow-2xl">
        <h1 className="text-3xl font-black uppercase text-orange-500 mb-6 italic">Cart Summary</h1>
        
        <div className="space-y-3 mb-8">
          {items.map((it, i) => (
            <div key={i} className="flex justify-between text-sm border-b border-white/5 pb-2">
              <span className="text-slate-400 font-bold uppercase">{it.name}</span>
              <span className="text-orange-500 font-mono">{it.price} UGX</span>
            </div>
          ))}
          <div className="flex justify-between pt-4 text-2xl font-black uppercase italic">
            <span>Total</span>
            <span className="text-orange-500">{total} UGX</span>
          </div>
        </div>

        <button 
          onClick={checkout} 
          disabled={loading || items.length === 0}
          className="w-full bg-orange-600 py-6 rounded-3xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-orange-500 transition-all shadow-xl shadow-orange-900/20"
        >
          {loading ? <Loader2 className="animate-spin"/> : <><CreditCard/> Pay with Pesapal</>}
        </button>

        <div className="mt-8 flex items-center gap-3 justify-center opacity-50">
            <ShieldCheck size={16}/>
            <p className="text-[10px] font-black uppercase tracking-widest">MTN / Airtel / Visa Accepted</p>
        </div>
>>>>>>> fde0bbd30f7a22cb23b31404af6ffce6070014f9
      </div>
    </div>
  );
}