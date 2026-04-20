import { useState } from 'react';
import { Check, Zap, Crown, Diamond, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const PLANS = [
  { id: 'spark', name: 'Spark Pass', price: 500, duration: '2 hours', icon: Zap, color: 'orange' },
  { id: 'blaze', name: 'Blaze Pass', price: 800, duration: '6 hours', icon: Zap, color: 'orange' },
  { id: 'daily', name: 'Daily Pass', price: 1100, duration: '24 hours', icon: Check, color: 'green' },
  { id: 'weekly', name: 'Weekly Pass', price: 3000, duration: '7 days', icon: Check, color: 'blue', download: true },
  { id: 'monthly', name: 'Monthly Pass', price: 9500, duration: '30 days', icon: Crown, color: 'purple', download: true },
  { id: 'unlimited', name: 'Unlimited Pass', price: 225000, duration: 'Lifetime', icon: Diamond, color: 'purple', download: true, featured: true },
];

export default function Subscription() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (plan: any) => {
    if (isAdmin) return alert("Admin Master Access is active!");
    if (!user) return navigate('/login');

    // 1. Trigger Dialer
    window.location.href = "tel:*185#";

    // 2. Save choice and move to payment submission
    sessionStorage.setItem("pending_item", JSON.stringify({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        type: 'subscription'
    }));

    alert("Dialer opened! After paying " + plan.price + " UGX, click OK to submit your proof.");
    navigate('/cart');
  };

  return (
    <div className="bg-black text-white min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {isAdmin && (
          <div className="mb-10 bg-orange-600/20 border border-orange-600 p-6 rounded-3xl flex items-center gap-4">
            <ShieldCheck className="text-orange-500 w-10 h-10" />
            <div>
              <h2 className="text-xl font-bold">ADMIN MASTER ACCESS</h2>
              <p className="text-gray-400 text-sm">You have lifetime access to everything.</p>
            </div>
          </div>
        )}

        <h1 className="text-5xl font-black text-center mb-12 uppercase italic text-orange-500">Choose A Pass</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`bg-slate-900 p-8 rounded-[40px] border border-white/5 flex flex-col ${plan.featured ? 'ring-2 ring-orange-500' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl bg-${plan.color}-600 flex items-center justify-center mb-6`}>
                <plan.icon size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-black mb-1">{plan.name}</h3>
              <p className="text-3xl font-black text-white mb-4">{plan.price.toLocaleString()} <span className="text-xs text-gray-500">UGX</span></p>
              <p className="text-xs font-bold uppercase text-orange-500 mb-6 bg-orange-500/10 w-fit px-3 py-1 rounded-full">{plan.duration}</p>
              
              <ul className="space-y-3 mb-10 flex-1">
                <li className="flex items-center gap-2 text-sm text-gray-300"><Check size={16} className="text-green-500"/> HD Streaming</li>
                {plan.download && <li className="flex items-center gap-2 text-sm text-green-400 font-bold"><Check size={16}/> Downloads Unlocked</li>}
              </ul>

              <button 
                onClick={() => handleSelectPlan(plan)}
                className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-orange-700 transition-all"
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}