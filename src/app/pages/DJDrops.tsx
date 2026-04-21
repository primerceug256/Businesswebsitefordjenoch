import { useState } from 'react';
import { Mic, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function DJDrops() {
  const [djName, setDjName] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('djName', djName);
      formData.append('transactionId', transactionId);
      formData.append('amount', '8000');
      formData.append('type', 'dj-drop');
      formData.append('status', 'pending');
      formData.append('createdAt', new Date().toISOString());
      
      if (screenshot) {
        formData.append('screenshot', screenshot);
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/dj-drops/submit`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setSubmitted(true);
        setDjName('');
        setTransactionId('');
        setScreenshot(null);
      } else {
        alert('Failed to submit order. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting DJ drop order:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-black text-white min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h1 className="text-4xl font-bold mb-4">Order Submitted!</h1>
            <p className="text-xl text-gray-300 mb-8">
              Your DJ drop order has been submitted for approval. You'll receive your custom DJ drop within 24-48 hours after payment verification.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg font-semibold"
            >
              Order Another DJ Drop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="bg-orange-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mic size={40} />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Custom DJ Drops
            </h1>
            <p className="text-xl text-gray-400 mb-4">
              Get a professional DJ drop with your name
            </p>
            <p className="text-3xl font-bold text-orange-600">8,000 UGX</p>
          </div>

          {/* What You Get */}
          <div className="bg-gray-900 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What You Get</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-orange-600 text-xl">✓</span>
                <span>Professional voice artist recording</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 text-xl">✓</span>
                <span>High-quality audio production</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 text-xl">✓</span>
                <span>Multiple formats (MP3, WAV)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 text-xl">✓</span>
                <span>Delivery within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 text-xl">✓</span>
                <span>Unlimited revisions until satisfied</span>
              </li>
            </ul>
          </div>

          {/* Payment Instructions */}
          <div className="bg-orange-600/10 border border-orange-600/30 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="text-orange-600" />
              Payment Instructions
            </h3>
            <ol className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="font-bold text-orange-600">1.</span>
                <span>Send <strong className="text-white">8,000 UGX</strong> via Airtel Money to <strong className="text-white">+256747816444</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-600">2.</span>
                <span>Take a screenshot or note down your transaction ID</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-600">3.</span>
                <span>Fill out the form below with your DJ name and transaction details</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-600">4.</span>
                <span>Wait for admin approval and delivery of your DJ drop</span>
              </li>
            </ol>
          </div>

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Order Your DJ Drop</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Your DJ Name *
                </label>
                <input
                  type="text"
                  value={djName}
                  onChange={(e) => setDjName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="e.g., DJ Awesome"
                />
                <p className="text-sm text-gray-400 mt-2">
                  This is the name that will be included in your DJ drop
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Airtel Money Transaction ID *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="e.g., MP240419XXXX"
                />
                <p className="text-sm text-gray-400 mt-2">
                  Enter the transaction ID from your Airtel Money payment
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Payment Screenshot (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label
                    htmlFor="screenshot-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="text-gray-400 mb-2" size={40} />
                    <p className="text-gray-400 mb-1">
                      {screenshot ? screenshot.name : 'Click to upload screenshot'}
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-orange-600 hover:bg-orange-700 py-4 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Submitting...' : (
                <>
                  <Mic size={20} />
                  Submit Order
                </>
              )}
            </button>

            <p className="text-center text-gray-400 text-sm mt-4">
              Your order will be processed after payment verification
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
