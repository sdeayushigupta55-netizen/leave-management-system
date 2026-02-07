import { createContext,useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../type/user";

// Safe localStorage helper for mobile compatibility
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.warn("localStorage not available");
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.warn("localStorage not available");
    }
  }
};

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateProfile: (updated: Partial<AuthUser>) => void;

  changePassword: (currentPassword: string, newPassword: string) => boolean;
}
interface AuthProviderProps {
  children: ReactNode;
  updateUser: (id: string, updated: Partial<AuthUser>) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children, updateUser }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Initialize from localStorage immediately to prevent flash
    const stored = safeLocalStorage.getItem("auth_user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Double-check localStorage on mount
    const stored = safeLocalStorage.getItem("auth_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // Invalid JSON, clear it
        safeLocalStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: AuthUser) => {
    safeLocalStorage.setItem("auth_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    safeLocalStorage.removeItem("auth_user");
    setUser(null);
  };

  const updateProfile = (updated: Partial<AuthUser>) => {
    if (!user) return;
    const newUser = { ...user, ...updated };
    safeLocalStorage.setItem("auth_user", JSON.stringify(newUser));
    setUser(newUser);
  };


  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    if (!user) return false;
    if (user.password !== currentPassword) return false;

    const updatedUser = { ...user, password: newPassword };
    safeLocalStorage.setItem("auth_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    updateUser(user.id, { password: newPassword });
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
import { useContext } from "react";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};