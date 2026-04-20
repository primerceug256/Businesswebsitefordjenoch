import { useState } from 'react';
import { Check, Zap, Crown, Diamond, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const PLANS = [
  { id: 'spark', name: 'Spark Pass', price: 500, duration: '2 hours', icon: Zap, color: 'orange' },
  { id: 'blaze', name: 'Blaze Pass', price: 800, duration: '6 hours', icon: Zap, color: 'orange' },
  { id: 'daily', name: 'Daily Pass', price: 1100, duration: '24 hours', icon: Check, color: 'green' },
  { id: '3days', name: '3 Days Pass', price: 2000, duration: '3 days', icon: Check, color: 'green' },
  { id: 'weekly', name: 'Weekly Pass', price: 3000, duration: '7 days', icon: Check, color: 'blue', download: true },
  { id: '2weeks', name: '2 Weeks Pass', price: 5500, duration: '14 days', icon: Check, color: 'blue', download: true },
  { id: 'monthly', name: 'Monthly Pass', price: 9500, duration: '30 days', icon: Crown, color: 'purple', download: true },
  { id: '2months', name: '2 Months Pass', price: 17500, duration: '60 days', icon: Crown, color: 'purple', download: true },
  { id: 'gold', name: 'Gold Pass', price: 25000, duration: '3 months', icon: Crown, color: 'yellow', download: true },
  { id: 'platinum', name: 'Platinum Pass', price: 49500, duration: '6 months', icon: Diamond, color: 'cyan', download: true },
  { id: 'diamond', name: 'Diamond Pass', price: 90000, duration: '1 year', icon: Diamond, color: 'pink', download: true },
  { id: 'unlimited', name: 'Unlimited Pass', price: 225000, duration: 'Lifetime', icon: Diamond, color: 'purple', download: true, featured: true },
];

export default function Subscription() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    if (isAdmin) {
      alert("Admin Master Access is active!");
      return;
    }
    if (!user) {
      navigate('/signup');
      return;
    }
    navigate('/cart');
  };

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        
        {/* Master Access Banner for you */}
        {isAdmin && (
          <div className="max-w-4xl mx-auto mb-12 bg-orange-600/10 border border-orange-600 p-6 rounded-3xl flex items-center gap-4">
            <ShieldCheck className="text-orange-600 w-10 h-10" />
            <div>
              <h2 className="text-xl font-bold uppercase">Owner Master Access</h2>
              <p className="text-gray-400 text-sm">You bypass all payments. Everything is free for you.</p>
            </div>
          </div>
        )}

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4">Choose Your Pass</h1>
          <p className="text-gray-400">Get instant access to the party beast library.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-gray-900 p-6 rounded-3xl border border-white/5 flex flex-col ${plan.featured ? 'ring-2 ring-purple-600' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full bg-${plan.color}-600 flex items-center justify-center mb-4`}>
                <plan.icon size={20} className="text-white" />
              </div>
              <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-black text-orange-500">{plan.price.toLocaleString()}</span>
                <span className="text-xs ml-1 text-gray-500">UGX</span>
              </div>
              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-6 bg-white/5 w-fit px-2 py-1 rounded">{plan.duration}</p>
              
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2 text-xs text-gray-300"><Check size={14} className="text-green-500"/> HD Streaming</li>
                <li className="flex items-center gap-2 text-xs text-gray-300"><Check size={14} className="text-green-500"/> Any Device</li>
                {plan.download && <li className="flex items-center gap-2 text-xs text-green-400 font-bold"><Check size={14} /> Full Downloads</li>}
              </ul>

              <button 
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-3 rounded-xl font-black uppercase text-xs tracking-widest ${isAdmin ? 'bg-gray-800' : 'bg-orange-600 hover:bg-orange-700'}`}
              >
                {isAdmin ? "Admin Mode" : "Buy Now"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/5 text-center">
              <h3 className="font-bold mb-2">🎁 Welcome Bonus</h3>
              <p className="text-xs text-gray-500">6 Hours free for every new signup.</p>
           </div>
           <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/5 text-center">
              <h3 className="font-bold mb-2">🎉 Holiday Specials</h3>
              <p className="text-xs text-gray-500">Free access during national holidays.</p>
           </div>
           <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/5 text-center">
              <h3 className="font-bold mb-2">🎂 Birthday Gift</h3>
              <p className="text-xs text-gray-500">July 20th is free access day!</p>
           </div>
        </div>

      </div>
    </div>
  );
}