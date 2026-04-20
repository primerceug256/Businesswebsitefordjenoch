import { useState } from 'react';
import { Check, Zap, Crown, Diamond, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

// The 'unlimited' id here maps to the 36500-day logic in your Admin Dashboard approve function
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
    // If you are admin, you don't need to go to cart
    if (isAdmin) {
      alert("You are the Admin. You already have Lifetime Master Access!");
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
        
        {/* Admin Master Access Alert */}
        {isAdmin && (
          <div className="max-w-4xl mx-auto mb-12 bg-orange-600/20 border border-orange-600 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="bg-orange-600 p-4 rounded-full shadow-2xl">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-orange-500 uppercase tracking-tighter">Admin Master Access</h2>
              <p className="text-gray-300 mt-1">You are logged in as <b>{user?.email}</b>. All features, movies, music, and software downloads are automatically unlocked for you forever.</p>
              <button 
                onClick={() => navigate('/admin')}
                className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-bold text-sm transition-all"
              >
                Go to Admin Dashboard
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400">
            {isAdmin 
              ? "Previewing the plans available to your customers." 
              : "New users get 6 hours free! Special offers on public holidays & July 20th."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-gray-900 rounded-2xl p-6 transition-all duration-300 hover:scale-105 border border-white/5 hover:border-orange-500/50 ${
                  plan.featured ? 'ring-4 ring-purple-600 shadow-[0_0_30px_rgba(147,51,234,0.3)]' : ''
                }`}
              >