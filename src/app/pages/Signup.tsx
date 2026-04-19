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
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page refresh
    setError('');
    setLoading(true);

    try {
      await signup(email, password, name);
      navigate('/'); 
    } catch (err: any) {
      setError(err.message || 'Signup failed. Try a different email.');
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
          <h1 className="text-3xl font-black text-white tracking-tight">Create Account</h1>
          <p className="text-gray-400 mt-2">Get 6 hours free access instantly!</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl focus:border-orange-500 outline-none text-white transition-all" placeholder="Enter your name" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl focus:border-orange-500 outline-none text-white transition-all" placeholder="email@example.com" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl focus:border-orange-500 outline-none text-white transition-all" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-4 rounded-xl font-black hover:bg-orange-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : 'START FREE ACCESS'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 font-medium">
          Already a beast? <Link to="/login" className="text-orange-500 font-black hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}