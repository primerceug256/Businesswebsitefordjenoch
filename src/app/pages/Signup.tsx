import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(email, password, name);
      alert('Signup successful! Check your email for verification.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white uppercase italic">Sign Up</h1>
          <p className="text-gray-400 mt-1">Join the party beast library</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm font-bold flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white outline-none focus:border-orange-500" 
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white outline-none focus:border-orange-500" 
          />
          <input 
            type="password" 
            placeholder="Password (min 6 characters)" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength={6}
            className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white outline-none focus:border-orange-500" 
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-orange-600 text-white py-4 rounded-xl font-black hover:bg-orange-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm font-bold">
          Already a member? <Link to="/login" className="text-orange-500 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}