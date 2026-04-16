import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Lock, LogOut } from "lucide-react";
import { motion } from "motion/react";

interface AdminContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Admin password - In production, this should be environment variable
const ADMIN_PASSWORD = "enoch2026";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated (stored in sessionStorage)
    const authStatus = sessionStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminAuthProvider");
  }
  return context;
}

export function AdminLoginModal({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAdmin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      onClose();
    } else {
      setError("Invalid password");
      setPassword("");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-600 p-3 rounded-lg">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-gray-900 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
              placeholder="Enter admin password"
              autoFocus
            />
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-all"
          >
            Login
          </button>
        </form>
      </motion.div>
    </>
  );
}

export function AdminLogoutButton() {
  const { isAuthenticated, logout } = useAdmin();

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={logout}
      className="fixed top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 z-40 shadow-lg"
    >
      <LogOut className="w-4 h-4" />
      Logout Admin
    </button>
  );
}
