import { useState } from 'react';
import { Check, Zap, Crown, Diamond } from 'lucide-react';
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const handleSelectPlan = (planId: string) => {
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
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400">
            New users get 6 hours free! Special offers on public holidays & July 20th.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-gray-900 rounded-2xl p-6 hover:scale-105 transition-transform ${
                  plan.featured ? 'ring-4 ring-purple-600' : ''
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 px-4 py-1 rounded-full text-sm font-bold">
                    BEST VALUE
                  </div>
                )}

                <div className={`w-12 h-12 rounded-full bg-${plan.color}-600 flex items-center justify-center mb-4`}>
                  <Icon size={24} />
                </div>

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-orange-600">{plan.price.toLocaleString()}</span>
                  <span className="text-gray-400"> UGX</span>
                </div>
                <p className="text-gray-400 mb-6">{plan.duration}</p>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-green-500" />
                    HD Streaming
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-green-500" />
                    Watch on any device
                  </li>
                  {plan.download && (
                    <li className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-green-500" />
                      Download movies
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full bg-${plan.color}-600 py-3 rounded-lg font-semibold hover:bg-${plan.color}-700`}
                >
                  Select Plan
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gray-900 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-5xl mb-2">🎁</div>
              <h3 className="text-xl font-bold mb-2">New Users</h3>
              <p className="text-gray-400">6 hours free access on signup</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-5xl mb-2">🎉</div>
              <h3 className="text-xl font-bold mb-2">Public Holidays</h3>
              <p className="text-gray-400">10 hours free subscription</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-5xl mb-2">🎂</div>
              <h3 className="text-xl font-bold mb-2">July 20th</h3>
              <p className="text-gray-400">DJ Enoch's Birthday - Special free access!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
