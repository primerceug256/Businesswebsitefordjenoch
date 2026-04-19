import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Destructure functions from context
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');
    
    // Safety check to prevent "E is not a function"
    if (!auth || typeof auth.signup !== 'function') {
      setError("System Error: Signup function not found in context.");
      return;
    }

    setLoading(true);

    try {
      await auth.signup(email, password, name);
      navigate('/'); 
    } catch (err: any) {
      console.error("Signup error details:", err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
            <UserPlus size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Create Account</h1>
          <p className="text-gray-400 mt-2">Get 6 hours free access instantly!</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-orange-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input type="text" value={name} onChange={(val) => setName(val.target.value)} required className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl focus:border-orange-500 outline-none text-white transition-all font-bold" placeholder="Your Name" />
          </div>

          <div>
            <label className="block text-xs font-black text-orange-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input type="email" value={email} onChange={(val) => setEmail(val.target.value)} required className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl focus:border-orange-500 outline-none text-white transition-all font-bold" placeholder="email@example.com" />
          </div>

          <div>
            <label className="block text-xs font-black text-orange-500 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input type="password" value={password} onChange={(val) => setPassword(val.target.value)} required minLength={6} className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl focus:border-orange-500 outline-none text-white transition-all font-bold" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-4 rounded-xl font-black hover:bg-orange-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 uppercase tracking-widest">
            {loading ? <Loader2 className="animate-spin" /> : 'Claim Free Access'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 font-bold text-sm">
          Already a beast? <Link to="/login" className="text-orange-500 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}