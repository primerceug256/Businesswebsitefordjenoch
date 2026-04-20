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
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const handleSelectPlan = (planId: string) => {
    if (isAdmin) {
      alert("Admin Master Access is already active!");
      return;
    }
    if (!user) {
      navigate('/signup');
      return;
    }
    setSelectedPlan(planId);
    navigate('/cart');
  };

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        
        {/* Admin Banner */}
        {isAdmin && (
          <div className="max-w-4xl mx-auto mb-12 bg-orange-600/20 border border-orange-600 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-orange-600 p-4 rounded-full">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-orange-500 uppercase">Admin Master Access</h2>
              <p className="text-gray-300">All content is automatically unlocked for you forever.</p>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400">
            {isAdmin ? "Previewing customer plans." : "New users get 6 hours free! Special holiday offers available."}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-gray-900 rounded-2xl p-6 transition-all border border-white/5 ${
                  plan.featured ? 'ring-4 ring-purple-600 shadow-2xl' : ''
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 px-4 py-1 rounded-full text-xs font-bold uppercase">
                    Lifetime
                  </div>
                )}

                <div className={`w-12 h-12 rounded-full bg-${plan.color}-600 flex items-center justify-center mb-4`}>
                  <Icon size={24} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-orange-600">{plan.price.toLocaleString()}</span>
                  <span className="text-gray-400 text-sm ml-1">UGX</span>
                </div>
                <p className="text-gray-400 mb-6 text-xs uppercase tracking-widest">{plan.duration}</p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={16} className="text-green-500" /> HD Streaming
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={16} className="text-green-500" /> All Devices
                  </li>
                  {plan.download && (
                    <li className="flex items-center gap-2 text-sm text-green-400 font-bold">
                      <Check size={16} className="text-green-500" /> Downloads Enabled
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isAdmin}
                  className={`w-full py-3 rounded-xl font-black uppercase tracking-widest transition-all ${
                    isAdmin 
                    ? 'bg-gray-800 text-gray-500' 
                    : `bg-${plan.color}-600 hover:opacity-90`
                  }`}
                >
                  {isAdmin ? "Admin Active" : "Select Plan"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Special Offers */}
        <div className="mt-16 bg-gray-900 rounded-3xl p-10 border border-white/5">
          <h2 className="text-3xl font-black mb-10 text-center uppercase tracking-tighter">🎁 Free Promotions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-black/40 p-8 rounded-2xl border border-white/5">
              <div className="text-4xl mb-4">🆕</div>