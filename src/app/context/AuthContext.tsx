import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ✅ LOGIN (Calling your custom Hono server)
  const login = async (email: string, password: string) => {
    const response = await fetch(
      // NOTE: Added /server/ here to match your folder structure
      `https://${projectId}.supabase.co/functions/v1/server/make-server-98d801c7/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Login failed");

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  // ✅ SIGNUP (Calling your custom Hono server)
  const signup = async (email: string, password: string, name: string) => {
    const response = await fetch(
      // NOTE: Added /server/ here to match your folder structure
      `https://${projectId}.supabase.co/functions/v1/server/make-server-98d801c7/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Signup failed");

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAdmin = user?.email === "primerceug@gmail.com";

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};