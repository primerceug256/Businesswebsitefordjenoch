import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
  profilePhoto?: string;
  subscription?: {
    plan: string;
    expiresAt: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('dj_enoch_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/server/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');

    setUser(data.user);
    localStorage.setItem('dj_enoch_user', JSON.stringify(data.user));
  };

  const signup = async (email: string, password: string, name: string) => {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/server/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Signup failed');

    setUser(data.user);
    localStorage.setItem('dj_enoch_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dj_enoch_user');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/server/user/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ userId: user.id, ...updates }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Update failed');

    const updatedUser = { ...user, ...data.user };
    setUser(updatedUser);
    localStorage.setItem('dj_enoch_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAdmin: !!user?.isAdmin, 
        login, 
        signup, 
        logout, 
        updateProfile,
        loading 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}