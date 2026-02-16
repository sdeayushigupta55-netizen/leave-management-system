import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../type/user";
import { useUsers } from "./UserContext";
import { API_BASE_URL } from "../config";
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
  const { users } = useUsers();
  const [user, setUser] = useState<AuthUser | null>(() => {
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
    const stored = safeLocalStorage.getItem("auth_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        safeLocalStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Enhanced login: always use the full user object from users context (with profilPic)
  const login = (userData: AuthUser) => {
    let fullUser = users.find(u => u.id === userData.id || u.pno === userData.pno);
    if (!fullUser) {
      fullUser = userData;
    }
    const authUser: AuthUser = {
      ...fullUser,
      password: fullUser.password ?? ""
    };
    safeLocalStorage.setItem("auth_user", JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    safeLocalStorage.removeItem("auth_user");
    setUser(null);
  };

  const updateProfile = (updated: Partial<AuthUser>) => {
    if (!user) return;
    // Update backend
    fetch(`${API_BASE_URL}/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then((res) => res.json())
      .then((savedUser) => {
        safeLocalStorage.setItem("auth_user", JSON.stringify(savedUser));
        setUser(savedUser);
      });
  };

  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    if (!user) return false;
    if (user.password !== currentPassword) return false;

    // Update backend
    fetch(`${API_BASE_URL}/users/${user.id}/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    })
      .then((res) => res.json())
      .then((savedUser) => {
        safeLocalStorage.setItem("auth_user", JSON.stringify(savedUser));
        setUser(savedUser);
      });

    // Also update in UserContext
    updateUser(user.id, { password: newPassword });
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};