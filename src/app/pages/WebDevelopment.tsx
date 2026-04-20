import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Send, Code, Globe, Sparkles, Mail } from 'lucide-react';

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
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fd.name || !fd.email || !fd.websiteType) return alert("Please fill in required fields!");

    setLoading(true);
    try {
      const body = new FormData();
      body.append("userId", user?.id || 'guest');
      body.append("name", fd.name);
      body.append("email", fd.email);
      body.append("phone", fd.phone);
      body.append("websiteType", fd.websiteType);
      body.append("features", fd.features);
      body.append("budget", fd.budget);
      body.append("timeline", fd.timeline);
      body.append("description", fd.description);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-98d801c7-music/web-development/order`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        body: body
      });

      if (response.ok) {
        alert("Inquiry submitted! We'll contact you soon.");
        navigate('/contact');
      } else {
        alert("Submission failed. Try again.");
      }
    } catch (err) {
      alert("Network error. Check your connection.");
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
            <h1 className="text-5xl font-black mt-4">Website Development for DJs</h1>
            <p className="mt-6 text-slate-400 text-lg leading-relaxed">
              Launch a professional online presence for your DJ brand. We build responsive websites designed for music, events, drops, and digital products.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-orange-500"><Globe size={24} /></div>
                <div>
                  <h3 className="font-bold text-white">Responsive Design</h3>
                  <p className="text-slate-400 text-sm">Your website works perfectly on mobile, tablet, and desktop.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-orange-500"><Sparkles size={24} /></div>
                <div>
                  <h3 className="font-bold text-white">Brand-Focused Pages</h3>
                  <p className="text-slate-400 text-sm">Showcase music, drops, software, bookings, and contact details in one place.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-orange-500"><Code size={24} /></div>
                <div>
                  <h3 className="font-bold text-white">Fast Launch</h3>
                  <p className="text-slate-400 text-sm">Get your site ready quickly with clean, modern design and easy updates.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <div className="rounded-full border border-orange-600/30 px-6 py-4 text-xs uppercase tracking-[.3em] text-orange-400 font-bold bg-white/5">
                App development coming soon
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Request a Quote</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  value={fd.name}
                  onChange={(e) => setFd({...fd, name: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={fd.email}
                  onChange={(e) => setFd({...fd, email: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={fd.phone}
                  onChange={(e) => setFd({...fd, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type of Website *</label>
                <select
                  value={fd.websiteType}
                  onChange={(e) => setFd({...fd, websiteType: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:border-orange-500 focus:outline-none"
                  required
                >
                  <option value="">Select type</option>
                  <option value="portfolio">Portfolio Website</option>
                  <option value="ecommerce">E-commerce Store</option>
                  <option value="booking">Booking System</option>
                  <option value="blog">Blog/Content Site</option>
                  <option value="landing">Landing Page</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Features Needed</label>
                <textarea
                  value={fd.features}
                  onChange={(e) => setFd({...fd, features: e.target.value})}
                  placeholder="e.g., Contact form, Music player, Gallery, Booking system..."
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:border-orange-500 focus:outline-none h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Budget Range</label>
                <select
                  value={fd.budget}
                  onChange={(e) => setFd({...fd, budget: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Select budget</option>
                  <option value="under-500">Under $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-2000">$1,000 - $2,000</option>
                  <option value="2000-5000">$2,000 - $5,000</option>
                  <option value="over-5000">Over $5,000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Timeline</label>
                <select
                  value={fd.timeline}
                  onChange={(e) => setFd({...fd, timeline: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Select timeline</option>
                  <option value="asap">ASAP</option>
                  <option value="1-2-weeks">1-2 weeks</option>
                  <option value="1-month">1 month</option>
                  <option value="2-3-months">2-3 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Details</label>
                <textarea
                  value={fd.description}
                  onChange={(e) => setFd({...fd, description: e.target.value})}
                  placeholder="Tell us more about your project..."
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:border-orange-500 focus:outline-none h-32 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white px-6 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting...' : <><Send size={18} /> Submit Inquiry</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
          </div>

          <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-900 p-8">
            <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-pink-600 p-10 text-white shadow-2xl">
              <p className="uppercase text-xs tracking-[.35em] text-orange-100 font-bold">Website Offer</p>
              <h2 className="text-4xl font-black mt-4">Your DJ Brand Online</h2>
              <ul className="mt-8 space-y-4 text-slate-100 text-sm">
                <li>• Music catalog and mixtape pages</li>
                <li>• DJ drop order form integration</li>
                <li>• Contact and booking section</li>
                <li>• Payment link support and WhatsApp CTA</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
