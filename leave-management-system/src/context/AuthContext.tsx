import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (data: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    }
  }, []);

  // Save user to localStorage on login
  const login = (data: User) => {
    localStorage.setItem("auth_user", JSON.stringify(data));
    setUser(data);
  };

  // Remove user from localStorage on logout
  const logout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};