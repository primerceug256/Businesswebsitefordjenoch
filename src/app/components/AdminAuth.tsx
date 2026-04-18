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

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-black text-white font-black">DJ ENOCH PRO...</div>;

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

export function AuthModal({ onClose, initialMode = "login" }: { onClose: () => void, initialMode?: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    
    // For admin primerceug@gmail.com, use the password enoch256FAN
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    else {
      alert(isSignUp ? "Account created! Please check your email for a link." : "Logged in successfully!");
      onClose();
    }
    setAuthLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-white rounded-[40px] p-10 w-full max-w-md text-black shadow-2xl">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
          {isSignUp ? "Join The" : "Welcome"} <span className="text-orange-600">Beast</span>
        </h2>
        <p className="text-gray-400 text-xs font-bold uppercase mb-8">
          {isSignUp ? "Create a free account to get started" : "Login to access your downloads"}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase ml-2 text-gray-400">Email Address</label>
            <input type="email" placeholder="primerceug@gmail.com" className="w-full p-4 bg-gray-100 rounded-2xl outline-none border-2 border-transparent focus:border-orange-500 font-bold" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase ml-2 text-gray-400">Password</label>
            <input type="password" placeholder="••••••••" className="w-full p-4 bg-gray-100 rounded-2xl outli