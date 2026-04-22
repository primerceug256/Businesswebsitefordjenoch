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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// THIS IS THE BASE URL FOR YOUR EDGE FUNCTION
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    const response = await fetch(`${API_BASE}/make-server-98d801c7/auth/signup`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${publicAnonKey}` 
      },
      body: JSON.stringify({ email, password, name }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(text || 'Signup failed on server'); 
    }

    if (!response.ok) throw new Error(data.error || 'Signup failed');
    setUser(data.user);
    localStorage.setItem('dj_user', JSON.stringify(data.user));
  };

  const login = async (email: string, password: string) => {
    // MATCHES YOUR BACKEND PATH EXACTLY TO AVOID 404
    const response = await fetch(`${API_BASE}/make-server-98d801c7/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${publicAnonKey}` 
      },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(text || 'Invalid Login Response');
    }

    if (!response.ok) throw new Error(data.error || 'Login failed');
    setUser(data.user);
    localStorage.setItem('dj_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dj_user');
    window.location.href = '/'; 
  };

  const isAdmin = user?.email === 'primerceug@gmail.com';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};