import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface User {
  id: string;
  email: string;
  name?: string;
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
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/auth/login`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password }),
    });

    // Read body once
    const rawText = await response.text();

    // Debugging info
    console.log("login status:", response.status);
    console.log("login content-type:", response.headers.get("content-type"));
    console.log("login raw body:", rawText);

    // Try parse JSON
    let data;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch (e) {
      throw new Error(`Server returned non-JSON (or invalid JSON): ${rawText}`);
    }

    if (!response.ok) {
      throw new Error(data?.error || `Login failed (${response.status})`);
    }

    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const signup = async (email: string, password: string, name: string) => {
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/auth/signup`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password, name }),
    });

    const rawText = await response.text();
    
    console.log("signup status:", response.status);
    console.log("signup raw body:", rawText);

    let data;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch (e) {
      throw new Error(`Server returned non-JSON: ${rawText}`);
    }

    if (!response.ok) {
      throw new Error(data?.error || `Signup failed (${response.status})`);
    }

    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/user/update`;
    
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ userId: user.id, ...data }),
    });

    if (!response.ok) throw new Error('Update failed');
    
    const result = await response.json();
    setUser(result.user);
    localStorage.setItem('user', JSON.stringify(result.user));
  };

  const isAdmin = user?.email === 'primerceug@gmail.com';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}