import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';
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

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/web-development/order`, {
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
            <h1 className="text-5xl font-black mt-4 uppercase italic tracking-tighter">W { projectId, publicAnonKey } from '/utils/supabase/info';
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

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/web-development/order`, {
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
          {/* Info Side */}
          <div>
            <span className="text-sm uppercase tracking-[.35em] text-orange-400 font-bold">New Service</span>
            <h1 className="text-5xl font-black mt-4 uppercase italic">Web Development</h1>
            <p className="mt-6 text-slate-400 text-lg leading-relaxed">
              Launch a professional online presence for your DJ brand. We build responsive websites designed for music, events, drops, and digital products.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-4">