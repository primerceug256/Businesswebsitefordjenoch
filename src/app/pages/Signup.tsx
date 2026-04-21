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
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-black text-white text-center uppercase italic mb-8">Sign Up</h1>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm font-bold flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white outline-none focus:border-orange-500" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white outline-none focus:border-orange-500" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white outline-none focus:border-orange-500" />
          <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-4 rounded-xl font-black uppercase hover:bg-orange-700">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-500 text-sm font-bold">Already a member? <Link to="/login" className="text-orange-500">Login</Link></p>
      </div>
    </div>
  );
}