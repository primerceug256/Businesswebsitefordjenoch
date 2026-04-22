import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabaseClient';
import { publicAnonKey, projectId } from '@utils/supabase/info';

interface User { id: string; email: string; name?: string; }

interface AuthContextType {
  user: User | null; isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Correct URL for the Supabase Function - includes the server namespace
const API_URL = `https://${projectId}.supabase.co/functions/v1/server/make-server-98d801c7`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? '', name: session.user.user_metadata?.name });
      } else {
        const stored = localStorage.getItem('dj_user');
        if (stored) setUser(JSON.parse(stored));
      }
      setLoading(false);
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? '', name: session.user.user_metadata?.name });
      } else if (_event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    const res = await fetch(`${API_URL}/auth/signup`, { // EXACT PATH REQUESTED BY SERVER
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ email, password, name }),
    });

    const text = await res.text();
    let data;
    try { 
      data = JSON.parse(text); 
    } catch (e) { 
      throw new Error("Server said: " + text); 
    }

    if (!res.ok) throw new Error(data.error || 'Signup Failed');
    setUser(data.user);
    localStorage.setItem('dj_user', JSON.stringify(data.user));
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, { // Use /login to match server endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text();
    let data;
    try { 
      data = JSON.parse(text); 
    } catch (e) { 
      throw new Error("Server said: " + text); 
    }

    if (!res.ok) throw new Error(data.error || 'Login Failed');
    setUser(data.user);
    localStorage.setItem('dj_user', JSON.stringify(data.user));
  };

  const googleLogin = async (credential: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ credential }),
      });

      const text = await res.text();
      let data;
      try { 
        data = JSON.parse(text); 
      } catch (e) { 
        throw new Error("Server said: " + text); 
      }

      if (!res.ok) throw new Error(data.error || 'Google login failed');
      setUser(data.user);
      localStorage.setItem('dj_user', JSON.stringify(data.user));
    } catch (err) {
      throw new Error('Google authentication failed: ' + String(err));
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('dj_user');
    window.location.href = '/';
  };

  const isAdmin = user?.email === 'primerceug@gmail.com';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, googleLogin, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};