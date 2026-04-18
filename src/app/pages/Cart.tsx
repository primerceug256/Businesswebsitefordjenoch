import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingCart, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function Cart() {
  const { items, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const [transactionProof, setTransactionProof] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setTransactionProof(e.target.files[0]);
    }
  };

  const handleSubmitPayment = async () => {
    if (!transactionId && !transactionProof) {
      setMessage('Please provide transaction ID or upload proof');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('userId', user?.id || 'guest');
      formData.append('items', JSON.stringify(items));
      formData.append('total', total.toString());
      formData.append('transactionId', transactionId);
      if (transactionProof) {
        formData.append('proof', transactionProof);
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/payments/submit`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${publicAnonKey}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Submission failed');

      setMessage('Payment submitted! Waiting for admin approval.');
      setTimeout(() => {
        clearCart();
        setTransactionId('');
        setTransactionProof(null);
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error submitting payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart size={64} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-xl">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-400">
                      {item.type === 'dj-drop' && item.djName && `DJ Name: ${item.djName}`}
                      {item.type === 'software' && item.platform && `Platform: ${item.platform}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-orange-600 font-bold">{item.price.toLocaleString()} UGX</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-4 text-xl font-bold">
                <span>Total:</span>
                <span className="text-orange-600">{total.toLocaleString()} UGX</span>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
              <div className="bg-orange-600/10 border border-orange-600/30 rounded-lg p-4 mb-6">
                <p className="font-semibold mb-2">Send payment to:</p>
                <p className="text-lg">Airtel Money: <span className="font-bold text-orange-600">+256747816444</span></p>
              </div>

              {message && (
                <div className={`mb-4 p-4 rounded-lg ${
                  message.includes('Error') ? 'bg-red-600/20 text-red-400' : 'bg-green-600/20 text-green-400'
                }`}>
                  {message}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Transaction ID</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-600"
                    placeholder="Enter transaction ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Or Upload Screenshot</label>
                  <label className="flex items-center justify-center gap-2 w-full bg-gray-800 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700">
                    <Upload size={20} />
                    {transactionProof ? transactionProof.name : 'Choose file'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProofUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  onClick={handleSubmitPayment}
                  disabled={submitting}
                  className="w-full bg-orange-600 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Payment'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
