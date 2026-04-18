import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
// Path fix for info file
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

interface AuthContextType {
  user: any;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      setIsAdmin(u?.email === "primerceug@gmail.com");
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setIsAdmin(u?.email === "primerceug@gmail.com");
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-black text-white font-bold">CONNECTING TO PRIMERCE...</div>;

  return (
    <AuthContext.Provider value={{ user, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) return { user: null, isAdmin: false, signOut: async () => {} };
  return context;
}

export function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    else onClose();
    setAuthLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md text-black">
        <h2 className="text-2xl font-black uppercase mb-4">{isSignUp ? "Register" : "Login"}</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 bg-gray-100 rounded-xl" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-4 bg-gray-100 rounded-xl" value={password} onChange={e => setPassword(e.target.value)} required />
          <button disabled={authLoading} className="w-full bg-orange-600 text-white py-4 rounded-xl font-black uppercase shadow-lg disabled:opacity-50">
            {authLoading ? "Processing..." : isSignUp ? "Create Account" : "Login Now"}
          </button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="w-full mt-4 text-xs font-bold text-gray-400">
          {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </button>
        <button onClick={onClose} className="w-full mt-4 text-xs font-black text-red-500 uppercase">Cancel</button>
      </div>
    </div>
  );
}