import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Check, Zap, Diamond } from 'lucide-react';

const PLANS = [
  { id: 'monthly', name: 'Monthly Pass', price: 9500, duration: '30 days', icon: Zap, color: 'purple' },
  { id: 'unlimited', name: 'Unlimited Pass', price: 225000, duration: 'Lifetime', icon: Diamond, color: 'orange' },
];

export default function Subscription() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (plan: any) => {
    if (isAdmin) return alert("Admin Active");
    if (!user) return navigate('/login');

    // AUTOMATIC DIALER
    window.location.href = "tel:*185#";

    sessionStorage.setItem("pending_item", JSON.stringify({
      id: plan.id, name: plan.name, price: plan.price, type: 'subscription'
    }));
    
    alert("Dialing *185#... Pay " + plan.price + " UGX then click OK to upload proof.");
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <h1 className="text-5xl font-black text-center mb-12 text-orange-500 uppercase italic">Select Pass</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {PLANS.map(plan => (
          <div key={plan.id} className="bg-slate-900 p-10 rounded-[48px] border border-white/5 text-center">
            <h2 className="text-3xl font-black mb-2">{plan.name}</h2>
            <p className="text-4xl font-black text-orange-500 mb-6">{plan.price} UGX</p>
            <button onClick={() => handleSelect(plan)} className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase tracking-widest">Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}