import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./context/AuthContext";

interface AdminContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { isAdmin, logout: authLogout } = useAuth();

  // If the email is primerceug@gmail.com, you are already authenticated
  const isAuthenticated = isAdmin;

  const login = () => {
    // This is no longer needed but kept for compatibility
    return isAdmin;
  };

  const logout = () => {
    authLogout();
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminAuthProvider");
  return context;
}

// We hide the login modal entirely because you use the standard login page
export function AdminLoginModal() {
  return null; 
}

export function AdminLogoutButton() {
  const { isAdmin, logout } = useAuth();
  if (!isAdmin) return null;

  return (
    <button
      onClick={logout}
      className="fixed top-20 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold z-[100] shadow-2xl hover:scale-105 transition-all"
    >
      Exit Admin Mode
    </button>
  );
}