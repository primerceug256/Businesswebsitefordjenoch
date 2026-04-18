import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

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

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === "primerceug@gmail.com");
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === "primerceug@gmail.com");
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AdminAuthProvider");
  return context;
}

// Updated Login Modal
export function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    else onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md text-black">
        <h2 className="text-2xl font-black uppercase mb-2">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
        <p className="text-gray-500 text-sm mb-6">Login to access your profile and purchases.</p>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" placeholder="Email Address" 
            className="w-full p-4 bg-gray-100 rounded-xl outline-none border-2 border-transparent focus:border-orange-500"
            value={email} onChange={e => setEmail(e.target.value)} required
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full p-4 bg-gray-100 rounded-xl outline-none border-2 border-transparent focus:border-orange-500"
            value={password} onChange={e => setPassword(e.target.value)} required
          />
          <button disabled={loading} className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase hover:bg-orange-600 transition-all">
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
        
        <button onClick={() => setIsSignUp(!isSignUp)} className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-black">
          {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </button>
        <button onClick={onClose} className="w-full mt-2 text-xs font-bold text-red-500 uppercase">Cancel</button>
      </div>
    </div>
  );
}