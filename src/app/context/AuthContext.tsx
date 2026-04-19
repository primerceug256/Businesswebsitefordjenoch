import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ FIX 1: Safe localStorage parsing
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid JSON in localStorage:", storedUser);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // ✅ Helper to safely parse server response
  const parseJSON = async (response: Response) => {
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("Invalid JSON from server:", text);
      throw new Error("Server returned invalid JSON");
    }
  };

  // ✅ LOGIN
  const login = async (email: string, password: string) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await parseJSON(response);

    if (!response.ok) {
      throw new Error(data?.message || "Login failed");
    }

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  // ✅ SIGNUP
  const signup = async (email: string, password: string) => {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await parseJSON(response);

    if (!response.ok) {
      throw new Error(data?.message || "Signup failed");
    }

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};