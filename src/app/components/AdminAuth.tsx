import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
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
    const checkUser = (u: any) => {
      setUser(u);
      // Force lowercase check to prevent login errors
      const email = u?.email?.toLowerCase() || "";
      setIsAdmin(email === "primerceug@gmail.com");
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-black text-white font-black italic">DJ ENOCH PRO...</div>;

  return (
    <AuthContext.Provider value={{ user, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context || { user: null, isAdmin: false, signOut: async () => {} };
}

export function AuthModal({ onClose, mode = "login" }: { onClose: () => void, mode?: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(mode === "signup");
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    
    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        alert(error.message);
      } else {
        onClose();
        if (isSignUp) alert("Account created! Log in now.");
      }
    } catch (err) {
      alert("An unexpected error occurred.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-white rounded-[40px] p-8 w-full max-w-md text-black shadow-2xl">
        <h2 className="text-2xl font-black uppercase italic mb-1">
          {isSignUp ? "Join" : "Welcome"} <span className="text-orange-600">Beast</span>
        </h2>
        <p className="text-gray-400 text-[10px] font-bold uppercase mb-6">
          Admin Email: primerceug@gmail.com
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 bg-gray-100 rounded-2xl outline-none border-2 border-transparent focus:border-orange-500 font-bold" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-4 bg-gray-100 rounded-2xl outline-none border-2 border-transparent focus:border-orange-500 font-bold" value={password} onChange={e => setPassword(e.target.value)} required />
          
          <button disabled={authLoading} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase shadow-lg shadow-orange-600/30">
            {authLoading ? "Waiting..." : isSignUp ? "Create Account" : "Login Now"}
          </button>
        </form>

        <button onClick={() => setIsSignUp(!isSignUp)} className="w-full mt-6 text-[10px] font-black uppercase text-gray-400 hover:text-black">
          {isSignUp ? "Switch to Login" : "Switch to Sign Up"}
        </button>
        <button onClick={onClose} className="w-full mt-4 text-[10px] font-black uppercase text-red-500">Close</button>
      </div>
    </div>
  );
}