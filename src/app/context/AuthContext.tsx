import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '@utils/supabase/info';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// YOUR SPECIFIC URL
const AUTH_API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on refresh
    const storedUser = localStorage.getItem('dj_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('dj_user');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    const response = await fetch(`${AUTH_API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${publicAnonKey}` 
      },
      body: JSON.stringify({ email, password, name }),
    });

    // FIX: Check if response is valid JSON
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(text || 'Signup Failed'); // Returns "Fail" or "Error" as the error message
    }

    if (!response.ok) throw new Error(data.error || 'Signup Failed');

    setUser(data.user);
    localStorage.setItem('dj_user', JSON.stringify(data.user));
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${AUTH_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${publicAnonKey}` 
      },
      body: JSON.stringify({ email, password }),
    });

    // FIX: Check if response is valid JSON
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(text || 'Invalid Credentials'); 
    }

    if (!response.ok) throw new Error(data.error || 'Login Failed');

    setUser(data.user);
    localStorage.setItem('dj_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dj_user');
    window.location.href = '/'; // Hard redirect to clear state
  };

  const googleLogin = async (credential: string) => {
    const response = await fetch(`${AUTH_API_URL}/auth/google`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${publicAnonKey}` 
      },
      body: JSON.stringify({ credential }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(text || 'Google Login Failed'); 
    }

    if (!response.ok) throw new Error(data.error || 'Google Login Failed');

    setUser(data.user);
    localStorage.setItem('dj_user', JSON.stringify(data.user));
  };

  const isAdmin = user?.email === 'primerceug@gmail.com';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, googleLogin, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}