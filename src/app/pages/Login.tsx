import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-black text-white text-center uppercase italic mb-8">Login</h1>
        
        <button 
          onClick={loginWithGoogle}
          className="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 mb-6"
        >
          <FcGoogle size={24} /> Continue with Google
        </button>

        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-gray-800"></div>
          <span className="mx-4 text-gray-500 text-xs uppercase">Or Email</span>
          <div className="flex-grow border-t border-gray-800"></div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm font-bold flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white outline-none focus:border-orange-500" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white outline-none focus:border-orange-500" />
          <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-4 rounded-xl font-black uppercase hover:bg-orange-700">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Login'}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-500 text-sm font-bold">New? <Link to="/signup" className="text-orange-500">Sign Up</Link></p>
      </div>
    </div>
  );
}