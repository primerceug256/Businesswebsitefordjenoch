import { Link } from 'react-router';
import { Code, Globe, Sparkles, Mail } from 'lucide-react';

export default function WebDevelopment() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
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
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-full font-bold transition-all"
              >
                <Mail size={18} /> Contact Us
              </Link>
              <div className="rounded-full border border-orange-600/30 px-6 py-4 text-xs uppercase tracking-[.3em] text-orange-400 font-bold bg-white/5">
                App development coming soon
              </div>
            </div>
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
