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
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const text = await response.text();
      console.log('Login response:', response.status, text.slice(0, 200));

      if (!response.ok) {
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || 'Login failed');
        } catch {
          throw new Error(`Login failed: ${text}`);
        }
      }

      const data = JSON.parse(text);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      const text = await response.text();
      console.log('Signup response:', response.status, text.slice(0, 200));

      if (!response.ok) {
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || 'Signup failed');
        } catch {
          throw new Error(`Signup failed: ${text}`);
        }
      }

      const data = JSON.parse(text);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/user/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ userId: user.id, ...data }),
        }
      );

      const text = await response.text();
      console.log('Update response:', response.status, text.slice(0, 200));

      if (!response.ok) {
        throw new Error(`Update failed: ${text}`);
      }

      const data = JSON.parse(text);
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
