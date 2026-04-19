import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface User { id: string; email: string; name?: string; }
interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = `https://${projectId}.supabase.co/functions/v1/make-98d801c7-music`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) { try { setUser(JSON.parse(stored)); } catch (e) { } }
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'apikey': publicAnonKey
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      // This is what throws the "VERSION 2" error to your screen
      throw new Error(data.error || 'Signup failed');
    }

    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'apikey': publicAnonKey
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => { setUser(null); localStorage.removeItem('user'); };

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.email === 'primerceug@gmail.com', login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth error');
  return context;
}