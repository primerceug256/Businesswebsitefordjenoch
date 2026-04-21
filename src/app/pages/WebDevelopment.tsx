import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '@utils/supabase/info';
import { Send, Code, Globe, Sparkles } from 'lucide-react';

export default function WebDevelopment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fd, setFd] = useState({
    name: '',
    email: '',
    phone: '',
    websiteType: '',
    features: '',
    budget: '',
    timeline: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fd.name || !fd.email || !fd.websiteType) {
      return alert('Please fill in required fields!');
    }

    setLoading(true);

    try {
      const body = new FormData();
      body.append('userId', user?.id || 'guest');
      body.append('name', fd.name);
      body.append('email', fd.email);
      body.append('phone', fd.phone);
      body.append('websiteType', fd.websiteType);
      body.append('features', fd.features);
      body.append('budget', fd.budget);
      body.append('timeline', fd.timeline);
      body.append('description', fd.description);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/web-development/order`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body,
      });

      if (response.ok) {
        alert("Inquiry submitted! We'll contact you soon.");
        navigate('/contact');
      } else {
        alert('Submission failed. Try again.');
      }
    } catch (err) {
      alert('Network error. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div>
            <span className="text-sm uppercase tracking-[.35em] text-orange-400 font-bold">New Service</span>
            <h1 className="text-5xl font-black mt-4 uppercase italic tracking-tighter">Web Development Inquiry</h1>
            <p className="mt-6 text-slate-400 max-w-xl">
              Want a customized website, landing page, or business showcase? Send a request and our team will follow up with a proposal.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-10 text-slate-300">
              <div className="rounded-3xl border border-white/10 p-6 bg-slate-900/80">
                <Code className="text-orange-500 mb-3" size={24} />
                <p className="font-bold">Modern UI</p>
                <p className="text-sm text-slate-400 mt-2">Custom design with rapid deployment.</p>
              </div>
              <div className="rounded-3xl border border-white/10 p-6 bg-slate-900/80">
                <Globe className="text-orange-500 mb-3" size={24} />
                <p className="font-bold">Responsive Sites</p>
                <p className="text-sm text-slate-400 mt-2">Mobile-first, SEO-ready, and fast.</p>
              </div>
              <div className="rounded-3xl border border-white/10 p-6 bg-slate-900/80">
                <Sparkles className="text-orange-500 mb-3" size={24} />
                <p className="font-bold">Brand Growth</p>
                <p className="text-sm text-slate-400 mt-2">Build credibility with professional presence.</p>
              </div>
              <div className="rounded-3xl border border-white/10 p-6 bg-slate-900/80">
                <Send className="text-orange-500 mb-3" size={24} />
                <p className="font-bold">Fast Delivery</p>
                <p className="text-sm text-slate-400 mt-2">Clear timeline and quote before work begins.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-8 rounded-[40px] border border-white/5">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={fd.name}
                onChange={(e) => setFd({ ...fd, name: e.target.value })}
                placeholder="Your name"
                className="w-full bg-black/70 border border-white/10 rounded-3xl p-4 focus:border-orange-500 outline-none"
                required
              />
              <input
                value={fd.email}
                onChange={(e) => setFd({ ...fd, email: e.target.value })}
                placeholder="Email"
                type="email"
                className="w-full bg-black/70 border border-white/10 rounded-3xl p-4 focus:border-orange-500 outline-none"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={fd.phone}
                onChange={(e) => setFd({ ...fd, phone: e.target.value })}
                placeholder="Phone"
                className="w-full bg-black/70 border border-white/10 rounded-3xl p-4 focus:border-orange-500 outline-none"
              />
              <input
                value={fd.websiteType}
                onChange={(e) => setFd({ ...fd, websiteType: e.target.value })}
                placeholder="Project type"
                className="w-full bg-black/70 border border-white/10 rounded-3xl p-4 focus:border-orange-500 outline-none"
                required
              />
            </div>

            <textarea
              value={fd.features}
              onChange={(e) => setFd({ ...fd, features: e.target.value })}
              placeholder="Features you need"
              className="w-full bg-black/70 border border-white/10 rounded-3xl p-4 focus:border-orange-500 outline-none h-32"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={fd.budget}
                onChange={(e) => setFd({ ...fd, budget: e.target.value })}
                placeholder="Budget"
                className="w-full bg-black/70 border border-white/10 rounded-3xl p-4 focus:border-orange-500 outline-none"
              />
              <input
                value={fd.timeline}
                onChange={(e) => setFd({ ...fd, timeline: e.target.value })}
                placeholder="Timeline"
                className="w-full bg-black/70 border border-white/10 rounded-3xl p-4 focus:border-orange-500 outline-none"
              />
            </div>

            <textarea
              value={fd.description}
              onChange={(e) => setFd({ ...fd, description: e.target.value })}
              placeholder="Project description"
              className="w-full bg-black/70 border border-white/10 rounded-3xl p-4 focus:border-orange-500 outline-none h-40"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 transition-all py-4 rounded-3xl font-black uppercase"
            >
              {loading ? 'Sending request...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          {/* Info Side */}
          <div>
            <span className="text-sm uppercase tracking-[.35em] text-orange-400 font-bold">New Service</span>
            <h1 className="text-5xl font-black mt-4 uppercase italic">Web Development</h1>
            <p className="mt-6 text-slate-400 text-lg leading-relaxed">
              Launch a professional online presence for your DJ brand. We build responsive websites designed for music, events, drops, and digital products.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-4">